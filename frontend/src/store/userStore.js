import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useUserStore = create((set, get) => ({
  // Current User
  user: null,

  // Loading States
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  // User socket connection to the server
  socket: null,

  // Check if the current user is authenticated
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/users/loginStatus");
      set({ user: res.data });
    } catch (error) {
      console.log("Error in checking Auth: ", error);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
}));
