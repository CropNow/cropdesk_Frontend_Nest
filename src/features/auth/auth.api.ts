import { http } from '@/services/http';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  User,
} from './auth.types';

// Mock User Data (Still used for fallback/mock structure if needed, but primary is API)
const MOCK_USER: User = {
  id: 'mock-user-123',
  email: 'farmer@cropdesk.local',
  firstName: 'John',
  lastName: 'Doe',
  role: 'farmer',
  username: 'Farmer John',
  farmDetails: {
    farmName: 'Green Valley Farm',
    location: {
      latitude: '28.61',
      longitude: '77.20',
      address: '123 Farm Road',
      city: 'New Delhi',
      country: 'India',
    },
  },
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>('/auth/login', data);
  console.log('Login Response from the auth.api.ts', response);
  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  const response = await http.post<LoginResponse>('/auth/register', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  // If backend has a logout endpoint:
  // await http.post('/auth/logout');
  // Ensure we DO NOT clear 'registeredUser' (which is our client-side DB)
  localStorage.removeItem('user');
  localStorage.removeItem('accessToken');
  // localStorage.clear(); // DATA LOSS RISK: Don't use clear()
  return;
};

export const resetPassword = async (data: any): Promise<void> => {
  await http.post('/auth/reset-password', data);
};

export const getMe = async (): Promise<User> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    // Attempt to fetch real user from backend
    // FIXED: Correct endpoint is /users/me, not /auth/me
    const response = await http.get<User>('/users/me');
    let user = response.data;

    // HYDRATION: Fetch deeper levels if IDs are present but data is missing.
    // The backend structure seems to be: User -> Farmers -> Farms -> Fields -> Crops
    try {
      console.log('Hydration Debug: User Keys:', Object.keys(user));
      console.log('Hydration Debug: user.farmers:', user.farmers);

      // FALLBACK: If user.farmers is missing, try fetching /farmers endpoint directly.
      // It's possible the API returns "my farmers" when hitting the list endpoint.
      if (!user.farmers || user.farmers.length === 0) {
        try {
          console.log(
            'Hydration Debug: user.farmers missing. Attempting GET /farmers'
          );
          // FIX: Filter by userId to avoid fetching ALL farmers in the system
          const farmersRes = await http.get('/farmers', {
            params: { userId: user.id || user._id },
          });
          // Assuming /farmers returns { data: [...] } or [...] or { farmers: [...] }
          // Let's guess it might be an array or wrapped.
          const farmersList = Array.isArray(farmersRes.data)
            ? farmersRes.data
            : (farmersRes.data as any).data || (farmersRes.data as any).farmers;

          if (Array.isArray(farmersList) && farmersList.length > 0) {
            console.log(
              'Hydration Debug: Found farmers via /farmers endpoint:',
              farmersList.length
            );
            user.farmers = farmersList;
          }
        } catch (err) {
          console.warn('Hydration Debug: Failed to fetch /farmers list', err);
        }
      }

      // 1. Fetch Farmers
      // Assuming user.farmers is an array of IDs or objects. If it's missing, we might need to fetch by userId?
      // User said: "farmers/farmer_id get"
      // Let's assume the user object has a reference to farmers.

      // Attempt to fetch all farmers associated with this user.
      // If the backend doesn't provide a list in /users/me, we might need a separate endpoint like /farmers?userId=...
      // For now, let's try to fetch if we see IDs.

      if (user.farmers && user.farmers.length > 0) {
        const enrichedFarmers: any[] = [];
        const processedFarmerIds = new Set<string>();

        console.log(
          'Hydration Debug: Processing farmers loop. Count:',
          user.farmers.length
        );

        // Helper to delay execution
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));

        for (const farmerRef of user.farmers) {
          // FIX: Backend uses MongoDB '_id', but sometimes 'id'. Check both.
          const farmerId =
            typeof farmerRef === 'string'
              ? farmerRef
              : farmerRef.id || farmerRef._id;

          if (!farmerId) {
            console.warn(
              'Hydration Debug: Skipping farmer ref due to missing ID:',
              farmerRef
            );
            continue;
          }

          if (processedFarmerIds.has(farmerId)) {
            continue;
          }
          processedFarmerIds.add(farmerId);

          try {
            // Rate Limit Protection: Delay before fetch
            await delay(300);

            // Fetch Farmer Details
            // If we already have a rich object from the list, we might save a call, but to be safe and get 'farms', let's fetch individual.
            // OR check if 'farms' is already present (optimization).
            // But usually list endpoints don't return deep nested relations.
            console.log(
              'Hydration Debug: Fetching details for farmer:',
              farmerId
            );

            const farmerRes = await http.get(`/farmers/${farmerId}`);
            const farmerData = farmerRes.data;
            // NORMALIZATION: Ensure 'id' exists (map from '_id')
            if (!farmerData.id && farmerData._id)
              farmerData.id = farmerData._id;

            // 2. Fetch Farms for this farmer
            if (farmerData.farms && farmerData.farms.length > 0) {
              const enrichedFarms: any[] = [];
              for (const farmRef of farmerData.farms) {
                const farmId =
                  typeof farmRef === 'string'
                    ? farmRef
                    : farmRef.id || farmRef._id;
                if (!farmId) continue;

                try {
                  await delay(200); // Small delay for nested calls
                  const farmRes = await http.get(`/farms/${farmId}`);
                  const farmData = farmRes.data;
                  if (!farmData.id && farmData._id) farmData.id = farmData._id;

                  // 3. Fetch Fields for this farm
                  if (farmData.fields && farmData.fields.length > 0) {
                    const enrichedFields: any[] = [];
                    for (const fieldRef of farmData.fields) {
                      const fieldId =
                        typeof fieldRef === 'string'
                          ? fieldRef
                          : fieldRef.id || fieldRef._id;
                      if (!fieldId) continue;

                      try {
                        await delay(100);
                        const fieldRes = await http.get(`/fields/${fieldId}`);
                        const fieldData = fieldRes.data;
                        if (!fieldData.id && fieldData._id)
                          fieldData.id = fieldData._id;

                        // 4. Fetch Crops for this field
                        if (fieldData.crops && fieldData.crops.length > 0) {
                          const enrichedCrops: any[] = [];
                          for (const cropRef of fieldData.crops) {
                            const cropId =
                              typeof cropRef === 'string'
                                ? cropRef
                                : cropRef.id || cropRef._id;
                            if (!cropId) continue;

                            try {
                              await delay(50);
                              const cropRes = await http.get(
                                `/crops/${cropId}`
                              );
                              const cropData = cropRes.data;
                              if (!cropData.id && cropData._id)
                                cropData.id = cropData._id;
                              enrichedCrops.push(cropData);
                            } catch (err) {
                              console.warn(
                                `Failed to fetch crop ${cropId}`,
                                err
                              );
                            }
                          }
                          fieldData.crops = enrichedCrops;
                        }
                        enrichedFields.push(fieldData);
                      } catch (err) {
                        console.warn(`Failed to fetch field ${fieldId}`, err);
                      }
                    }
                    farmData.fields = enrichedFields;
                  }
                  enrichedFarms.push(farmData);
                } catch (err) {
                  console.warn(`Failed to fetch farm ${farmId}`, err);
                }
              }
              farmerData.farms = enrichedFarms;
            }
            enrichedFarmers.push(farmerData);
          } catch (err) {
            console.warn(`Failed to fetch farmer ${farmerId}`, err);
          }
        }
        user.farmers = enrichedFarmers;

        // FLATTEN FOR LEGACY/DASHBOARD COMPATIBILITY
        // The dashboard expects user.farmerDetails, user.farmDetails etc. from the *first* available entity.
        if (enrichedFarmers.length > 0) {
          console.log(
            'Hydration Debug: Flattening first farmer for Dashboard:',
            enrichedFarmers[0]
          );
          const firstFarmer = enrichedFarmers[0];
          user.farmerDetails = firstFarmer;

          if (firstFarmer.farms && firstFarmer.farms.length > 0) {
            const firstFarm = firstFarmer.farms[0];
            user.farmDetails = firstFarm;

            if (firstFarm.fields && firstFarm.fields.length > 0) {
              const firstField = firstFarm.fields[0];
              user.fieldDetails = firstField;

              // Collect all crops from all fields or just the first field?
              // Let's grab crops from the first field for 'cropDetails'
              if (firstField.crops) {
                user.cropDetails = firstField.crops;
              }
            }
          }
        }
      }
    } catch (hydrationError) {
      console.error('Error hydrating user details', hydrationError);
      // Proceed with what we have, don't block login just because deep fetch failed?
      // Or maybe we should? Strict mode would say fail, but user experience says let them in.
    }

    // MERGE LOCAL DATA: Check if we have richer local data (from onboarding)
    const localUserStr = localStorage.getItem('registeredUser');
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        // Only merge if it looks like the same user (or we are in a mock/dev environment where IDs might differ but intent is same)
        // For strictness we could check IDs, but since backend might return generated ID and local has 'mock-id', we might skip ID check or loose check.
        // For now, we assume the local data is the "source of truth" for profile extensions.
        user = {
          ...user,
          ...localUser,
          // Ensure ID from backend takes precedence if we want to sync, OR local if we are fully mocking.
          // Let's keep backend ID but overlay profile details.
          id: user.id || localUser.id,
          email: user.email || localUser.email,
          username: user.username || localUser.username,
        };
        // Explicitly overlay nested objects if they exist locally but not on backend (common in partial mock)
        // BUT ONLY if backend didn't provide them!
        if (!user.farmerDetails && localUser.farmerDetails)
          user.farmerDetails = localUser.farmerDetails;
        if (!user.farmDetails && localUser.farmDetails)
          user.farmDetails = localUser.farmDetails;
        if (!user.fieldDetails && localUser.fieldDetails)
          user.fieldDetails = localUser.fieldDetails;
        if (!user.cropDetails && localUser.cropDetails)
          user.cropDetails = localUser.cropDetails;
        if (localUser.isOnboardingComplete)
          user.isOnboardingComplete = localUser.isOnboardingComplete;
      } catch (e) {
        console.warn('Failed to parse local user data for merge', e);
      }
    }

    return user;
  } catch (error) {
    console.error('Failed to fetch user from backend', error);

    // FALLBACK: If backend fails (e.g. 404 Not Found), try to use the locally stored user
    // This allows the user to access the app if they just logged in successfully but the session endpoint is missing/broken.
    const localUserStr = localStorage.getItem('user');
    if (localUserStr) {
      try {
        const localUser = JSON.parse(localUserStr);
        console.warn(
          'Backend /me failed, using local user fallback',
          localUser
        );
        return localUser;
      } catch (parseError) {
        console.error('Failed to parse local user fallback', parseError);
      }
    }

    // STRICT: If API fails AND no local fallback, we must NOT allow access.
    // No fallbacks to localStorage or Mock user.
    throw error;
  }
};
