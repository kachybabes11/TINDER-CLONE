import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  UserRound,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useMatchStore } from "../store/useMatchStore";
import { useMessageStore } from "../store/useMessageStore";

const emptyMessages = [];
const getId = (value) =>
  typeof value === "object" && value !== null ? value._id : value;

const formatMessageTime = (date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));

const ChatPage = () => {
  const { id } = useParams();
  const { authUser } = useAuthStore();
  const matches = useMatchStore((state) => state.matches);
  const matchesLoading = useMatchStore((state) => state.matchesLoading);
  const matchesError = useMatchStore((state) => state.matchesError);
  const loadMatches = useMatchStore((state) => state.loadMatches);
  const match = matches.find((person) => person._id === id);

  const messages = useMessageStore(
    (state) => state.messagesByUserId[id] || emptyMessages,
  );
  const loadingChatId = useMessageStore((state) => state.loadingChatId);
  const errorChatId = useMessageStore((state) => state.errorChatId);
  const messagesError = useMessageStore((state) => state.messagesError);
  const sending = useMessageStore((state) => state.sending);
  const socketConnected = useMessageStore((state) => state.socketConnected);
  const loadMessages = useMessageStore((state) => state.loadMessages);
  const clearActiveChat = useMessageStore((state) => state.clearActiveChat);
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const [draft, setDraft] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!match && !matchesLoading && !matchesError) void loadMatches();
  }, [loadMatches, match, matchesError, matchesLoading]);

  useEffect(() => {
    if (!id || !authUser?._id) return undefined;
    void loadMessages(id, authUser._id);
    return () => clearActiveChat(id);
  }, [authUser?._id, clearActiveChat, id, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!profileOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setProfileOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [profileOpen]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !id || !authUser?._id || sending) return;

    if (await sendMessage(id, text, authUser._id)) setDraft("");
  };

  if (!match && matchesLoading) {
    return (
      <main className="grid min-h-[calc(100vh-4.5rem)] place-items-center bg-slate-50 p-4">
        <div className="w-full max-w-3xl animate-pulse overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="h-20 border-b border-slate-100 bg-slate-100" />
          <div className="h-[55vh] min-h-80" />
          <div className="h-20 border-t border-slate-100 bg-slate-50" />
        </div>
      </main>
    );
  }

  if (!match) {
    return (
      <main className="grid min-h-[calc(100vh-4.5rem)] place-items-center bg-slate-50 p-4">
        <section className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pink-50 text-pink-600">
            <MessageCircle aria-hidden="true" size={25} />
          </span>
          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Conversation unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {matchesError ||
              "This chat is only available while you are matched."}
          </p>
          {matchesError && (
            <button
              className="mt-4 font-semibold text-pink-600 hover:text-pink-700"
              onClick={() => void loadMatches()}
              type="button"
            >
              Try again
            </button>
          )}
          <Link
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-pink-600 px-5 py-2.5 font-semibold text-white transition hover:bg-pink-700"
            state={{ openMatches: true }}
            to="/"
          >
            <ArrowLeft aria-hidden="true" size={17} />
            Back to matches
          </Link>
        </section>
      </main>
    );
  }

  const currentMessages = messages;

  return (
    <main className="min-h-[calc(100vh-4.5rem)] bg-slate-100 px-3 py-4 sm:px-6 sm:py-7">
      <section className="mx-auto flex h-[calc(100vh-7.5rem)] min-h-[34rem] max-h-[58rem] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-900/5 ring-1 ring-slate-200">
        <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 sm:gap-4 sm:px-6">
          <Link
            aria-label="Back to matches"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            state={{ openMatches: true }}
            to="/"
          >
            <ArrowLeft aria-hidden="true" size={20} />
          </Link>

          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-pink-50">
            {match.image ? (
              <img
                alt=""
                className="h-full w-full object-cover"
                src={match.image}
              />
            ) : (
              <span className="grid h-full w-full place-items-center text-pink-500">
                <UserRound aria-hidden="true" size={22} />
              </span>
            )}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
          </div>

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-bold text-slate-900">
              {match.name}
              {match.age ? `, ${match.age}` : ""}
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-slate-500">
              {socketConnected ? (
                <>
                  <Wifi
                    aria-hidden="true"
                    className="text-emerald-500"
                    size={13}
                  />
                  Live connection
                </>
              ) : (
                <>
                  <WifiOff
                    aria-hidden="true"
                    className="text-amber-500"
                    size={13}
                  />
                  Reconnecting…
                </>
              )}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-pink-200 hover:bg-pink-50 hover:text-pink-700 sm:px-4 sm:text-sm"
              onClick={() => setProfileOpen(true)}
              type="button"
            >
              View profile
            </button>
            <Link
              className="hidden rounded-full bg-pink-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-pink-700 sm:inline-flex"
              state={{ openMatches: true }}
              to="/"
            >
              Matches
            </Link>
          </div>
        </header>

        <div
          aria-live="polite"
          className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50/80 to-white px-4 py-5 sm:px-8 sm:py-7"
        >
          <div className="mx-auto mb-7 max-w-sm text-center">
            <div className="mx-auto h-20 w-20 overflow-hidden rounded-full bg-pink-50 ring-4 ring-white shadow-md">
              {match.image ? (
                <img
                  alt=""
                  className="h-full w-full object-cover"
                  src={match.image}
                />
              ) : (
                <span className="grid h-full w-full place-items-center text-pink-500">
                  <UserRound aria-hidden="true" size={34} />
                </span>
              )}
            </div>
            <h2 className="mt-3 text-lg font-bold text-slate-900">
              You matched with {match.name}
              {match.age ? `, ${match.age}` : ""}
            </h2>
            <p className="mx-auto mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
              {match.bio || "A new connection starts with a hello."}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-700">
              <Heart aria-hidden="true" fill="currentColor" size={12} />
              Matched and ready to chat
            </div>
          </div>

          {loadingChatId === id && currentMessages.length === 0 ? (
            <div
              aria-label="Loading conversation"
              aria-busy="true"
              className="space-y-3"
              role="status"
            >
              <div className="ml-auto h-10 w-2/3 animate-pulse rounded-2xl bg-pink-100" />
              <div className="h-12 w-1/2 animate-pulse rounded-2xl bg-slate-200" />
              <span className="sr-only">Loading messages</span>
            </div>
          ) : errorChatId === id ? (
            <div className="mx-auto max-w-md rounded-2xl bg-rose-50 p-4 text-center text-sm text-rose-700">
              {messagesError}
              <button
                className="ml-2 font-semibold underline underline-offset-2"
                onClick={() => void loadMessages(id, authUser._id)}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : currentMessages.map((message) => {
              const isOwnMessage = getId(message.sender) === authUser?._id;
              return (
                <div
                  className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                  key={message._id}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm sm:max-w-[70%] ${
                      isOwnMessage
                        ? "rounded-br-md bg-pink-600 text-white"
                        : "rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words text-sm leading-6">
                      {message.text}
                    </p>
                    <time
                      className={`mt-1 block text-right text-[10px] ${
                        isOwnMessage ? "text-pink-100" : "text-slate-400"
                      }`}
                      dateTime={message.createdAt}
                    >
                      {formatMessageTime(message.createdAt)}
                    </time>
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>

        <form
          aria-busy={sending}
          className="flex items-center gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:px-6"
          onSubmit={handleSubmit}
        >
          <input
            aria-label={`Message ${match.name}`}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-pink-300 focus:bg-white focus:ring-4 focus:ring-pink-100"
            maxLength={2000}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={`Message ${match.name}…`}
            value={draft}
          />
          <button
            aria-label="Send message"
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-pink-600 text-white shadow-md transition hover:scale-105 hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!draft.trim() || sending}
            type="submit"
          >
            <Send aria-hidden="true" size={18} />
          </button>
        </form>
      </section>

      {profileOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <button
            aria-label="Close profile"
            className="absolute inset-0 cursor-default"
            onClick={() => setProfileOpen(false)}
            type="button"
          />
          <section
            aria-labelledby="matched-profile-title"
            aria-modal="true"
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
            role="dialog"
          >
            <div className="relative h-64 bg-gradient-to-br from-pink-300 to-violet-400">
              {match.image && (
                <img
                  alt={`${match.name}'s profile`}
                  className="h-full w-full object-cover"
                  src={match.image}
                />
              )}
              <button
                aria-label="Close profile"
                className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/35 text-white transition hover:bg-black/50"
                onClick={() => setProfileOpen(false)}
                type="button"
              >
                <X aria-hidden="true" size={19} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-pink-600">
                Your match
              </p>
              <h2
                className="mt-1 text-2xl font-bold text-slate-900"
                id="matched-profile-title"
              >
                {match.name}
                {match.age ? `, ${match.age}` : ""}
              </h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                {match.bio || "No bio yet."}
              </p>
              <button
                className="mt-6 w-full rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white transition hover:bg-pink-700"
                onClick={() => setProfileOpen(false)}
                type="button"
              >
                Back to chat
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default ChatPage;
