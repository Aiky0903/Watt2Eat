import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useUserStore = create((set, get) => ({
  // Current User
  // {
  // studentID: user.studentID,
  // email: user.email,
  // username: user.username,
  // phone: user.phone,
  // ordersPlaced: user.ordersPlaced,
  // }
  user: null,
  onlineUsers: [],

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
      set({ user: res.data.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checking Auth: ", error);
      set({ user: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  registerUser: async (form) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/users/registerUser", form);
      set({ user: res.data.data });
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  loginUser: async (form) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/users/loginUser", form);
      set({ user: res.data.data });
      toast.success(res.data.message);
      get().connectSocket();
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
        get().disconnectSocket();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error is signing out: ", error.message);
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    const { user } = get();
    if (!user || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        email: user.email,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (emails) => {
      set({ onlineUsers: emails });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
