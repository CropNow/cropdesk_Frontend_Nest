/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, ReactNode } from 'react';
import { ProfileContext } from './ProfileContext';
import { getStoredUser, saveStoredUser } from '@/utils/storage';

interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider = ({ children }: ProfileProviderProps) => {
  // Hierarchy State
  const [farmers, setFarmers] = useState<any[]>([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('');
  const [selectedFarmId, setSelectedFarmId] = useState<string>('');
  const [selectedFieldId, setSelectedFieldId] = useState<string>('');
  const [selectedCropId, setSelectedCropId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Derived Selected Objects
  const selectedFarmer = farmers.find(
    (f) => f.id === selectedFarmerId || f._id === selectedFarmerId
  );
  const selectedFarm = selectedFarmer?.farms?.find(
    (f: any) => f.id === selectedFarmId || f._id === selectedFarmId
  );
  const selectedField = selectedFarm?.fields?.find(
    (f: any) => f.id === selectedFieldId || f._id === selectedFieldId
  );
  const selectedCrop = selectedField?.crops?.find(
    (c: any) => c.id === selectedCropId || c._id === selectedCropId
  );

  // Persistence Helper
  const persistFarmers = (updatedFarmers: any[]) => {
    const sessionStr = localStorage.getItem('user');
    if (sessionStr) {
      const sessionUser = JSON.parse(sessionStr);
      if (!sessionUser.email) return;

      // Get latest from collection or fall back to session
      const user = getStoredUser(sessionUser.email) || sessionUser;

      // Update Hierarchy
      user.farmers = updatedFarmers;

      // Update Flat Lists to match Hierarchy (Cascading Delete Support)
      const allFarms: any[] = [];
      const allFields: any[] = [];
      const allCrops: any[] = [];

      updatedFarmers.forEach((farmer) => {
        if (farmer.farms) {
          allFarms.push(...farmer.farms);
          farmer.farms.forEach((farm: any) => {
            if (farm.fields) {
              allFields.push(...farm.fields);
              farm.fields.forEach((field: any) => {
                if (field.crops) {
                  allCrops.push(...field.crops);
                }
              });
            }
          });
        }
      });

      user.farms = allFarms;
      user.fields = allFields;
      user.crops = allCrops;

      // Update single object refs if they were deleted (optional, but good for consistency)
      if (!allFarms.find((f) => f.id === user.farmDetails?.id))
        user.farmDetails = {};
      if (!allFields.find((f) => f.id === user.fieldDetails?.id))
        user.fieldDetails = {};
      if (!allCrops.find((c) => c.id === user.cropDetails?.id))
        user.cropDetails = {};

      saveStoredUser(user);
    }
  };

  // Load Data
  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const sessionStr = localStorage.getItem('user');
        let currentUser = sessionStr ? JSON.parse(sessionStr) : null;

        // Fetch Deep Hierarchy Manually
        const { getAllFarmers } =
          await import('@/features/auth/api/farmer.api');
        const apiFarmers = await getAllFarmers();

        if (apiFarmers && apiFarmers.length > 0) {
          // Filter Farmers to only show those belonging to the current user
          let enrichedFarmers = apiFarmers;
          if (currentUser && currentUser.id) {
            enrichedFarmers = apiFarmers.filter((f: any) => {
              const fUserId =
                f.userId && typeof f.userId === 'object'
                  ? f.userId._id
                  : f.userId;
              return (
                String(fUserId) === String(currentUser.id) ||
                String(f.farmerUserId) === String(currentUser.id)
              );
            });
          }

          if (enrichedFarmers.length === 0) {
            console.warn('No farmers found for current user.');
          }

          // A. Fetch Farms
          try {
            const { getFarms } = await import('@/features/auth/api/farm.api');
            const farmsResponse = await getFarms(1, 100);
            const allFarms = farmsResponse.farms || [];

            if (allFarms.length > 0) {
              // Map Farms to Farmers
              enrichedFarmers = enrichedFarmers.map((farmer: any) => {
                const farmerId = farmer.id || (farmer as any)._id;
                const myFarms = allFarms.filter((farm: any) => {
                  const fOwner = farm.farmerId || (farm as any).farmer;
                  const fOwnerId =
                    typeof fOwner === 'object' && fOwner
                      ? fOwner.id || fOwner._id
                      : fOwner;
                  return String(fOwnerId) === String(farmerId);
                });
                return { ...farmer, farms: myFarms };
              });
            }
          } catch (err) {
            console.error('Error fetching farms:', err);
          }

          // B. Fetch Fields (Global fetch)
          try {
            const { getFields } = await import('@/features/auth/api/field.api');
            const allFields = await getFields({}); // Fetch all fields for user

            if (allFields.length > 0) {
              // C. Fetch Crops for these fields (N+1 but necessary if no global crop endpoint)
              const { getCropsByField } =
                await import('@/features/auth/api/crop.api');

              // Promise.all to fetch crops for each field
              const fieldsWithCrops = await Promise.all(
                allFields.map(async (field: any) => {
                  const fieldId = field.id || (field as any)._id;
                  try {
                    const crops = await getCropsByField(fieldId);
                    return { ...field, crops: crops || [] };
                  } catch (e) {
                    // console.warn(`Failed to fetch crops for field ${fieldId}`, e);
                    return { ...field, crops: [] };
                  }
                })
              );

              // Map Fields (with crops) to Farms
              enrichedFarmers = enrichedFarmers.map((farmer: any) => {
                if (!farmer.farms) return farmer;

                const enrichedFarms = farmer.farms.map((farm: any) => {
                  const farmId = farm.id || (farm as any)._id;
                  const myFields = fieldsWithCrops.filter((field: any) => {
                    const fFarm = field.farmId || field.farm;
                    const fFarmId =
                      typeof fFarm === 'object' && fFarm
                        ? fFarm.id || fFarm._id
                        : fFarm;
                    return String(fFarmId) === String(farmId);
                  });
                  return { ...farm, fields: myFields };
                });
                return { ...farmer, farms: enrichedFarms };
              });
            }
          } catch (err) {
            console.error('Error fetching fields/crops:', err);
          }

          setFarmers(enrichedFarmers);

          // Auto-Select Logic
          if (enrichedFarmers.length > 0) {
            const firstFarmer = enrichedFarmers[0];
            if (firstFarmer) {
              const firstFarmerId = firstFarmer.id || (firstFarmer as any)._id;
              setSelectedFarmerId(firstFarmerId);

              if (firstFarmer.farms && firstFarmer.farms.length > 0) {
                const firstFarm = firstFarmer.farms[0];
                if (firstFarm) {
                  const firstFarmId = firstFarm.id || (firstFarm as any)._id;
                  setSelectedFarmId(firstFarmId);

                  if (firstFarm.fields && firstFarm.fields.length > 0) {
                    const firstField = firstFarm.fields[0];
                    if (firstField) {
                      const firstFieldId =
                        firstField.id || (firstField as any)._id;
                      setSelectedFieldId(firstFieldId);

                      if (firstField.crops && firstField.crops.length > 0) {
                        const firstCrop = firstField.crops[0];
                        if (firstCrop) {
                          const firstCropId =
                            firstCrop.id || (firstCrop as any)._id;
                          setSelectedCropId(firstCropId);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          setFarmers([]);
        }
      } catch (e) {
        console.error('Profile Data Fetch Error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  // CRUD Handlers

  // --- Farmer ---
  const addFarmer = async (newFarmer: any) => {
    try {
      const { createFarmer } = await import('@/features/auth/api/farmer.api');
      const createdFarmer = await createFarmer(newFarmer);

      const updated = [...farmers, { ...createdFarmer, farms: [] }];
      setFarmers(updated);
      persistFarmers(updated);

      const newId = createdFarmer.id || (createdFarmer as any)._id;
      setSelectedFarmerId(newId);
    } catch (error) {
      console.error('Failed to create farmer', error);
      alert('Failed to create farmer.');
    }
  };

  const updateFarmer = async (id: string, updates: any) => {
    try {
      const { updateFarmer } = await import('@/features/auth/api/farmer.api');
      const updatedFarmerRes = await updateFarmer(id, updates);

      const updated = farmers.map((f) =>
        f.id === id || f._id === id ? { ...f, ...updatedFarmerRes } : f
      );
      setFarmers(updated);
      persistFarmers(updated);
    } catch (error) {
      console.error('Failed to update farmer', error);
      alert('Failed to update farmer. Please try again.');
    }
  };

  const deleteFarmer = async (id: string) => {
    try {
      const { deleteFarmer } = await import('@/features/auth/api/farmer.api');
      await deleteFarmer(id);

      const updated = farmers.filter((f) => f.id !== id && f._id !== id);
      setFarmers(updated);
      persistFarmers(updated);

      if (selectedFarmerId === id) {
        if (updated.length > 0) {
          const nextId = updated[0].id || updated[0]._id;
          setSelectedFarmerId(nextId);
          // Need to cascade select down logic here technically but simplified for now
        } else {
          setSelectedFarmerId('');
          setSelectedFarmId('');
          setSelectedFieldId('');
          setSelectedCropId('');
        }
      }
    } catch (error) {
      console.error('Failed to delete farmer', error);
      alert('Failed to delete farmer.');
    }
  };

  // --- Farm ---
  const addFarm = async (newFarm: any) => {
    if (!selectedFarmerId) return;

    try {
      const { createFarm } = await import('@/features/auth/api/farm.api');

      // Sanitize location to string if it's an object, to satisfy backend expectation
      const farmPayload = { ...newFarm, farmerId: selectedFarmerId };
      if (farmPayload.location && typeof farmPayload.location === 'object') {
        farmPayload.location = JSON.stringify(farmPayload.location);
      }

      // Ensure area is a number
      if (farmPayload.area) {
        farmPayload.area = Number(farmPayload.area);
      }

      console.log(
        'DEBUG: Sending createFarm payload:',
        JSON.stringify(farmPayload, null, 2)
      );

      const createdFarm = await createFarm(farmPayload);
      console.log('DEBUG: Create Farm Success:', createdFarm);
      const createdFarmId = createdFarm.id || (createdFarm as any)._id;

      const updated = farmers.map((f) => {
        if (f.id === selectedFarmerId || f._id === selectedFarmerId) {
          // Initialize fields array for the new farm
          const farmWithStats = { ...createdFarm, fields: [] };
          return { ...f, farms: [...(f.farms || []), farmWithStats] };
        }
        return f;
      });
      setFarmers(updated);
      persistFarmers(updated);
      setSelectedFarmId(createdFarmId);
    } catch (error: any) {
      console.error('DEBUG: Create Farm Error Response:', error.response?.data);
      console.error('DEBUG: Create Farm Error Status:', error.response?.status);
      console.error('Failed to create farm', error);
      alert('Failed to create farm.');
    }
  };

  const updateFarm = async (id: string, updates: any) => {
    try {
      const { updateFarm } = await import('@/features/auth/api/farm.api');

      const farmPayload = { ...updates };
      if (farmPayload.location && typeof farmPayload.location === 'object') {
        farmPayload.location = JSON.stringify(farmPayload.location);
      }

      // Ensure area is a number
      if (farmPayload.area) {
        farmPayload.area = Number(farmPayload.area);
      }

      const updatedFarm = await updateFarm(id, farmPayload);

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          const updatedFarms = farmer.farms.map((farm: any) =>
            farm.id === id || farm._id === id
              ? { ...farm, ...updatedFarm }
              : farm
          );
          return { ...farmer, farms: updatedFarms };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
    } catch (error) {
      console.error('Failed to update farm', error);
      alert('Failed to update farm.');
    }
  };

  const deleteFarm = async (id: string) => {
    try {
      const { deleteFarm } = await import('@/features/auth/api/farm.api');
      await deleteFarm(id);

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.filter((f: any) => f.id !== id && f._id !== id),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
      if (updated.length > 0 && selectedFarmId === id) {
        setSelectedFarmId('');
        setSelectedFieldId('');
        setSelectedCropId('');
      }
    } catch (error) {
      console.error('Failed to delete farm', error);
      alert('Failed to delete farm.');
    }
  };

  // --- Field ---
  const addField = async (newField: any) => {
    if (!selectedFarmId || !selectedFarmerId) return;

    try {
      const { createField } = await import('@/features/auth/api/field.api');

      const fieldPayload = { ...newField };
      if (fieldPayload.area) {
        fieldPayload.area = Number(fieldPayload.area);
      }

      console.log(
        'DEBUG: Sending createField payload:',
        JSON.stringify(fieldPayload, null, 2),
        'for farmId:',
        selectedFarmId
      );

      const createdField = await createField(selectedFarmId, fieldPayload);
      console.log('DEBUG: Create Field Success:', createdField);

      const createdFieldId = createdField.id || (createdField as any)._id;

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.map((farm: any) => {
              if (farm.id === selectedFarmId || farm._id === selectedFarmId) {
                const field = { ...createdField, crops: [] };
                return { ...farm, fields: [...(farm.fields || []), field] };
              }
              return farm;
            }),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
      setSelectedFieldId(createdFieldId);
    } catch (error: any) {
      console.error(
        'DEBUG: Create Field Error Response:',
        error.response?.data
      );
      console.error(
        'DEBUG: Create Field Error Status:',
        error.response?.status
      );
      console.error('Failed to create field', error);
      alert('Failed to create field.');
    }
  };

  const updateField = async (id: string, updates: any) => {
    try {
      const { updateField } = await import('@/features/auth/api/field.api');
      const updatedField = await updateField(id, updates);

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.map((farm: any) => {
              if (farm.id === selectedFarmId || farm._id === selectedFarmId) {
                return {
                  ...farm,
                  fields: farm.fields.map((field: any) =>
                    field.id === id || field._id === id
                      ? { ...field, ...updatedField }
                      : field
                  ),
                };
              }
              return farm;
            }),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
    } catch (error) {
      console.error('Failed to update field', error);
      alert('Failed to update field.');
    }
  };

  const deleteField = async (id: string) => {
    try {
      const { deleteField } = await import('@/features/auth/api/field.api');
      await deleteField(id);

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.map((farm: any) => {
              if (farm.id === selectedFarmId || farm._id === selectedFarmId) {
                return {
                  ...farm,
                  fields: farm.fields.filter(
                    (field: any) => field.id !== id && field._id !== id
                  ),
                };
              }
              return farm;
            }),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
      if (selectedFieldId === id) {
        setSelectedFieldId('');
        setSelectedCropId('');
      }
    } catch (error) {
      console.error('Failed to delete field', error);
      alert('Failed to delete field.');
    }
  };

  // --- Crop ---
  const addCrop = async (newCrop: any) => {
    if (!selectedFieldId || !selectedFarmId || !selectedFarmerId) return;

    try {
      const { createCrop } = await import('@/features/auth/api/crop.api');
      const createdCrop = await createCrop(selectedFieldId, newCrop);
      const createdCropId = createdCrop.id || (createdCrop as any)._id;

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.map((farm: any) => {
              if (farm.id === selectedFarmId || farm._id === selectedFarmId) {
                return {
                  ...farm,
                  fields: farm.fields.map((field: any) => {
                    if (
                      field.id === selectedFieldId ||
                      field._id === selectedFieldId
                    ) {
                      return {
                        ...field,
                        crops: [...(field.crops || []), createdCrop],
                      };
                    }
                    return field;
                  }),
                };
              }
              return farm;
            }),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
      setSelectedCropId(createdCropId);
    } catch (error) {
      console.error('Failed to create crop', error);
      alert('Failed to create crop.');
    }
  };

  const updateCrop = async (id: string, updates: any) => {
    try {
      const { updateCrop } = await import('@/features/auth/api/crop.api');
      const updatedCropRes = await updateCrop(id, updates);

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.map((farm: any) => {
              if (farm.id === selectedFarmId || farm._id === selectedFarmId) {
                return {
                  ...farm,
                  fields: farm.fields.map((field: any) => {
                    if (
                      field.id === selectedFieldId ||
                      field._id === selectedFieldId
                    ) {
                      return {
                        ...field,
                        crops: field.crops.map((crop: any) =>
                          crop.id === id || crop._id === id
                            ? { ...crop, ...updatedCropRes }
                            : crop
                        ),
                      };
                    }
                    return field;
                  }),
                };
              }
              return farm;
            }),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
    } catch (error) {
      console.error('Failed to update crop', error);
      alert('Failed to update crop.');
    }
  };

  const deleteCrop = async (id: string) => {
    try {
      const { deleteCrop } = await import('@/features/auth/api/crop.api');
      await deleteCrop(id);

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.map((farm: any) => {
              if (farm.id === selectedFarmId || farm._id === selectedFarmId) {
                return {
                  ...farm,
                  fields: farm.fields.map((field: any) => {
                    if (
                      field.id === selectedFieldId ||
                      field._id === selectedFieldId
                    ) {
                      return {
                        ...field,
                        crops: field.crops.filter(
                          (c: any) => c.id !== id && c._id !== id
                        ),
                      };
                    }
                    return field;
                  }),
                };
              }
              return farm;
            }),
          };
        }
        return farmer;
      });
      setFarmers(updated);
      persistFarmers(updated);
      if (selectedCropId === id) setSelectedCropId('');
    } catch (error) {
      console.error('Failed to delete crop', error);
      alert('Failed to delete crop.');
    }
  };

  // Wrapper for selecting Logic to handle hierarchy selection
  const handleSetSelectedFarmerId = (id: string) => {
    setSelectedFarmerId(id);
    // Logic from Profile.tsx handleFarmerSelect
    const farmer = farmers.find((f) => f.id === id || f._id === id);
    if (farmer && farmer.farms && farmer.farms.length > 0) {
      const firstFarm = farmer.farms[0];
      const firstFarmId = firstFarm.id || firstFarm._id;
      setSelectedFarmId(firstFarmId);
      if (firstFarm.fields && firstFarm.fields.length > 0) {
        const firstField = firstFarm.fields[0];
        const firstFieldId = firstField.id || firstField._id;
        setSelectedFieldId(firstFieldId);
      } else {
        setSelectedFieldId('');
      }
    } else {
      setSelectedFarmId('');
      setSelectedFieldId('');
    }
  };

  const handleSetSelectedFarmId = (id: string) => {
    setSelectedFarmId(id);
    // Logic from Profile.tsx handleFarmSelect
    const farm = selectedFarmer?.farms?.find(
      (f: any) => f.id === id || f._id === id
    );
    if (farm && farm.fields && farm.fields.length > 0) {
      const firstField = farm.fields[0];
      const firstFieldId = firstField.id || firstField._id;
      setSelectedFieldId(firstFieldId);
    } else {
      setSelectedFieldId('');
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        farmers,
        selectedFarmerId,
        selectedFarmId,
        selectedFieldId,
        selectedCropId,
        loading,
        selectedFarmer,
        selectedFarm,
        selectedField,
        selectedCrop,
        setSelectedFarmerId: handleSetSelectedFarmerId,
        setSelectedFarmId: handleSetSelectedFarmId,
        setSelectedFieldId,
        setSelectedCropId,
        addFarmer,
        updateFarmer,
        deleteFarmer,
        addFarm,
        updateFarm,
        deleteFarm,
        addField,
        updateField,
        deleteField,
        addCrop,
        updateCrop,
        deleteCrop,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
