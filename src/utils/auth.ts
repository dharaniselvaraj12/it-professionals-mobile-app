import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  expertise?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  created_at?: string;
  updated_at?: string;
}

export const AuthUtils = {
  // Store user data and token
  async storeAuthData(token: string, userData: User): Promise<void> {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  },

  // Get stored user token
  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  // Get stored user data
  async getUserData(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Check if user is logged in
  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return !!token;
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  },

  // Clear all auth data (logout)
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userData']);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  },

  // Update user data
  async updateUserData(userData: User): Promise<void> {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  },
};

export default AuthUtils;
