import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, User, LogOut, Bell, Flame } from 'lucide-react';
import useStore from '../store/useStore';

const Navbar = () => {
  const { user, logout, notifications } = useStore();
  const navigate = useNavigate();

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
        <div className="relative cursor-pointer hover:text-primary-500 transition">
          <Bell size={22} />
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.length}
            </span>
          )}
        </div>

        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 overflow-hidden group-hover:ring-2 ring-primary-500 transition">
                {user.avatar_url ? <img src={user.avatar_url} /> : <User size={18} />}
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
