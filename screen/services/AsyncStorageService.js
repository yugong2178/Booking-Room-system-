import AsyncStorage from '@react-native-async-storage/async-storage';

const AsyncStorageService = {
  // Save entire user object
  saveUser: async (user) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('User data saved:', user);
    } catch (e) {
      console.error('Error saving user:', e);
    }
  },

  // Get entire user object
  getUser: async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (e) {
      console.error('Error retrieving user:', e);
    }
  },

  // Save a specific field (e.g. phone number, email)
  saveUserField: async (field, value) => {
    try {
      const user = await AsyncStorageService.getUser();
      const updatedUser = user ? { ...user, [field]: value } : { [field]: value };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      console.log(`User field "${field}" saved with value:`, value);
    } catch (e) {
      console.error(`Error saving field ${field}:`, e);
    }
  },

  // Get a specific field (e.g. phone number, email)
  getUserField: async (field) => {
    try {
      const user = await AsyncStorageService.getUser();
      return user ? user[field] : null;
    } catch (e) {
      console.error(`Error retrieving field ${field}:`, e);
    }
  },

  // Clear user data (useful for logout)
  clearUser: async () => {
    try {
      await AsyncStorage.removeItem('user');
      console.log('User data cleared');
    } catch (e) {
      console.error('Error clearing user data:', e);
    }
  },
};

export default AsyncStorageService;