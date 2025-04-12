import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: null,
  isCheckingAuth: true,

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
