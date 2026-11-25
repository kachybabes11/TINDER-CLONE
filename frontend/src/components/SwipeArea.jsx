import { useRef, useState } from "react";
import { Heart, RotateCw, X } from "lucide-react";
import { SwipeCardSkeleton } from "./LoadingSkeletons";
import SwipeFeedback from "./SwipeFeedback";
import { useMatchStore } from "../store/useMatchStore";

const SwipeArea = () => {
  const profiles = useMatchStore((state) => state.profiles);
  const profilesLoading = useMatchStore((state) => state.profilesLoading);
  const profilesError = useMatchStore((state) => state.profilesError);
  const swipingUserId = useMatchStore((state) => state.swipingUserId);
  const loadProfiles = useMatchStore((state) => state.loadProfiles);
  const swipeLeft = useMatchStore((state) => state.swipeLeft);
  const swipeRight = useMatchStore((state) => state.swipeRight);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const pointerStartX = useRef(null);
  const activeProfile = profiles[0];

  const swipe = async (direction) => {
    if (!activeProfile || swipingUserId) return;

    setIsDragging(false);
    setDragX(direction === "right" ? 600 : -600);
    if (direction === "right") {
      await swipeRight(activeProfile._id);
    } else {
      await swipeLeft(activeProfile._id);
    }

    setDragX(0);
  };

  const handlePointerDown = (event) => {
    if (!activeProfile || swipingUserId || event.button !== 0) return;
    pointerStartX.current = event.clientX;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (pointerStartX.current === null) return;
    setDragX(event.clientX - pointerStartX.current);
  };

  const handlePointerUp = (event) => {
    if (pointerStartX.current === null) return;
    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    setIsDragging(false);

    if (Math.abs(distance) >= 100) {
      void swipe(distance > 0 ? "right" : "left");
    } else {
      setDragX(0);
    }
  };

  const handlePointerCancel = () => {
    pointerStartX.current = null;
    setIsDragging(false);
    setDragX(0);
  };

  return (
    <section aria-label="Discover profiles" className="min-w-0">
      {profilesLoading ? (
        <SwipeCardSkeleton />
      ) : profilesError ? (
        <div className="mx-auto flex min-h-[26rem] max-w-md flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <p className="font-semibold text-slate-800">{profilesError}</p>
          <button
            className="mt-4 rounded-lg bg-pink-600 px-4 py-2 font-semibold text-white hover:bg-pink-700"
            onClick={loadProfiles}
            type="button"
          >
            Try again
          </button>
        </div>
      ) : !activeProfile ? (
        <div className="mx-auto flex min-h-[26rem] max-w-md flex-col items-center justify-center rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-pink-50 text-pink-500">
            <Heart aria-hidden="true" size={30} />
          </span>
          <h2 className="mt-5 text-xl font-bold text-slate-900">
            You&apos;re all caught up
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            There are no more profiles to show right now. Check back later for
            new people.
          </p>
          <button
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
            onClick={loadProfiles}
            type="button"
          >
            <RotateCw aria-hidden="true" size={16} />
            Refresh profiles
          </button>
        </div>
      ) : (
        <>
          <div className="relative mx-auto h-[min(60vh,34rem)] min-h-[24rem] w-full max-w-md">
            {profiles.slice(1, 3).map((profile, index) => (
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl bg-white shadow-md ring-1 ring-slate-200"
                key={profile._id}
                style={{
                  transform: `scale(${0.96 - index * 0.035}) translateY(${(index + 1) * 12}px)`,
                }}
              />
            ))}

            <article
              className={`absolute inset-0 overflow-hidden rounded-3xl bg-slate-300 shadow-xl ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onPointerCancel={handlePointerCancel}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              style={{
                touchAction: "pan-y",
                transform: `translateX(${dragX}px) rotate(${dragX / 22}deg)`,
                transition: isDragging ? "none" : "transform 300ms ease",
              }}
            >
              {activeProfile.image ? (
                <img
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
                  draggable="false"
                  src={activeProfile.image}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-rose-300 via-pink-400 to-violet-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/10" />
              <SwipeFeedback
                direction={
                  dragX > 35 ? "right" : dragX < -35 ? "left" : undefined
                }
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <h2 className="text-3xl font-bold drop-shadow">
                  {activeProfile.name}
                  {activeProfile.age ? `, ${activeProfile.age}` : ""}
                </h2>
                <p className="mt-2 line-clamp-4 leading-relaxed text-white/90">
                  {activeProfile.bio || "No bio yet."}
                </p>
              </div>
            </article>
          </div>

          <div className="mt-6 flex items-center justify-center gap-5">
            <button
              aria-label="Pass on profile"
              className="grid h-14 w-14 place-items-center rounded-full bg-white text-rose-500 shadow-md ring-1 ring-slate-200 transition hover:scale-105 hover:bg-rose-50 disabled:opacity-50"
              disabled={Boolean(swipingUserId)}
              onClick={() => void swipe("left")}
              type="button"
            >
              <X aria-hidden="true" size={27} strokeWidth={2.5} />
            </button>
            <button
              aria-label="Like profile"
              className="grid h-16 w-16 place-items-center rounded-full bg-pink-600 text-white shadow-lg transition hover:scale-105 hover:bg-pink-700 disabled:opacity-50"
              disabled={Boolean(swipingUserId)}
              onClick={() => void swipe("right")}
              type="button"
            >
              <Heart aria-hidden="true" fill="currentColor" size={29} />
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-slate-500">
            Drag a card or use the buttons to pass or like.
          </p>
        </>
      )}
    </section>
  );
};

export default SwipeArea;
