import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, LogOut, Bell, Flame } from 'lucide-react';
import useStore from '../store/useStore';
import client from '../api/client';

const Navbar = () => {
  const { user, logout, notifications, setNotifications, markAllRead } = useStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef(null);

  // Fetch notifications khi user đăng nhập
  useEffect(() => {
    if (user) {
      client.get('/notifications?limit=10').then(res => {
        setNotifications(res.data);
      }).catch(() => {});
    }
  }, [user]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await client.patch('/notifications/read');
      markAllRead();
    } catch (e) {}
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <nav className="sticky top-0 z-50 glass px-6 py-3 shadow-soft flex items-center justify-between">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 text-primary-500 font-black text-2xl tracking-tighter">
        <Flame fill="currentColor" />
        <span>FOODREC</span>
      </Link>

      {/* Global Search */}
      <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 w-1/3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Tìm món ăn, địa điểm..."
          className="bg-transparent border-none focus:ring-0 ml-2 w-full text-sm outline-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6">
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="relative cursor-pointer hover:text-primary-500 transition"
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-9 w-80 bg-white rounded-2xl shadow-premium z-50 overflow-hidden border border-gray-100">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="font-black text-sm text-gray-900">Thông báo</span>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-primary-500 font-bold hover:underline"
                  >
                    Đánh dấu tất cả đã đọc
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-gray-400 text-sm font-medium">
                    Không có thông báo nào
                  </div>
                ) : (
                  notifications.slice(0, 10).map(n => (
                    <div
                      key={n.id}
                      className={`px-4 py-3 border-b border-gray-50 text-sm ${!n.is_read ? 'bg-primary-50' : ''}`}
                    >
                      <p className="font-medium text-gray-800 leading-snug">{n.content}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(n.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            {user.role === 'admin' && (
              <Link to="/admin" className="text-primary-500 bg-primary-50 px-3 py-1 rounded-lg flex items-center gap-1 font-bold text-xs hover:bg-primary-100 transition mr-2">
                Quản trị
              </Link>
            )}
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 overflow-hidden group-hover:ring-2 ring-primary-500 transition">
                {user.avatar_url ? <img src={user.avatar_url} alt={user.username} /> : <User size={18} />}
              </div>
              <span className="font-semibold text-sm hidden sm:block">{user.username}</span>
            </Link>
            <button onClick={logout} className="text-gray-500 hover:text-red-500 transition">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <Link to="/login" className="bg-primary-500 text-white px-5 py-2 rounded-full font-bold text-sm hover:shadow-premium transition active:scale-95">
            Đăng nhập
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
