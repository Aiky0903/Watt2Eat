import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { io } from "socket.io-client";
import { toast } from "sonner";

export const useAdvertStore = create((set) => ({
  activeAdverts: [],
  selectedAdvert: null,

  isActiveAdvertsLoading: false,
  isAdvertLoading: false,

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
  },

  fetchAdvertById: async (advertId) => {
    set({ isAdvertLoading: true });
    try {
      const res = await axiosInstance.get(`/advert/${advertId}`);
      set({ selectedAdvert: res.data.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch advert");
    } finally {
      set({ isAdvertLoading: false });
    }
  }
}))