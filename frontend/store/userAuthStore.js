import create from "zustand";

export const useUserStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
}));
