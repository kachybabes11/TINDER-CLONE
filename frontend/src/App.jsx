import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { AppLoadingSkeleton } from "./components/LoadingSkeletons";
import HomePage from "./pages/HomePage";
import {Header} from "./components/Header"
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import { connectSocket, disconnectSocket } from "./socket/socket.client";
import { useMatchStore } from "./store/useMatchStore";
import { useMessageStore } from "./store/useMessageStore";

const App = () => {
  const { authUser, checkAuth, checkingAuth } = useAuthStore();
  const authUserId = authUser?._id;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!authUserId) {
      disconnectSocket();
      useMessageStore.getState().reset();
      return undefined;
    }

    const socket = connectSocket();
    const handleConnect = () =>
      useMessageStore.getState().setSocketConnected(true);
    const handleDisconnect = () =>
      useMessageStore.getState().setSocketConnected(false);
    const handleMessage = (message) =>
      useMessageStore.getState().addMessage(message, authUserId);
    const handleMatch = (match) => useMatchStore.getState().addMatch(match);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleDisconnect);
    socket.on("newMessage", handleMessage);
    socket.on("newMatch", handleMatch);

    if (socket.connected) handleConnect();

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleDisconnect);
      socket.off("newMessage", handleMessage);
      socket.off("newMatch", handleMatch);
      disconnectSocket();
      handleDisconnect();
    };
  }, [authUserId]);

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      {checkingAuth ? (
        <AppLoadingSkeleton />
      ) : (
        <>
          {authUser && <Header />}
          <Routes>
            <Route
              path="/"
              element={authUser ? <HomePage /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/auth"
              element={!authUser ? <AuthPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/profile"
              element={
                authUser ? <ProfilePage /> : <Navigate to="/auth" replace />
              }
            />
            <Route
              path="/chat/:id"
              element={authUser ? <ChatPage /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="*"
              element={<Navigate to={authUser ? "/" : "/auth"} replace />}
            />
          </Routes>
        </>
      )}
      <Toaster />
    </div>
  );
};

export default App;
