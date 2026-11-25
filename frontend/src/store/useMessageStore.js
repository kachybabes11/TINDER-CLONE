import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const getId = (value) =>
  typeof value === "object" && value !== null ? value._id : value;

const sortMessages = (messages) =>
  [...messages].sort(
    (first, second) =>
      new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime(),
  );

const mergeMessages = (...messageLists) => {
  const uniqueMessages = new Map();
  for (const message of messageLists.flat()) {
    if (message?._id) uniqueMessages.set(message._id, message);
  }
  return sortMessages([...uniqueMessages.values()]);
};

export const useMessageStore = create((set, get) => ({
  messagesByUserId: {},
  lastMessagesByUserId: {},
  unreadCountsByUserId: {},
  activeChatId: null,
  loadingChatId: null,
  errorChatId: null,
  messagesError: "",
  sending: false,
  socketConnected: false,

  setActiveChat: (userId) =>
    set((state) => ({
      activeChatId: userId,
      unreadCountsByUserId: { ...state.unreadCountsByUserId, [userId]: 0 },
    })),

  clearActiveChat: (userId) =>
    set((state) => ({
      activeChatId: state.activeChatId === userId ? null : state.activeChatId,
    })),

  setSocketConnected: (socketConnected) => set({ socketConnected }),

  loadMessages: async (userId, currentUserId) => {
    set((state) => ({
      activeChatId: userId,
      loadingChatId: userId,
      errorChatId: null,
      messagesError: "",
      unreadCountsByUserId: { ...state.unreadCountsByUserId, [userId]: 0 },
    }));

    try {
      const { data } = await axiosInstance.get(`/api/messages/${userId}`);
      set((state) => {
        const messages = mergeMessages(
          data.messages,
          state.messagesByUserId[userId] || [],
        );
        return {
          messagesByUserId: {
            ...state.messagesByUserId,
            [userId]: messages,
          },
          lastMessagesByUserId: {
            ...state.lastMessagesByUserId,
            ...(messages.length ? { [userId]: messages[messages.length - 1] } : {}),
          },
          loadingChatId:
            state.loadingChatId === userId ? null : state.loadingChatId,
        };
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to load this conversation.";
      set({ errorChatId: userId, messagesError: message });
    } finally {
      set((state) => ({
        loadingChatId:
          state.loadingChatId === userId ? null : state.loadingChatId,
      }));
    }
  },

  addMessage: (message, currentUserId) => {
    const senderId = getId(message?.sender);
    const receiverId = getId(message?.receiver);
    if (!message?._id || !senderId || !receiverId || !currentUserId) return;

    const partnerId =
      senderId === currentUserId ? receiverId : senderId;
    if (receiverId !== currentUserId && senderId !== currentUserId) return;

    set((state) => {
      const messages = mergeMessages(
        state.messagesByUserId[partnerId] || [],
        [message],
      );
      const unreadCount =
        senderId !== currentUserId && state.activeChatId !== partnerId
          ? (state.unreadCountsByUserId[partnerId] || 0) + 1
          : 0;

      return {
        messagesByUserId: {
          ...state.messagesByUserId,
          [partnerId]: messages,
        },
        lastMessagesByUserId: {
          ...state.lastMessagesByUserId,
          [partnerId]: messages[messages.length - 1],
        },
        unreadCountsByUserId:
          senderId !== currentUserId && state.activeChatId !== partnerId
            ? {
                ...state.unreadCountsByUserId,
                [partnerId]: unreadCount,
              }
            : state.unreadCountsByUserId,
      };
    });
  },

  sendMessage: async (userId, text, currentUserId) => {
    if (get().sending) return false;
    set({ sending: true });

    try {
      const { data } = await axiosInstance.post(`/api/messages/${userId}`, {
        text,
      });
      get().addMessage(data.message, currentUserId);
      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to send your message.",
      );
      return false;
    } finally {
      set({ sending: false });
    }
  },

  reset: () =>
    set({
      messagesByUserId: {},
      lastMessagesByUserId: {},
      unreadCountsByUserId: {},
      activeChatId: null,
      loadingChatId: null,
      errorChatId: null,
      messagesError: "",
      sending: false,
      socketConnected: false,
    }),
}));
