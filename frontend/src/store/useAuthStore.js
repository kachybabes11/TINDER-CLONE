import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const useAuthStore = create((set) => ({
  authUser: null,
  loading: "",
  checkingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isLoggingOut: false,

  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const { data } = await axiosInstance.get("/api/auth/me");
      set({ authUser: data.user });
    } catch (error) {
      set({ authUser: null });
      if (error.response?.status !== 401) {
        toast.error(getErrorMessage(error, "Unable to check your session."));
      }
    } finally {
      set({ checkingAuth: false });
    }
  },

  signUp: async (formData) => {
    set({ isSigningUp: true });

    try {
      const { data } = await axiosInstance.post("/api/auth/signup", formData);
      set({ authUser: data.user });
      toast.success("Account created successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to create your account."));
      return false;
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (credentials) => {
    set({ isLoggingIn: true });

    try {
      const { data } = await axiosInstance.post(
        "/api/auth/signin",
        credentials,
      );
      set({ authUser: data.user });
      toast.success("Signed in successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to sign in."));
      return false;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });

    try {
      await axiosInstance.post("/api/auth/logout");
      set({ authUser: null });
      toast.success("Signed out successfully.");
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to sign out."));
      return false;
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
