import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { io } from "socket.io-client";
import { toast } from "sonner";

export const useAdvertStore = create((set) => ({
  activeAdverts: [],
  selectedAdvert: null,
  
  isActiveAdvertsLoading: false,

  fetchActiveAdverts: async () => {
    set({ isActiveAdvertsLoading: true });
    try {
      const res = await axiosInstance.get("/advert/getActiveAdverts");
      set({ activeAdverts: res.data.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isActiveAdvertsLoading: false });
    }
  }
}))