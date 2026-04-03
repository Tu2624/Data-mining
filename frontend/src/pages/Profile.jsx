import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, Heart, Settings, ShieldCheck, Grid, Users, Layout, MapPin, Calendar, Mail, Sparkles, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import useStore from '../store/useStore';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/Skeleton';

const Profile = () => {
    const { user, logout } = useStore();
    const [history, setHistory] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [stats, setStats] = useState({ followers: 0, following: 0, posts: 0 });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('favorites'); // 'favorites', 'history', 'followers', 'following'

    const fetchProfileData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [statsRes, historyRes, favoritesRes, followersRes, followingRes] = await Promise.all([
                client.get(`/social/stats`),
                client.get('/history'),
                client.get('/favorites'),
                client.get('/social/followers'),
                client.get('/social/following')
            ]);
            
            setStats(statsRes.data);
            setHistory(historyRes.data);
            setFavorites(favoritesRes.data);
            setFollowers(followersRes.data || []);
            setFollowing(followingRes.data || []);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [user]);

    if (!user) return (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
                <User size={48} />
            </div>
            <div className="text-center space-y-2">
                <p className="font-black text-slate-900 uppercase tracking-widest text-sm">Hồ sơ cá nhân chưa sẵn sàng</p>
                <p className="text-slate-400 font-medium italic text-xs">Vui lòng kết nối thuật toán để tiếp tục.</p>
            </div>
        </div>
    );

    const currentData = activeTab === 'history' ? history : favorites;

    return (
        <div className="max-w-6xl mx-auto pb-32 px-4 md:px-0">
            {/* Header / Hero Section - Premium Overhaul */}
            <div className="relative mb-36">
                {/* Cover Image - Cinematic Gradient */}
                <div className="h-64 md:h-80 w-full rounded-[48px] bg-slate-950 relative overflow-hidden shadow-premium border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-transparent to-rose-500/20 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.1),transparent_50%)]"></div>
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                </div>

                {/* Profile Info Overlay - Floating Glass */}
                <div className="absolute -bottom-24 left-8 right-8 flex flex-col md:flex-row items-end gap-8 md:gap-12">
                    {/* Avatar - High End Border */}
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="relative group shrink-0"
                    >
                        <div className="w-44 h-44 md:w-52 md:h-52 rounded-[44px] bg-white p-2 shadow-premium relative overflow-hidden ring-1 ring-slate-100">
                            <div className="w-full h-full rounded-[36px] bg-indigo-50 flex items-center justify-center text-indigo-500 overflow-hidden shadow-inner">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.username} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={90} strokeWidth={1} />
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-6 right-6 w-10 h-10 bg-emerald-500 border-4 border-white rounded-[18px] shadow-lg animate-pulse"></div>
                    </motion.div>

                    {/* Basic Info & Actions */}
                    <div className="flex-1 pb-6 flex flex-col md:flex-row items-center md:items-end justify-between gap-8 w-full">
                        <div className="text-center md:text-left space-y-3">
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                className="flex items-center gap-4 justify-center md:justify-start"
                            >
                                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">{user.username}</h1>
                                {user.role === 'admin' && (
                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl shadow-soft border border-indigo-100" title="Core Admin">
                                        <ShieldCheck size={20} fill="currentColor" fillOpacity={0.2} />
                                    </div>
                                )}
                            </motion.div>
                            
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                                className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-slate-400 font-bold text-xs uppercase tracking-widest"
                            >
                                <span className="flex items-center gap-2 hover:text-indigo-500 transition-colors"><Mail size={16} /> {user.email}</span>
                                <span className="flex items-center gap-2"><MapPin size={16} /> Việt Nam</span>
                                <span className="flex items-center gap-2 text-indigo-400 bg-indigo-50 px-3 py-1 rounded-lg">Cấp độ 4: Nhà ẩm thực AI</span>
                            </motion.div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="px-10 py-4 bg-indigo-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:scale-105 transition active:scale-95">
                                Cập nhật hồ sơ
                            </button>
                            <button className="p-4 bg-white border border-slate-100 text-slate-400 rounded-[22px] hover:text-indigo-600 transition shadow-soft hover:bg-indigo-50/30">
                                <Settings size={22} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Bar - Data Driven Aesthetic */}
            <div className="grid grid-cols-3 gap-6 md:gap-10 mb-16 sm:px-8">
                {[
                    { label: 'Bài đăng', value: stats.posts, icon: Layout, color: 'bg-indigo-50 text-indigo-600', hover: 'group-hover:border-indigo-200' },
                    { label: 'Followers', value: stats.followers, icon: Users, color: 'bg-rose-50 text-rose-500', hover: 'group-hover:border-rose-100' },
                    { label: 'Following', value: stats.following, icon: User, color: 'bg-emerald-50 text-emerald-500', hover: 'group-hover:border-emerald-100' }
                ].map((stat, i) => (
                    <motion.div 
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + (i * 0.1) }}
                        className={`bg-white p-8 rounded-[40px] shadow-soft border border-slate-100 flex flex-col items-center gap-3 group transition-all duration-300 ${stat.hover}`}
                    >
                        <div className={`p-4 rounded-[22px] ${stat.color} mb-2 group-hover:scale-110 transition-transform shadow-sm`}>
                            <stat.icon size={24} />
                        </div>
                        <span className="text-4xl font-black text-slate-900 leading-none tracking-tighter">{stat.value}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</span>
                    </motion.div>
                ))}
            </div>

            {/* Content Tabs - Modern Culinary Navigation */}
            <div className="space-y-12 sm:px-4">
                <div className="flex items-center justify-center md:justify-start gap-12 border-b-2 border-slate-100 overflow-x-auto no-scrollbar pt-2">
                    {[
                        { id: 'favorites', label: 'Cảm hứng đã thích', icon: Heart },
                        { id: 'history', label: 'Lịch sử AI', icon: Clock },
                        { id: 'followers', label: `Followers (${stats.followers})`, icon: Users },
                        { id: 'following', label: `Following (${stats.following})`, icon: User }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-8 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-3 px-2 whitespace-nowrap ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-900 group'}`}
                        >
                            <tab.icon size={20} className={activeTab === tab.id ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
                            <span>{tab.label}</span>
                            {activeTab === tab.id && (
                                <motion.div layoutId="profile-tab-underline" className="absolute bottom-[-2px] left-0 right-0 h-1 bg-indigo-600 rounded-full" />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.02, y: -10 }}
                        transition={{ duration: 0.4 }}
                    >
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {[1, 2, 3, 4].map(i => <PostCardSkeleton key={i} />) }
                            </div>
                        ) : ['favorites', 'history'].includes(activeTab) ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {currentData.length > 0 ? (
                                    currentData.map((post, idx) => (
                                        <motion.div 
                                            key={`${activeTab}-${post.id}`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                        >
                                            <PostCard 
                                                post={post} 
                                                onUpdate={fetchProfileData}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <EmptyState tab={activeTab} />
                                )}
                            </div>
                        ) : (
                            // Render Followers/Following List - High Profile Cards
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {(activeTab === 'followers' ? followers : following).length > 0 ? (
                                    (activeTab === 'followers' ? followers : following).map((u, idx) => (
                                        <motion.div
                                            key={`${activeTab}-${u.id}`}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="bg-white p-7 rounded-[40px] shadow-soft border border-slate-100 flex flex-col items-center gap-5 hover:shadow-premium transition-all group overflow-hidden relative"
                                        >
                                            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            <div className="w-20 h-20 rounded-[28px] bg-indigo-50 flex items-center justify-center text-indigo-600 overflow-hidden ring-4 ring-slate-50 group-hover:ring-indigo-100 transition-all shadow-inner">
                                                {u.avatar_url ? <img src={u.avatar_url} alt={u.username} referrerPolicy="no-referrer" className="w-full h-full object-cover" /> : <User size={32} />}
                                            </div>
                                            <div className="text-center space-y-1">
                                                <h4 className="font-black text-slate-900 text-lg tracking-tight uppercase truncate max-w-[120px]">{u.username}</h4>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Ẩm thực viên</p>
                                            </div>
                                            <Link to={`/profile/${u.id}`} className="mt-2 px-8 py-2.5 bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white rounded-[18px] font-black text-[10px] uppercase tracking-widest transition-all">
                                                Xem hồ sơ
                                            </Link>
                                        </motion.div>
                                    ))
                                ) : (
                                    <EmptyState tab={activeTab} />
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const EmptyState = ({ tab }) => (
    <div className="col-span-full py-32 bg-slate-50/50 border-4 border-dashed border-slate-100 rounded-[56px] flex flex-col items-center justify-center text-center space-y-8 w-full">
        <div className="p-10 bg-white rounded-full shadow-soft text-slate-200 border border-slate-100">
            {tab === 'favorites' ? <Heart size={64} strokeWidth={1} className="text-rose-200" /> : <Grid size={64} strokeWidth={1} className="text-indigo-200" />}
        </div>
        <div className="space-y-2">
            <p className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                {tab === 'followers' ? 'Chưa có kết nối' : tab === 'following' ? 'Khám phá cộng đồng' : 'Dữ liệu đang trống'}
            </p>
            <p className="text-slate-400 text-sm font-medium italic max-w-sm">
                {tab === 'followers' ? 'Hãy chia sẻ thêm trải nghiệm thú vị để thu hút những người cùng tần số nhé!' : 'Hãy tìm kiếm những người bạn mới để cùng thảo luận về ẩm thực AI!'}
            </p>
        </div>
        <Link to="/" className="px-12 py-4 bg-indigo-600 text-white rounded-[24px] font-black text-[11px] uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-600/20 transition-all active:scale-95">
            Khám phá Feed AI
        </Link>
    </div>
);

export default Profile;
