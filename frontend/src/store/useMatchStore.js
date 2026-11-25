import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message || error.message || fallback;

export const useMatchStore = create((set, get) => ({
  profiles: [],
  matches: [],
  likesYou: [],
  profilesLoading: false,
  matchesLoading: false,
  likesYouLoading: false,
  swipingUserId: null,
  profilesError: "",
  matchesError: "",
  likesYouError: "",

  loadProfiles: async () => {
    if (get().profilesLoading) return;
    set({ profilesLoading: true, profilesError: "" });

    try {
      const { data } = await axiosInstance.get("/api/users");
      set({ profiles: data.users });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load profiles.");
      set({ profilesError: message });
      toast.error(message);
    } finally {
      set({ profilesLoading: false });
    }
  },

  loadMatches: async () => {
    if (get().matchesLoading) return;
    set({ matchesLoading: true, matchesError: "" });

    try {
      const { data } = await axiosInstance.get("/api/matches");
      set({ matches: data.matches });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load your matches.");
      set({ matchesError: message });
      toast.error(message);
    } finally {
      set({ matchesLoading: false });
    }
  },

  loadLikesYou: async () => {
    if (get().likesYouLoading) return;
    set({ likesYouLoading: true, likesYouError: "" });

    try {
      const { data } = await axiosInstance.get("/api/matches/likes");
      set({ likesYou: data.likes });
    } catch (error) {
      const message = getErrorMessage(error, "Unable to load incoming likes.");
      set({ likesYouError: message });
      toast.error(message);
    } finally {
      set({ likesYouLoading: false });
    }
  },

  addMatch: (match) => {
    if (!match?._id) return;
    set((state) => ({
      matches: state.matches.some(
        (currentMatch) => currentMatch._id === match._id,
      )
        ? state.matches
        : [match, ...state.matches],
      likesYou: state.likesYou.filter(
        (profile) => profile._id !== match._id,
      ),
    }));
  },

  swipeRight: async (userId) => {
    if (get().swipingUserId) return false;
    set({ swipingUserId: userId });

    try {
      const { data } = await axiosInstance.post(
        `/api/matches/swipe-right/${userId}`,
      );
      set((state) => ({
        profiles: state.profiles.filter((profile) => profile._id !== userId),
        likesYou: state.likesYou.filter((profile) => profile._id !== userId),
      }));

      if (data.matched) {
        toast.success("It's a match!");
        await get().loadMatches();
      }

      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to like this profile."));
      return false;
    } finally {
      set({ swipingUserId: null });
    }
  },

  swipeLeft: async (userId) => {
    if (get().swipingUserId) return false;
    set({ swipingUserId: userId });

    try {
      await axiosInstance.post(`/api/matches/swipe-left/${userId}`);
      set((state) => ({
        profiles: state.profiles.filter((profile) => profile._id !== userId),
        likesYou: state.likesYou.filter((profile) => profile._id !== userId),
      }));
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error, "Unable to pass on this profile."));
      return false;
    } finally {
      set({ swipingUserId: null });
    }
  },
}));
