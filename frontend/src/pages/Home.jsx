import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, Users, Search as SearchIcon } from 'lucide-react';
import client from '../api/client';
import PostCard from '../components/PostCard';
import Skeleton from '../components/Skeleton';
import CreatePost from '../components/CreatePost';
import useStore from '../store/useStore';

const Home = () => {
    const { user } = useStore();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchFeed = async (reset = false) => {
        if (!user) {
            // Nếu chưa đăng nhập, lấy danh sách bài viết công khai bản cũ
            try {
                const res = await client.get('/posts');
                setPosts(res.data);
                setHasMore(false);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
            return;
        }

        try {
            const currentPage = reset ? 1 : page;
            const res = await client.get(`/posts/feed?page=${currentPage}`);
            if (reset) {
                setPosts(res.data);
            } else {
                setPosts(prev => [...prev, ...res.data]);
            }
            if (res.data.length < 10) setHasMore(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeed(true);
    }, [user]);

    const handleLoadMore = () => {
        setPage(prev => prev + 1);
    };

    useEffect(() => {
        if (page > 1) fetchFeed();
    }, [page]);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Horizontal Sticky Header: Profile & Navigation */}
            <div className="sticky top-[72px] z-40 bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-soft ring-1 ring-black/5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 font-black border-2 border-white shadow-sm overflow-hidden">
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            user?.username?.charAt(0).toUpperCase() || '?'
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="font-black text-gray-900 text-sm uppercase leading-tight">
                                {user ? user.username : 'Chào mừng bạn!'}
                            </h2>
                            {user && (
                                <span className="bg-primary-50 text-primary-600 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">User</span>
                            )}
                        </div>
                        {user && (
                            <div className="flex items-center gap-3 mt-1">
                                <div className="text-[10px] font-bold text-gray-400 capitalize">
                                    <span className="text-gray-900 mr-1">0</span> Followers
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 capitalize">
                                    <span className="text-gray-900 mr-1">0</span> Following
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <nav className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-primary-500 text-white rounded-2xl font-black shadow-lg shadow-primary-100 transition-all text-[10px] uppercase tracking-widest">
                        <TrendingUp size={16} />
                        <span>Bảng tin</span>
                    </button>
                    <Link to="/friends" className="flex items-center gap-2 px-6 py-2.5 text-gray-500 hover:bg-gray-50 rounded-2xl font-black transition-all text-[10px] uppercase tracking-widest no-underline">
                        <Users size={16} />
                        <span>Bạn bè</span>
                    </Link>
                    <button className="flex md:hidden items-center gap-2 px-4 py-2.5 text-gray-500 hover:bg-gray-50 rounded-2xl font-black transition-all text-[10px] uppercase tracking-widest">
                        <Sparkles size={16} />
                    </button>
                </nav>
            </div>

            {/* Main Content: Social Feed */}
            <div className="space-y-6">
                {/* Create Post Area */}
                {user && <CreatePost onPostCreated={() => fetchFeed(true)} />}

                {/* Feed Header */}
                <div className="flex items-center justify-between mb-4 px-2">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-black text-gray-900 leading-tight">
                            {user ? 'Dành cho bạn' : 'Món ngon nổi bật'}
                        </h2>
                        <div className="bg-gray-100 px-2 py-1 rounded-lg text-[9px] font-black uppercase text-gray-500 tracking-tighter">New Feed</div>
                    </div>
                    <div className="flex items-center gap-2 text-primary-500 bg-primary-50 px-3 py-1 rounded-full">
                        <Sparkles size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">AI Recs Active</span>
                    </div>
                </div>

                {loading && page === 1 ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map(n => <Skeleton key={n} height="500px" rounded="32px" />)}
                    </div>
                ) : (
                    <div className="space-y-6 mb-12">
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} onUpdate={() => fetchFeed(true)} />
                        ))}
                        
                        {hasMore && (
                            <button 
                                onClick={handleLoadMore}
                                className="w-full py-4 bg-white rounded-3xl font-black text-gray-400 border-2 border-dashed border-gray-100 hover:border-primary-200 hover:text-primary-500 transition-all text-sm uppercase tracking-widest shadow-sm"
                            >
                                Xem thêm bài viết...
                            </button>
                        )}
                        
                        {!hasMore && posts.length > 0 && (
                            <div className="text-center py-8 text-gray-400 font-bold italic">
                                Bạn đã xem hết tin hôm nay! 🙌
                            </div>
                        )}

                        {posts.length === 0 && !loading && (
                            <div className="text-center py-20 glass rounded-3xl space-y-4">
                                <SearchIcon size={48} className="mx-auto text-gray-300" />
                                <p className="text-gray-500 font-bold">Chưa có bài đăng nào mới. Hãy thử Follow thêm người khác nhé!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
