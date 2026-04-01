import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import client from '../api/client';
import useStore from '../store/useStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await client.post('/auth/login', { email, password });
      setUser(res.data.user, res.data.token);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-20">
      <div className="bg-white rounded-3xl p-8 shadow-premium space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-500 rounded-2xl mb-4">
             <Sparkles size={32} />
          </div>
          <h1 className="text-3xl font-black">Chào mừng trở lại</h1>
          <p className="text-gray-400 font-medium text-sm">Đăng nhập để nhận gợi ý món ăn chuẩn gu AI.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Email</label>
            <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-primary-500 transition">
              <Mail size={18} className="text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="bg-transparent border-none focus:ring-0 ml-3 w-full text-sm font-medium outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Mật khẩu</label>
            <div className="flex items-center bg-gray-50 rounded-2xl px-4 py-3 border-2 border-transparent focus-within:border-primary-500 transition">
              <Lock size={18} className="text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="bg-transparent border-none focus:ring-0 ml-3 w-full text-sm font-medium outline-none"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary-500 text-white py-4 rounded-2xl font-black text-lg shadow-premium hover:scale-[1.02] transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
          </button>
        </form>

        <div className="text-center text-sm font-bold text-gray-400">
           Chưa có tài khoản? <Link to="/register" className="text-primary-500 hover:underline">Đăng ký tại đây</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
