import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (token: string) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>; // 초기화 액션 추가
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  isInitializing: true, // 앱 시작 시 기본값은 true

  login: async (token) => {
    try {
      await SecureStore.setItemAsync('accessToken', token);
      set({ accessToken: token, isAuthenticated: true });
    } catch (e) {
      console.error("Failed to save the token", e);
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('accessToken');
      set({ accessToken: null, isAuthenticated: false });
    } catch (e) {
      console.error("Failed to remove the token", e);
    }
  },
  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('accessToken');
      if (token) {
        set({ accessToken: token, isAuthenticated: true });
      }
    } catch (e) {
      console.error("Failed to load the token", e);
    } finally {
      set({ isInitializing: false }); // 초기화 완료
    }
  },
}));