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
  // Using String comparison to avoid type mismatches (number vs string) which causes UI to "lose" the selected item
  const selectedFarmer = farmers.find(
    (f) => String(f.id || f._id) === String(selectedFarmerId)
  );
  const selectedFarm = selectedFarmer?.farms?.find(
    (f: any) => String(f.id || f._id) === String(selectedFarmId)
  );
  const selectedField = selectedFarm?.fields?.find(
    (f: any) => String(f.id || f._id) === String(selectedFieldId)
  );
  const selectedCrop = selectedField?.crops?.find(
    (c: any) => String(c.id || c._id) === String(selectedCropId)
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

      saveStoredUser(user);
    }
  };

  // Helper to ensure ID consistency
  const normalizeData = (data: any[]) => {
    return data.map((item) => ({
      ...item,
      id: item.id || item._id, // Ensure 'id' property exists
    }));
  };

  // Fetch Crops for a specific field on demand
  const fetchCropsForField = async (fieldId: string) => {
    try {
      const { getCropsByField } = await import('@/features/auth/api/crop.api');
      const rawCrops = await getCropsByField(fieldId);
      return normalizeData(rawCrops || []);
    } catch (e) {
      console.warn(`Failed to fetch crops for field ${fieldId}`, e);
      return [];
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
        const rawFarmers = await getAllFarmers();
        const apiFarmers = normalizeData(rawFarmers || []);

        if (apiFarmers && apiFarmers.length > 0) {
          // Filter Farmers to only show those belonging to the current user
          let enrichedFarmers = apiFarmers;
          if (currentUser && currentUser.id) {
            enrichedFarmers = apiFarmers.filter((f: any) => {
              const fUserId =
                f.userId && typeof f.userId === 'object'
                  ? f.userId._id || f.userId.id
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
          let allFarms: any[] = [];
          try {
            const { getFarms } = await import('@/features/auth/api/farm.api');
            const farmsResponse = await getFarms(1, 100);
            allFarms = normalizeData(farmsResponse.farms || []);
          } catch (err) {
            console.error('Error fetching farms:', err);
          }

          // Map Farms to Farmers
          if (allFarms.length > 0) {
            enrichedFarmers = enrichedFarmers.map((farmer: any) => {
              const farmerId = farmer.id;
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

          // B. Fetch Fields (Global fetch)
          // We fetch all fields but optimize matching
          try {
            const { getFields } = await import('@/features/auth/api/field.api');
            const rawFields = await getFields({});
            const allFields = normalizeData(rawFields || []);

            if (allFields.length > 0) {
              // Map Fields to Farms
              enrichedFarmers = enrichedFarmers.map((farmer: any) => {
                if (!farmer.farms) return farmer;

                const enrichedFarms = farmer.farms.map((farm: any) => {
                  const farmId = farm.id;
                  const myFields = allFields.filter((field: any) => {
                    const fFarm = field.farmId || field.farm;
                    const fFarmId =
                      typeof fFarm === 'object' && fFarm
                        ? fFarm.id || fFarm._id
                        : fFarm;
                    return String(fFarmId) === String(farmId);
                  });

                  // Initialize crops array but DO NOT fetch them yet
                  const fieldsWithPlaceholders = myFields.map((field: any) => ({
                    ...field,
                    crops: [], // Placeholder, will be fetched on select
                  }));

                  return { ...farm, fields: fieldsWithPlaceholders };
                });
                return { ...farmer, farms: enrichedFarms };
              });
            }
          } catch (err) {
            console.error('Error fetching fields:', err);
          }

          setFarmers(enrichedFarmers);

          // Auto-Select Logic
          if (enrichedFarmers.length > 0) {
            const firstFarmer = enrichedFarmers[0];
            if (firstFarmer) {
              handleSetSelectedFarmerId(firstFarmer.id);
              if (firstFarmer.farms?.length > 0) {
                const firstFarm = firstFarmer.farms[0];
                handleSetSelectedFarmId(firstFarm.id);
                if (firstFarm.fields?.length > 0) {
                  const firstField = firstFarm.fields[0];
                  // Only set ID, which will trigger lazy load if we implement it in effect
                  // For now, simple set
                  handleSetSelectedFieldId(firstField.id);
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
      const normalizedFarmer = {
        ...createdFarmer,
        id: createdFarmer.id || (createdFarmer as any)._id,
      };

      const updated = [...farmers, { ...normalizedFarmer, farms: [] }];
      setFarmers(updated);
      persistFarmers(updated);

      handleSetSelectedFarmerId(normalizedFarmer.id);
    } catch (error) {
      console.error('Failed to create farmer', error);
      alert('Failed to create farmer.');
    }
  };

  const updateFarmer = async (id: string, updates: any) => {
    try {
      const { updateFarmer } = await import('@/features/auth/api/farmer.api');
      const updatedFarmerRes = await updateFarmer(id, updates);
      const normalizedRes = {
        ...updatedFarmerRes,
        id: updatedFarmerRes.id || (updatedFarmerRes as any)._id,
      };

      const updated = farmers.map((f) =>
        f.id === id || f._id === id ? { ...f, ...normalizedRes } : f
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
          handleSetSelectedFarmerId(updated[0].id || updated[0]._id);
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

      const farmPayload = { ...newFarm, farmerId: selectedFarmerId };

      // Sanitize Area
      if (
        farmPayload.area !== undefined &&
        farmPayload.area !== '' &&
        !isNaN(Number(farmPayload.area))
      ) {
        farmPayload.area = Number(farmPayload.area);
      } else {
        delete farmPayload.area; // Remove if empty/invalid
      }

      // Sanitize Location Data for Backend
      if (farmPayload.location) {
        const loc = { ...farmPayload.location };

        // Latitude
        if (
          loc.latitude !== undefined &&
          loc.latitude !== '' &&
          !isNaN(Number(loc.latitude))
        ) {
          loc.latitude = Number(loc.latitude);
        } else {
          delete loc.latitude;
        }

        // Longitude
        if (
          loc.longitude !== undefined &&
          loc.longitude !== '' &&
          !isNaN(Number(loc.longitude))
        ) {
          loc.longitude = Number(loc.longitude);
        } else {
          delete loc.longitude;
        }

        farmPayload.location = loc;
      }

      console.log('Creating Farm Payload:', farmPayload);

      const createdFarm = await createFarm(farmPayload);
      const normalizedFarm = {
        ...createdFarm,
        id: createdFarm.id || (createdFarm as any)._id,
        fields: [],
      };

      const updated = farmers.map((f) => {
        if (f.id === selectedFarmerId || f._id === selectedFarmerId) {
          return { ...f, farms: [...(f.farms || []), normalizedFarm] };
        }
        return f;
      });
      setFarmers(updated);
      persistFarmers(updated);

      handleSetSelectedFarmId(normalizedFarm.id);
    } catch (error: any) {
      console.error(
        'Failed to create farm. Payload:',
        newFarm,
        'Error:',
        error
      );
      alert(
        `Failed to create farm: ${error.response?.data?.message || error.message}`
      );
    }
  };

  const updateFarm = async (id: string, updates: any) => {
    try {
      const { updateFarm } = await import('@/features/auth/api/farm.api');

      const farmPayload = { ...updates };

      // Sanitize Area
      if (
        farmPayload.area !== undefined &&
        farmPayload.area !== '' &&
        !isNaN(Number(farmPayload.area))
      ) {
        farmPayload.area = Number(farmPayload.area);
      }

      // Sanitize Location (if updating location)
      if (farmPayload.location) {
        const loc = { ...farmPayload.location };
        if (loc.latitude && !isNaN(Number(loc.latitude)))
          loc.latitude = Number(loc.latitude);
        if (loc.longitude && !isNaN(Number(loc.longitude)))
          loc.longitude = Number(loc.longitude);
        farmPayload.location = loc;
      }

      const updatedFarm = await updateFarm(id, farmPayload);
      const normalizedRes = {
        ...updatedFarm,
        id: updatedFarm.id || (updatedFarm as any)._id,
      };

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          const updatedFarms = farmer.farms.map((farm: any) =>
            farm.id === id || farm._id === id
              ? { ...farm, ...normalizedRes }
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

      // Sanitize Area
      if (
        fieldPayload.area !== undefined &&
        fieldPayload.area !== '' &&
        !isNaN(Number(fieldPayload.area))
      ) {
        fieldPayload.area = Number(fieldPayload.area);
      } else {
        delete fieldPayload.area;
      }

      // Ensure coordinates is sent as Object if it's a a JSON string
      if (fieldPayload.coordinates) {
        if (typeof fieldPayload.coordinates === 'string') {
          try {
            fieldPayload.coordinates = JSON.parse(fieldPayload.coordinates);
          } catch (e) {
            console.warn(
              'Invalid coordinates string, removing:',
              fieldPayload.coordinates
            );
            delete fieldPayload.coordinates;
          }
        }
      } else {
        delete fieldPayload.coordinates;
      }

      console.log('Creating Field Payload:', fieldPayload);

      const createdField = await createField(selectedFarmId, fieldPayload);
      const normalizedField = {
        ...createdField,
        id: createdField.id || (createdField as any)._id,
        crops: [],
      };

      const updated = farmers.map((farmer) => {
        if (farmer.id === selectedFarmerId || farmer._id === selectedFarmerId) {
          return {
            ...farmer,
            farms: farmer.farms.map((farm: any) => {
              if (farm.id === selectedFarmId || farm._id === selectedFarmId) {
                return {
                  ...farm,
                  fields: [...(farm.fields || []), normalizedField],
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

      handleSetSelectedFieldId(normalizedField.id);
    } catch (error: any) {
      console.error('Failed to create field', error);
      alert(
        `Failed to create field: ${error.response?.data?.message || 'Unknown error'}`
      );
    }
  };

  const updateField = async (id: string, updates: any) => {
    try {
      const { updateField } = await import('@/features/auth/api/field.api');

      const fieldPayload = { ...updates };
      if (
        fieldPayload.coordinates &&
        typeof fieldPayload.coordinates === 'string'
      ) {
        try {
          fieldPayload.coordinates = JSON.parse(fieldPayload.coordinates);
        } catch (e) {}
      }

      const updatedField = await updateField(id, fieldPayload);
      const normalizedRes = {
        ...updatedField,
        id: updatedField.id || (updatedField as any)._id,
      };

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
                      ? { ...field, ...normalizedRes }
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
      console.log('Creating Crop Payload:', newCrop);
      const { createCrop } = await import('@/features/auth/api/crop.api');
      const createdCrop = await createCrop(selectedFieldId, newCrop);
      const normalizedCrop = {
        ...createdCrop,
        id: createdCrop.id || (createdCrop as any)._id,
      };

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
                        crops: [...(field.crops || []), normalizedCrop],
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
      handleSetSelectedCropId(normalizedCrop.id);
    } catch (error: any) {
      console.error('Failed to create crop', error);
      alert(
        `Failed to create crop: ${error.response?.data?.message || 'Unknown error'}`
      );
    }
  };

  const updateCrop = async (id: string, updates: any) => {
    try {
      const { updateCrop } = await import('@/features/auth/api/crop.api');
      const updatedCropRes = await updateCrop(id, updates);
      const normalizedRes = {
        ...updatedCropRes,
        id: updatedCropRes.id || (updatedCropRes as any)._id,
      };

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
                            ? { ...crop, ...normalizedRes }
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

  // Wrapper for selecting Logic to handle hierarchy selection & FRESH FETCH
  const handleSetSelectedFarmerId = async (id: string) => {
    setSelectedFarmerId(String(id));
    setSelectedFarmId('');
    setSelectedFieldId('');
    setSelectedCropId('');

    if (!id) return;

    try {
      // FRESH FETCH for Details
      const { getFarmerById } = await import('@/features/auth/api/farmer.api');
      const freshFarmer = await getFarmerById(id);

      // Update this farmer in the state with fresh details
      setFarmers((prev) =>
        prev.map((f) =>
          String(f.id || f._id) === String(id) ? { ...f, ...freshFarmer } : f
        )
      );

      // Auto Select First Farm logic
      if (freshFarmer && freshFarmer.farms && freshFarmer.farms.length > 0) {
        const firstFarm = freshFarmer.farms[0];
        if (firstFarm) {
          handleSetSelectedFarmId(firstFarm.id || (firstFarm as any)._id);
        }
      }
    } catch (e) {
      console.error('Failed to fetch fresh farmer details', e);
    }
  };

  const handleSetSelectedFarmId = async (id: string) => {
    setSelectedFarmId(String(id));
    setSelectedFieldId('');
    setSelectedCropId('');

    if (!id) return;

    try {
      const { getFarmById } = await import('@/features/auth/api/farm.api');
      const freshFarm = await getFarmById(id);

      setFarmers((prev) => {
        return prev.map((farmer) => {
          if (String(farmer.id || farmer._id) === String(selectedFarmerId)) {
            return {
              ...farmer,
              farms: farmer.farms.map((f: any) =>
                String(f.id || f._id) === String(id)
                  ? { ...f, ...freshFarm }
                  : f
              ),
            };
          }
          return farmer;
        });
      });

      // Auto Select First Field
      if (freshFarm && freshFarm.fields && freshFarm.fields.length > 0) {
        const firstField = freshFarm.fields[0];
        if (firstField) {
          handleSetSelectedFieldId(firstField.id || (firstField as any)._id);
        }
      }
    } catch (e) {
      console.error('Failed to fetch fresh farm details', e);
    }
  };

  const handleSetSelectedFieldId = async (id: string) => {
    setSelectedFieldId(String(id));
    setSelectedCropId('');

    if (!id) return;

    try {
      const { getFieldById } = await import('@/features/auth/api/field.api');
      // We also need crops for this field since we optimized them away!
      const { getCropsByField } = await import('@/features/auth/api/crop.api');

      const freshField = await getFieldById(id);
      const freshCropsRaw = await getCropsByField(id);
      const freshCrops = normalizeData(freshCropsRaw || []);

      setFarmers((prev) => {
        return prev.map((farmer) => {
          if (String(farmer.id || farmer._id) === String(selectedFarmerId)) {
            return {
              ...farmer,
              farms: farmer.farms.map((farm: any) => {
                if (String(farm.id || farm._id) === String(selectedFarmId)) {
                  return {
                    ...farm,
                    fields: farm.fields.map((field: any) =>
                      String(field.id || field._id) === String(id)
                        ? { ...field, ...freshField, crops: freshCrops }
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
      });

      // Auto Select First Crop
      if (freshCrops && freshCrops.length > 0) {
        handleSetSelectedCropId(freshCrops[0].id);
      }
    } catch (e) {
      console.error('Failed to fetch fresh field details', e);
    }
  };

  const handleSetSelectedCropId = async (id: string) => {
    setSelectedCropId(String(id));

    if (!id) return;

    try {
      const { getCropById } = await import('@/features/auth/api/crop.api');
      const freshCrop = await getCropById(id);

      setFarmers((prev) => {
        return prev.map((farmer) => {
          if (String(farmer.id || farmer._id) === String(selectedFarmerId)) {
            return {
              ...farmer,
              farms: farmer.farms.map((farm: any) => {
                if (String(farm.id || farm._id) === String(selectedFarmId)) {
                  return {
                    ...farm,
                    fields: farm.fields.map((field: any) => {
                      if (
                        String(field.id || field._id) ===
                        String(selectedFieldId)
                      ) {
                        return {
                          ...field,
                          crops: field.crops.map((crop: any) =>
                            String(crop.id || crop._id) === String(id)
                              ? { ...crop, ...freshCrop }
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
      });
    } catch (e) {
      console.error('Failed to fetch fresh crop details', e);
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
        setSelectedFieldId: handleSetSelectedFieldId,
        setSelectedCropId: handleSetSelectedCropId,
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
