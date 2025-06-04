import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const useAppStore = create((set, get) => ({
  isLoggedIn: false,
  isAuthChecked: false,
  userData: null,
  injectionHistory: [],
  users: [],

  setIsLoggedIn: (val) => set({ isLoggedIn: val }),
  setUserData: (data) => set({ userData: data }),

  getAuthState: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/auth/is-auth`, { withCredentials: true });
      if (data.success) {
        // Get user data first, then set login state
        await get().getUserData();
        set({ isLoggedIn: true });
        get().getInjectionHistory();
        get().getAllUser();
      } else {
        set({ isLoggedIn: false, userData: null });
      }
    } catch (error) {
      set({ isLoggedIn: false, userData: null });
    } finally {
      set({ isAuthChecked: true });
    }
  },

  getUserData: async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/profile`, { withCredentials: true });
      if (data.success) {
        set({ userData: data.data });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  },

  getInjectionHistory: async (id) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/user/injection-history/${id ? id : ""}`, { withCredentials: true });
      if (data.success) {
        set({ injectionHistory: data.data });
      }
    } catch (error) {
      console.error("Error fetching injection history:", error);
    }
  },

  getAllUser: async () => {
    const user = get().userData;
    if (!user || user.role !== "admin") {
      return; // Only admins can fetch all users
    }

    try {
      const { data } = await axios.get(`${API_URL}/api/user/all`, { withCredentials: true });
      if (data.success) {
        set({ users: data.data });
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  },

  deleteUser: async (id) => {
    toast.promise(axios.delete(`${API_URL}/api/user/delete/${id}`, { withCredentials: true }), {
      pending: "Deleting user...",
      success: {
        render({ data }) {
          // Refresh user list after successful deletion
          get().getAllUser();
          return `🗑️ ${data.data.message}`;
        },
      },
      error: {
        render({ data }) {
          const errorMessage = data?.response?.data?.message || "Failed to delete user";
          return errorMessage;
        },
      },
    });
  },

  injectionConfirmation: async () => {
    try {
      const { data } = await axios.patch(`${import.meta.env.VITE_API_URL}/api/user/confirmation`, {}, { withCredentials: true });
      if (data.success) {
        toast.success(data.message);
        get().getUserData();
        get().getInjectionHistory();
      }
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useAppStore;
