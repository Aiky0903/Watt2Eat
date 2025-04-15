import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
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

  loginUser: async (form) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/loginUser", form);
      set({ user: res.data.data });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logoutUser: async () => {
    try {
      const res = await axiosInstance.get("/users/logoutUser");
      if (res.data.success) {
        toast.success(res.data.message);
        set({ user: null });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error is signing out: ", error.message);
      toast.error(error.response.data.message);
    }
  },
}));
