import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageCircle, UserRound, X } from "lucide-react";
import { MatchListSkeleton } from "./LoadingSkeletons";
import { useMatchStore } from "../store/useMatchStore";
import { useAuthStore } from "../store/useAuthStore";
import { useMessageStore } from "../store/useMessageStore";

const Sidebar = ({ isOpen, onClose }) => {
  const matches = useMatchStore((state) => state.matches);
  const matchesLoading = useMatchStore((state) => state.matchesLoading);
  const matchesError = useMatchStore((state) => state.matchesError);
  const likesYou = useMatchStore((state) => state.likesYou);
  const likesYouLoading = useMatchStore((state) => state.likesYouLoading);
  const likesYouError = useMatchStore((state) => state.likesYouError);
  const swipingUserId = useMatchStore((state) => state.swipingUserId);
  const loadMatches = useMatchStore((state) => state.loadMatches);
  const loadLikesYou = useMatchStore((state) => state.loadLikesYou);
  const swipeLeft = useMatchStore((state) => state.swipeLeft);
  const swipeRight = useMatchStore((state) => state.swipeRight);
  const authUserId = useAuthStore((state) => state.authUser?._id);
  const lastMessages = useMessageStore((state) => state.lastMessagesByUserId);
  const unreadCounts = useMessageStore((state) => state.unreadCountsByUserId);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <button
        aria-label="Close matches drawer"
        className="fixed inset-0 z-40 cursor-default bg-slate-950/35"
        onClick={onClose}
        type="button"
      />
      <aside
        aria-labelledby="matches-drawer-title"
        aria-modal="true"
        className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto rounded-r-3xl bg-slate-50 shadow-2xl sm:max-w-sm"
        role="dialog"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-600">
              Your people
            </p>
            <h2
              className="mt-1 text-xl font-bold text-slate-900"
              id="matches-drawer-title"
            >
              Likes & matches
            </h2>
          </div>
          <button
            aria-label="Close matches"
            className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" size={21} />
          </button>
        </div>

        <div className="space-y-5 p-4">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Liked you</h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  {likesYou.length} waiting to hear from you
                </p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-pink-50 text-pink-600">
                <Heart aria-hidden="true" fill="currentColor" size={17} />
              </span>
            </div>

            {likesYouLoading ? (
              <MatchListSkeleton />
            ) : likesYouError ? (
              <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
                <p>{likesYouError}</p>
                <button
                  className="mt-3 font-semibold underline underline-offset-2"
                  onClick={loadLikesYou}
                  type="button"
                >
                  Try again
                </button>
              </div>
            ) : likesYou.length === 0 ? (
              <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
                <p className="font-medium text-slate-800">No new likes yet</p>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  People who like you will show up here.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {likesYou.map((profile) => (
                  <li
                    className="rounded-xl bg-slate-50 p-3"
                    key={profile._id}
                  >
                    <div className="flex items-center gap-3">
                      {profile.image ? (
                        <img
                          alt=""
                          className="h-12 w-12 shrink-0 rounded-full object-cover"
                          src={profile.image}
                        />
                      ) : (
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-pink-100 text-pink-600">
                          <UserRound aria-hidden="true" size={21} />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-slate-900">
                          {profile.name}
                          {profile.age ? `, ${profile.age}` : ""}
                        </span>
                        <span className="block truncate text-sm text-slate-500">
                          {profile.bio || "Liked your profile"}
                        </span>
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <button
                        aria-label={`Like ${profile.name} back`}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-pink-600 px-2 py-2 text-sm font-semibold text-white transition hover:bg-pink-700 disabled:opacity-50"
                        disabled={Boolean(swipingUserId)}
                        onClick={() => void swipeRight(profile._id)}
                        type="button"
                      >
                        <Heart
                          aria-hidden="true"
                          fill="currentColor"
                          size={15}
                        />
                        Like back
                      </button>
                      <button
                        aria-label={`Pass on ${profile.name}`}
                        className="grid h-9 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 disabled:opacity-50"
                        disabled={Boolean(swipingUserId)}
                        onClick={() => void swipeLeft(profile._id)}
                        type="button"
                      >
                        <X aria-hidden="true" size={18} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Your matches</h3>
                <p className="mt-0.5 text-sm text-slate-500">
                  {matches.length}{" "}
                  {matches.length === 1 ? "connection" : "connections"}
                </p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-violet-50 text-violet-600">
                <MessageCircle aria-hidden="true" size={18} />
              </span>
            </div>

            {matchesLoading ? (
              <MatchListSkeleton />
            ) : matchesError ? (
              <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
                <p>{matchesError}</p>
                <button
                  className="mt-3 font-semibold underline underline-offset-2"
                  onClick={loadMatches}
                  type="button"
                >
                  Try again
                </button>
              </div>
            ) : matches.length === 0 ? (
              <div className="rounded-xl bg-slate-50 px-4 py-6 text-center">
                <p className="font-medium text-slate-800">No matches yet</p>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Keep swiping to find someone you connect with.
                </p>
              </div>
            ) : (
              <ul className="space-y-1">
                {matches.map((match) => (
                  <li key={match._id}>
                    <Link
                      aria-label={`Open chat with ${match.name}`}
                      className="flex items-center gap-3 rounded-xl p-2 transition hover:bg-violet-50 focus-visible:outline-2 focus-visible:outline-pink-500"
                      onClick={onClose}
                      to={`/chat/${match._id}`}
                    >
                      {match.image ? (
                        <img
                          alt=""
                          className="h-11 w-11 shrink-0 rounded-full object-cover"
                          src={match.image}
                        />
                      ) : (
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-100 text-violet-600">
                          <UserRound aria-hidden="true" size={20} />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-slate-900">
                          {match.name}
                          {match.age ? `, ${match.age}` : ""}
                        </span>
                        <span className="block truncate text-sm text-slate-500">
                          {lastMessages[match._id]
                            ? `${lastMessages[match._id].sender === authUserId ? "You: " : ""}${lastMessages[match._id].text}`
                            : match.bio || "Say hello and start a conversation"}
                        </span>
                      </span>
                      {unreadCounts[match._id] ? (
                        <span className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-pink-600 px-1.5 text-xs font-bold text-white">
                          {unreadCounts[match._id] > 9
                            ? "9+"
                            : unreadCounts[match._id]}
                        </span>
                      ) : (
                        <MessageCircle
                          aria-hidden="true"
                          className="shrink-0 text-violet-500"
                          size={17}
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
