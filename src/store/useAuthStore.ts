import { create } from 'zustand';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  role: string;
}

interface AuthState {
  profile: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (accessToken: string, profile: User) => void;
  logout: () => void;
  initialize: () => void; // Checks local storage on app load
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  accessToken: null,
  isAuthenticated: false,

  login: (accessToken, profile) => {
    localStorage.setItem('jwt_token', accessToken);
    localStorage.setItem('user_profile', JSON.stringify(profile));
    set({ accessToken, profile, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_profile');
    set({ accessToken: null, profile: null, isAuthenticated: false });
  },

  initialize: () => {
    const accessToken = localStorage.getItem('jwt_token');
    const profileStr = localStorage.getItem('user_profile');
    
    if (accessToken && accessToken !== 'undefined' && accessToken !== 'null' && profileStr && profileStr !== 'undefined') {
      try {
        const profile = JSON.parse(profileStr);
        set({ accessToken, profile, isAuthenticated: true });
      } catch (e) {
        // Corrupt user data
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_profile');
      }
    }
  },
}));
