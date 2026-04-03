import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, MapPin, BookmarkPlus, ChevronLeft, Send, Sparkles, User, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import useStore from '../store/useStore';
import PostCard from '../components/PostCard';

const PostDetail = () => {
    const { id } = useParams();
    const { user } = useStore();
    const [post, setPost] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [liked, setLiked] = useState(false);
    const [favorited, setFavorited] = useState(false);

    // Comment state
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    useEffect(() => {
        fetchPost();
        fetchComments();
        
        // Ghi nhận lịch sử xem món ăn
        if (user) {
            client.post('/interact', { postId: id, action: 'view' }).catch(console.error);
        }

        window.scrollTo(0, 0);
    }, [id, user]);

    const fetchPost = async () => {
        setLoading(true);
        try {
            const res = await client.get(`/posts/${id}`);
            setPost(res.data.post);
            setSimilar(res.data.similar);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        setCommentsLoading(true);
        try {
            const res = await client.get(`/posts/${id}/comments`);
            setComments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setCommentsLoading(false);
        }
    };

    const handleInteract = async (action, score = null) => {
        if (!user) return alert('Vui lòng kết nối thuật toán (Đăng nhập)!');
        try {
            await client.post('/interact', { postId: id, action, score });
            if (action === 'like') {
                setLiked(!liked);
            } else if (action === 'favorite') {
                setFavorited(!favorited);
            } else if (action === 'rate') {
                setRating(score);
                await fetchPost();
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Lỗi hệ thống');
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) return alert('Vui lòng đăng nhập để bình luận!');
        if (!commentText.trim()) return;
        setSubmittingComment(true);
        try {
            const res = await client.post(`/posts/${id}/comments`, { content: commentText });
            setComments(prev => [...prev, {
                ...res.data,
                username: user.username,
                avatar_url: user.avatar_url
            }]);
            setCommentText('');
        } catch (error) {
            alert(error.response?.data?.error || 'Lỗi khi gửi bình luận');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) return (
        <div className="p-40 text-center flex flex-col items-center justify-center gap-6">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-[6px] border-indigo-600 border-t-transparent rounded-full shadow-soft"
            />
            <div className="space-y-2">
                <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px]">Neural Syncing</p>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">Đang giải mã hương vị...</p>
            </div>
        </div>
    );
    if (!post) return (
        <div className="p-40 text-center space-y-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                <ChevronLeft size={40} className="text-slate-200" />
            </div>
            <p className="font-black text-slate-900 text-xl tracking-tight">Dữ liệu món ăn không tồn tại!</p>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto space-y-16 pb-32 px-4 md:px-0"
        >
            <Link to="/" className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all font-black mb-10 group w-fit">
                <div className="p-1.5 bg-white shadow-soft rounded-lg group-hover:bg-indigo-50 transition-colors">
                    <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
                </div>
                <span className="uppercase tracking-[0.2em] text-[10px]">Quay lại Feed AI</span>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Large Media Overlay */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="rounded-[56px] overflow-hidden shadow-premium aspect-[4/5] bg-slate-50 relative group"
                >
                    <img src={post.image_url} alt={post.title} referrerPolicy="no-referrer" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none"></div>
                </motion.div>

                {/* Info & Interaction System */}
                <motion.div 
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-10 py-6"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.3em] inline-block bg-indigo-50 px-5 py-2 rounded-full border border-indigo-100">
                                {post.category_name}
                            </span>
                            <div className="flex items-center gap-1.5 text-rose-500 font-black text-[10px] uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-full border border-rose-100 shadow-sm">
                                <Sparkles size={12} className="fill-rose-500" />
                                Trending
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1] tracking-tighter group-hover:text-indigo-600 transition-colors">{post.title}</h1>
                        <p className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] italic">
                            <MapPin size={16} className="text-indigo-500" /> {post.location}
                        </p>
                    </div>

                    <div className="flex items-center gap-10 border-y border-slate-100 py-10">
                        <div className="flex flex-col gap-1">
                            <span className="text-4xl font-black text-slate-900 tracking-tighter">
                                {Number(post.price).toLocaleString()}đ
                            </span>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Chi phí dự kiến</span>
                        </div>
                        <div className="h-16 w-0.5 bg-slate-100"></div>
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <Star size={28} className="text-amber-500 fill-amber-500" />
                                <span className="text-4xl font-black text-slate-900 tracking-tighter">{Number(post.avg_rating || 0).toFixed(1)}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Rating Cộng đồng</span>
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-widest flex items-center gap-3">
                            <div className="w-1 h-3 bg-indigo-600 rounded-full"></div>
                            Review Hệ thống
                        </h3>
                        <p className="text-slate-500 leading-relaxed font-medium text-lg italic bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">{post.description}</p>
                    </div>

                    {/* Interaction Buttons - Tactile */}
                    <div className="flex items-center gap-5">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleInteract('like')}
                            className={`flex-1 border-2 py-6 rounded-[32px] flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-widest transition-all shadow-soft
                                ${liked
                                    ? 'bg-rose-50 border-rose-500 text-rose-500 hover:text-white hover:bg-rose-500'
                                    : 'bg-white border-slate-100 hover:border-rose-500 hover:text-rose-500'}`}
                        >
                            <Heart size={22} className={liked ? 'fill-rose-500 group-hover:fill-current' : ''} />
                            {liked ? 'Đã yêu thích' : 'Lưu món này'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05, rotate: 10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleInteract('favorite')}
                            className={`p-6 rounded-[32px] shadow-2xl transition-all duration-300
                                ${favorited
                                    ? 'bg-rose-500 text-white shadow-rose-500/30'
                                    : 'bg-indigo-600 text-white shadow-indigo-600/30'}`}
                        >
                            <BookmarkPlus size={26} />
                        </motion.button>
                    </div>

                    {/* Personal AI Feedback Interface */}
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-950 p-10 rounded-[48px] space-y-8 text-white relative overflow-hidden group/feedback"
                    >
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover/feedback:opacity-10 transition-opacity">
                            <Sparkles size={120} />
                        </div>
                        <div className="space-y-2">
                             <p className="font-black text-[10px] uppercase tracking-[0.3em] text-indigo-400">Huấn luyện cá nhân hóa</p>
                             <h4 className="text-xl font-black tracking-tight italic">Khẩu vị của bạn hôm nay thế nào?</h4>
                        </div>
                        <div className="flex gap-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <motion.div
                                    key={star}
                                    whileHover={{ scale: 1.25 }}
                                    whileTap={{ scale: 0.85 }}
                                >
                                    <Star
                                        size={48}
                                        className={`cursor-pointer transition-all duration-300 ${star <= (hoverRating || rating) ? 'text-amber-500 fill-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'text-slate-800 hover:text-slate-600'}`}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => handleInteract('rate', star)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
                            * Phản hồi giúp AI giải mã chính xác hơn gu ẩm thực 4.0 của riêng bạn.
                        </p>
                    </motion.div>
                </motion.div>
            </div>

            {/* Similar Context Section */}
            {similar.length > 0 && (
                <section className="pt-24 border-t border-slate-100 space-y-12">
                    <div className="flex items-center gap-5">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[28px] shadow-soft font-black text-xl border border-indigo-100">
                             <Sparkles size={28} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Hệ sinh thái hương vị</h2>
                            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] italic">AI Neural Context-based Recommendations</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                        {similar.map(item => <PostCard key={item.id} post={item} />)}
                    </div>
                </section>
            )}

            {/* Premium Conversation Section */}
            <section className="pt-24 border-t border-slate-100 space-y-12">
                <div className="flex items-center justify-between">
                    <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                        <MessageCircle size={32} className="text-slate-300" />
                        Cộng đồng <span className="text-indigo-600 italic font-mono text-2xl ml-2 tracking-widest">// {comments.length}</span>
                    </h2>
                </div>

                {/* Floating Submit Form */}
                {user ? (
                    <form onSubmit={handleCommentSubmit} className="flex gap-4 bg-white p-3 rounded-[36px] shadow-premium border border-slate-100 focus-within:ring-4 ring-indigo-50 transition-all">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Gửi gắm cảm nghĩ của bạn..."
                            className="flex-1 bg-transparent rounded-[24px] px-8 py-5 outline-none font-bold text-slate-900 placeholder:text-slate-300"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={submittingComment || !commentText.trim()}
                            className="bg-indigo-600 text-white px-10 py-5 rounded-[28px] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 disabled:opacity-50 transition-all flex items-center gap-3"
                        >
                            <span>Gửi</span>
                            <Send size={18} />
                        </motion.button>
                    </form>
                ) : (
                    <Link to="/login" className="block p-12 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[48px] text-center group hover:bg-white hover:border-indigo-100 transition-all">
                        <p className="text-slate-400 font-extrabold uppercase tracking-widest text-sm group-hover:text-indigo-600 transition-colors">
                             Kết nối tài khoản DeepMind để tham gia thảo luận
                        </p>
                    </Link>
                )}

                {/* Staggered Comments List */}
                <div className="space-y-8">
                    {commentsLoading ? (
                        <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest py-4 animate-pulse">Neural Decoding...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-slate-400 font-black text-center py-24 border-4 border-dashed border-slate-50 rounded-[56px] italic uppercase tracking-[0.2em] opacity-40">
                            Hệ thống chưa ghi nhận cuộc hội thoại nào.
                        </div>
                    ) : (
                        <motion.div 
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: { opacity: 0 },
                                show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                            }}
                            className="space-y-8"
                        >
                            {comments.map((comment, idx) => (
                                <motion.div 
                                    key={comment.id}
                                    variants={{
                                        hidden: { opacity: 0, y: 15 },
                                        show: { opacity: 1, y: 0 }
                                    }}
                                    className="flex gap-6 group"
                                >
                                    <div className="w-14 h-14 rounded-[22px] bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 overflow-hidden shadow-soft border border-indigo-100 group-hover:ring-4 ring-indigo-50 transition-all">
                                        {comment.avatar_url
                                            ? <img src={comment.avatar_url} alt={comment.username} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                                            : <span className="font-black text-lg">{comment.username.charAt(0).toUpperCase()}</span>
                                        }
                                    </div>
                                    <div className="flex-1 bg-white p-8 rounded-[40px] shadow-soft border border-slate-100 group-hover:border-indigo-100 transition-all duration-300">
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="font-black text-slate-900 text-base">{comment.username}</span>
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">
                                                {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 font-medium leading-relaxed italic line-clamp-3 group-hover:text-slate-700">"{comment.content}"</p>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>
        </motion.div>
    );
};

export default PostDetail;
