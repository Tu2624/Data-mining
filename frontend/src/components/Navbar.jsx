import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, User, LogOut, Bell, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useStore from "../store/useStore";
import client from "../api/client";

const Navbar = () => {
  const { user, logout, notifications, setNotifications, markAllRead } =
    useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const notifRef = useRef(null);

  // Fetch notifications khi user đăng nhập
  useEffect(() => {
    if (user) {
      client
        .get("/notifications?limit=10")
        .then((res) => {
          setNotifications(res.data);
        })
        .catch(() => {});
    }
  }, [user]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await client.patch("/notifications/read");
      markAllRead();
    } catch (e) {}
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-4 z-[60] mx-4 md:mx-10 rounded-[32px] glass-premium px-6 py-4 shadow-premium flex items-center justify-between"
    >
      {/* Brand */}
      <Link
        to="/"
        className="flex items-center gap-3 text-indigo-600 font-extrabold text-2xl tracking-tighter group transition-transform active:scale-95"
      >
        <motion.div
          whileHover={{ rotate: 10 }}
          className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200"
        >
          <Flame fill="currentColor" size={26} />
        </motion.div>
        <div className="flex flex-col leading-tight">
          <span className="text-slate-900 font-black tracking-tight">FOOD</span>
          <span className="text-indigo-500 text-[10px] font-black tracking-[0.4em] uppercase">
            REC-AI
          </span>
        </div>
      </Link>

      {/* Global Search */}
      <div className="hidden md:flex items-center bg-white/50 border border-indigo-100/50 rounded-2xl px-5 py-2.5 w-1/4 focus-within:w-1/3 focus-within:bg-white focus-within:ring-4 ring-indigo-50 transition-all duration-300">
        <Search size={18} className="text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm cảm hứng món ăn..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim()) {
              navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
            }
          }}
          className="bg-transparent border-none focus:ring-0 ml-3 w-full text-sm outline-none font-bold text-slate-900 placeholder:text-slate-400"
        />
      </div>

      {/* Links & Actions */}
      <div className="flex items-center gap-8">
        <div className="hidden lg:flex items-center gap-6">
          {[
            { name: "Khám phá", path: "/" },
            { name: "Thí nghiệm AI", path: "/ai-lab" },
            { name: "Hồ sơ", path: "/profile" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[12px] font-black uppercase tracking-[0.1em] transition-colors relative pb-1
                ${location.pathname === link.path ? "text-indigo-600" : "text-slate-400 hover:text-slate-900"}`}
            >
              {link.name}
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-5 border-l border-slate-100 pl-8">
          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <motion.button
              whileHover={{ rotate: 15 }}
              onClick={() => setShowNotifications((prev) => !prev)}
              className={`relative cursor-pointer transition p-2 rounded-xl
                ${showNotifications ? "bg-indigo-50 text-indigo-600" : "text-slate-400 hover:text-slate-900"}`}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 bg-rose-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </motion.button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-12 w-80 bg-white rounded-[28px] shadow-premium z-[70] overflow-hidden border border-slate-100 p-2"
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 rounded-[20px] mb-2">
                    <span className="font-black text-xs uppercase tracking-widest text-slate-900">
                      Thông báo
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[10px] text-indigo-600 font-black uppercase hover:underline"
                      >
                        Đọc tất cả
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto px-1 space-y-1">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-slate-400 text-sm font-medium italic">
                        Không có thông báo mới
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          className={`px-4 py-4 rounded-[18px] transition-colors border border-transparent ${!n.is_read ? "bg-indigo-50/70 border-indigo-100" : "hover:bg-slate-50"}`}
                        >
                          <p className="font-bold text-slate-800 text-[13px] leading-snug">
                            {n.content}
                          </p>
                          <p className="text-slate-400 text-[10px] font-medium mt-1.5 flex items-center gap-1.5 uppercase">
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            {new Date(n.created_at).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/profile"
                className="flex items-center gap-3 p-1.5 pr-4 rounded-2xl hover:bg-white hover:shadow-soft transition group"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden ring-2 ring-transparent group-hover:ring-indigo-100 transition shadow-inner">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.username}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <div className="flex flex-col hidden sm:flex">
                  <span className="font-black text-[13px] text-slate-900 leading-none">
                    {user.username}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Hội viên DeepMind
                  </span>
                </div>
              </Link>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-rose-500 transition p-2 hover:bg-rose-50 rounded-xl"
                title="Đăng xuất"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-lg hover:shadow-indigo-500/20 transition active:scale-95"
            >
              Kết nối thuật toán
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
