import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import client from "../api/client";
import useStore from "../store/useStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await client.post("/auth/login", { email, password });
      setUser(res.data.user, res.data.token);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto pt-24 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[40px] p-10 shadow-premium space-y-10 border border-slate-100"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[28px] mb-2 shadow-inner border border-indigo-100">
            <Sparkles size={36} fill="currentColor" fillOpacity={0.2} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Chào mừng bạn
          </h1>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest leading-relaxed">
            Kết nối với thuật toán DeepMind <br />
            để cá nhân hóa hành trình ẩm thực.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
              Cổng kết nối (Email)
            </label>
            <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 border-2 border-transparent focus-within:border-indigo-600 focus-within:bg-white transition-all shadow-inner">
              <Mail size={18} className="text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="bg-transparent border-none focus:ring-0 ml-4 w-full text-sm font-bold text-slate-900 outline-none"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
              Mã bảo mật (Password)
            </label>
            <div className="flex items-center bg-slate-50 rounded-2xl px-6 py-4 border-2 border-transparent focus-within:border-indigo-600 focus-within:bg-white transition-all shadow-inner">
              <Lock size={18} className="text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="bg-transparent border-none focus:ring-0 ml-4 w-full text-sm font-bold text-slate-900 outline-none"
                required
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
          >
            {loading ? "Đang giải mã..." : "Xác thực ngay"}
            {!loading && <ArrowRight size={18} />}
          </motion.button>
        </form>

        <div className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Chưa có dữ liệu hội viên?{" "}
          <Link to="/register" className="text-indigo-600 hover:underline">
            Khởi tạo tại đây
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
