import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/HomePage";
import {Header} from "./components/Header"
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";

const App = () => {
  const { authUser, checkAuth, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
      {checkingAuth ? (
        <div
          className="flex min-h-screen items-center justify-center"
          role="status"
        >
          Checking your session...
        </div>
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
