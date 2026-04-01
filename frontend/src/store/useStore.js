import { create } from 'zustand';

const useStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  notifications: [],

  setUser: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  addNotification: (notification) => 
    set((state) => ({ 
      notifications: [notification, ...state.notifications] 
    })),

  clearNotifications: () => set({ notifications: [] }),
}));

export default useStore;
