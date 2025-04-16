import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { io } from "socket.io-client";
import { toast } from "sonner";

export const useAdvertStore = create((set) => ({
  activeAdverts: [],
  
  isActiveAdvertsLoading: false,
}))