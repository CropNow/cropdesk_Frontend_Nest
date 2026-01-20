export const STORAGE_KEYS = {
  USERS_COLLECTION: 'app_users',
  CURRENT_USER: 'user', // Active session user
  REGISTERED_USER_LEGACY: 'registeredUser', // Legacy key, we might keep it synced for now or abandon it
};

/**
 * Retrieves a specific user's data from the multi-user collection.
 */
export const getStoredUser = (email: string) => {
  try {
    const collectionStr = localStorage.getItem(STORAGE_KEYS.USERS_COLLECTION);
    if (!collectionStr) return null;

    const collection = JSON.parse(collectionStr);
    // Normalize email to lowercase for consistent keys
    return collection[email.toLowerCase()] || null;
  } catch (error) {
    console.error('Error reading from user collection', error);
    return null;
  }
};

/**
 * Saves a user's data to the multi-user collection.
 * Merges with existing data for that user if it exists.
 */
export const saveStoredUser = (user: any) => {
  if (!user || !user.email) {
    console.warn('Cannot save user without email');
    return;
  }

  try {
    const emailKey = user.email.toLowerCase();
    const collectionStr = localStorage.getItem(STORAGE_KEYS.USERS_COLLECTION);
    const collection = collectionStr ? JSON.parse(collectionStr) : {};

    // Get existing data to merge, so we don't lose fields not present in 'user' argument
    const existing = collection[emailKey] || {};

    // Merge: New data overrides existing
    const updatedUser = { ...existing, ...user };

    // Update collection
    collection[emailKey] = updatedUser;
    localStorage.setItem(
      STORAGE_KEYS.USERS_COLLECTION,
      JSON.stringify(collection)
    );

    // Also sync to legacy 'registeredUser' if this is the active user, for safety
    // But primarily we rely on collection now.
    // localStorage.setItem(STORAGE_KEYS.REGISTERED_USER_LEGACY, JSON.stringify(updatedUser)); // Optional, might cause confusion

    return updatedUser;
  } catch (error) {
    console.error('Error saving to user collection', error);
  }
};

/**
 * Sets the active session user (the one currently logged in).
 * This updates the global 'user' key used by AuthProvider.
 */
export const setCurrentSession = (user: any) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    // Also sync the legacy key just in case some components still read it blindly
    localStorage.setItem(
      STORAGE_KEYS.REGISTERED_USER_LEGACY,
      JSON.stringify(user)
    );
  } catch (error) {
    console.error('Error setting current session', error);
  }
};

/**
 * Clears the active session but KEEPS the user in the collection.
 */
export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.REGISTERED_USER_LEGACY);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
