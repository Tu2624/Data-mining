import React, { useState, useEffect } from 'react';
import { User, Clock, Heart, Settings, ShieldCheck } from 'lucide-react';
import client from '../api/client';
import useStore from '../store/useStore';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/Skeleton';

const Profile = () => {
    const { user } = useStore();
    const [history, setHistory] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('history');

    useEffect(() => {
        if (!user) return;
        if (activeTab === 'history') {
            fetchHistory();
        } else if (activeTab === 'favorites') {
            fetchFavorites();
        }
    }, [activeTab, user]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await client.get('/history');
            setHistory(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const res = await client.get('/favorites');
            setFavorites(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <div className="p-20 text-center font-bold">Vui lòng đăng nhập để xem hồ sơ!</div>;

    const currentData = activeTab === 'history' ? history : favorites;

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            {/* Profile Header */}
            <header className="bg-white rounded-3xl p-8 shadow-soft flex flex-col md:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-3xl bg-primary-100 flex items-center justify-center text-primary-500 shadow-premium">
                    <User size={64} strokeWidth={1} />
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <h1 className="text-4xl font-black text-gray-900">{user.username}</h1>
                        {user.role === 'admin' && <ShieldCheck className="text-blue-500" size={24} />}
                    </div>
                    <p className="text-gray-400 font-bold">{user.email}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                        <div className="bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold text-gray-500 ring-1 ring-black/5">
                            ID: #{user.id}
                        </div>
                        <div className="bg-primary-50 px-4 py-2 rounded-xl text-sm font-bold text-primary-500 ring-1 ring-primary-100">
                            Role: {user.role}
                        </div>
                    </div>
                </div>
                <button className="bg-gray-100 p-4 rounded-2xl text-gray-500 hover:bg-gray-200 transition">
                    <Settings />
                </button>
            </header>

            {/* Tabs & Content */}
            <div className="space-y-8">
                <div className="flex items-center gap-8 border-b border-gray-100 pb-2 overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-4 text-sm font-black uppercase tracking-widest transition relative ${activeTab === 'history' ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Clock className="inline mr-2" size={18} /> Lịch sử xem (AI)
                        {activeTab === 'history' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 rounded-full"></div>}
                    </button>
                    <button
                        onClick={() => setActiveTab('favorites')}
                        className={`pb-4 text-sm font-black uppercase tracking-widest transition relative ${activeTab === 'favorites' ? 'text-primary-500' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <Heart className="inline mr-2" size={18} /> Đã thích
                        {activeTab === 'favorites' && <div className="absolute bottom-0 left-0 w-full h-1 bg-primary-500 rounded-full"></div>}
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {loading ? (
                        [1, 2, 3, 4].map(i => <PostCardSkeleton key={i} />)
                    ) : currentData.length > 0 ? (
                        currentData.map(item => <PostCard key={item.id} post={item} />)
                    ) : (
                        <div className="col-span-full h-40 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl">
                            {activeTab === 'history' ? (
                                <>
                                    <Clock size={40} className="mb-2 opacity-20" />
                                    <p className="font-bold">Chưa có lịch sử hoạt động</p>
                                </>
                            ) : (
                                <>
                                    <Heart size={40} className="mb-2 opacity-20" />
                                    <p className="font-bold">Chưa có món ăn yêu thích</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
