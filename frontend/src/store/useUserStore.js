import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useUserStore = create((set) => ({
  loading: false,

  updateProfile: async (profileData) => {
    set({ loading: true });

    try {
      const { data } = await axiosInstance.put(
        "/api/users/update",
        profileData,
      );
      useAuthStore.setState({ authUser: data.user });
      toast.success("Profile updated successfully.");
      return true;
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to update your profile.";
      toast.error(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
