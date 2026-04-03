import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Friends from "./pages/Friends";
import AILab from "./pages/AILab";
import useStore from "./store/useStore";
import { io } from "socket.io-client";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/post/:id"
          element={
            <PageWrapper>
              <PostDetail />
            </PageWrapper>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWrapper>
              <Profile />
            </PageWrapper>
          }
        />
        <Route
          path="/admin"
          element={
            <PageWrapper>
              <Admin />
            </PageWrapper>
          }
        />
        <Route
          path="/friends"
          element={
            <PageWrapper>
              <Friends />
            </PageWrapper>
          }
        />
        <Route
          path="/ai-lab"
          element={
            <PageWrapper>
              <AILab />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// Component bọc trang để tạo hiệu ứng chuyển động đồng bộ điện ảnh
const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15, scale: 0.98 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: -10, scale: 0.99 }}
    transition={{
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1], // Custom ease-out expo cho cảm giác cao cấp
    }}
  >
    {children}
  </motion.div>
);

const App = () => {
  const { user, addNotification } = useStore();

  useEffect(() => {
    if (user) {
      const socket = io("http://localhost:5000");
      socket.emit("join_room", user.id);

      socket.on("new_notification", (notification) => {
        addNotification(notification);
        console.log("Thông báo mới:", notification);
      });

      return () => socket.disconnect();
    }
  }, [user]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface">
        <Navbar />
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
