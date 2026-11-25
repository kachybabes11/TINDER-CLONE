import { useCallback, useEffect, useState } from "react";
import { Heart, UsersRound } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import SwipeArea from "../components/SwipeArea";
import { useMatchStore } from "../store/useMatchStore";

const HomePage = () => {
  const loadProfiles = useMatchStore((state) => state.loadProfiles);
  const loadMatches = useMatchStore((state) => state.loadMatches);
  const loadLikesYou = useMatchStore((state) => state.loadLikesYou);
  const matches = useMatchStore((state) => state.matches);
  const likesYou = useMatchStore((state) => state.likesYou);
  const [isMatchesOpen, setIsMatchesOpen] = useState(false);
  const closeMatches = useCallback(() => setIsMatchesOpen(false), []);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    void loadProfiles();
    void loadMatches();
    void loadLikesYou();
  }, [loadLikesYou, loadMatches, loadProfiles]);

  useEffect(() => {
    if (!location.state?.openMatches) return;
    setIsMatchesOpen(true);
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.search, location.state, navigate]);

  return (
    <main className="relative flex min-h-[calc(100vh-4.5rem)] flex-col bg-slate-50 px-4 py-7 sm:px-6">
      <div className="relative mx-auto w-full max-w-7xl text-center">
        <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-pink-600">
          <Heart aria-hidden="true" fill="currentColor" size={15} />
          Discover
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Find your connection
        </h1>
        <p className="mt-1 text-slate-600">
          Browse profiles and see where a right swipe leads.
        </p>
        <button
          aria-expanded={isMatchesOpen}
          aria-haspopup="dialog"
          className="absolute right-0 top-0 inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-pink-50 hover:text-pink-700 sm:px-4"
          onClick={() => setIsMatchesOpen(true)}
          type="button"
        >
          <UsersRound aria-hidden="true" size={18} />
          <span className="hidden sm:inline">Matches</span>
          <span className="rounded-full bg-pink-100 px-2 py-0.5 text-xs text-pink-700">
            {matches.length + likesYou.length}
          </span>
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center py-6">
        <div className="w-full max-w-md">
          <SwipeArea />
        </div>
      </div>

      <Sidebar
        isOpen={isMatchesOpen}
        onClose={closeMatches}
      />
    </main>
  );
};

export default HomePage;
