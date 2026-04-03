import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Utensils, User, Mail, Lock, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import client from '../api/client';
import useStore from '../store/useStore';

const Register = () => {
    const navigate = useNavigate();
    const { setUser } = useStore();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            return alert('Mật khẩu xác nhận không khớp!');
        }

        setLoading(true);
        try {
            const res = await client.post('/auth/register', {
                username: form.username,
                email: form.email,
                password: form.password
            });
            // Tự động đăng nhập sau khi đăng ký
            const loginRes = await client.post('/auth/login', {
                email: form.email,
                password: form.password
            });
            setUser(loginRes.data.user, loginRes.data.token);
            
            alert('Chào mừng bạn đến với FoodRec AI!');
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.error || 'Lỗi khi đăng ký');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[85vh] items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-xl bg-white rounded-[48px] p-12 shadow-premium border border-slate-100"
            >
                <div className="text-center mb-12 space-y-4">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-50 rounded-[32px] text-indigo-600 mb-4 shadow-inner border border-indigo-100">
                        <Utensils size={48} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 leading-tight tracking-tighter">Gia nhập Lab AI</h1>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">Khởi tạo thực thể mới trên hệ sinh thái FoodRec</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Định danh (Username)</label>
                        <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input 
                                type="text" 
                                value={form.username}
                                onChange={(e) => setForm({...form, username: e.target.value})}
                                placeholder="Nhập tên của bạn..." 
                                className="w-full bg-slate-50 rounded-[24px] pl-16 pr-8 py-5 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold text-slate-900 transition-all shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Địa chỉ kết nối (Email)</label>
                        <div className="relative group">
                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input 
                                type="email" 
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                placeholder="example@gmail.com" 
                                className="w-full bg-slate-50 rounded-[24px] pl-16 pr-8 py-5 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold text-slate-900 transition-all shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Mã bảo mật</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    value={form.password}
                                    onChange={(e) => setForm({...form, password: e.target.value})}
                                    placeholder="••••••••" 
                                    className="w-full bg-slate-50 rounded-[24px] pl-16 pr-8 py-5 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold text-slate-900 transition-all shadow-inner"
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Xác nhận mã</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input 
                                    type="password" 
                                    value={form.confirmPassword}
                                    onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                                    placeholder="••••••••" 
                                    className="w-full bg-slate-50 rounded-[24px] pl-16 pr-8 py-5 border-2 border-transparent focus:border-indigo-600 focus:bg-white outline-none font-bold text-slate-900 transition-all shadow-inner"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-6 rounded-[28px] font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {loading ? 'Đang khởi tạo thực thể...' : (
                            <>
                                Đăng ký ngay <ArrowRight size={20} />
                            </>
                        )}
                    </motion.button>
                </form>

                <div className="mt-12 pt-10 border-t border-slate-50 text-center">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Đã có thẻ hội viên?{' '}
                        <Link to="/login" className="text-indigo-600 hover:underline">Vào sảnh đăng nhập</Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
