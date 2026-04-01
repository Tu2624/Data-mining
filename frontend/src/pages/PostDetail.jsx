import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, MapPin, MessageSquare, ChevronLeft, Send, Sparkles } from 'lucide-react';
import client from '../api/client';
import useStore from '../store/useStore';
import PostCard from '../components/PostCard';
import Skeleton from '../components/Skeleton';

const PostDetail = () => {
    const { id } = useParams();
    const { user } = useStore();
    const [post, setPost] = useState(null);
    const [similar, setSimilar] = useState([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        fetchPost();
        window.scrollTo(0, 0);
    }, [id]);

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

    const handleInteract = async (action, score = null) => {
        if (!user) return alert('Vui lòng đăng nhập!');
        try {
            await client.post('/interact', { postId: id, action, score });
            if (action === 'rate') setRating(score);
            alert(`Đã ${action === 'rate' ? 'đánh giá' : 'tương tác'} thành công!`);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="p-20 text-center text-primary-500 font-bold">Đang tải hương vị...</div>;
    if (!post) return <div className="p-20 text-center font-bold">Không tìm thấy bài viết!</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition font-bold mb-6">
                <ChevronLeft size={20} /> Quay lại
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 70% Large Media */}
                <div className="rounded-3xl overflow-hidden shadow-premium aspect-[4/5]">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
                </div>

                {/* Info & Interaction */}
                <div className="space-y-8 py-4">
                    <div className="space-y-4">
                        <span className="text-primary-500 font-black text-xs uppercase tracking-[0.2em]">
                            {post.category_name}
                        </span>
                        <h1 className="text-5xl font-black text-gray-900 leading-tight">{post.title}</h1>
                        <p className="flex items-center gap-2 text-gray-500 font-medium">
                            <MapPin size={18} /> {post.location}
                        </p>
                    </div>

                    <div className="flex items-center gap-6 border-y border-gray-100 py-6">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-primary-500">
                                {Number(post.price).toLocaleString()}đ
                            </span>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Giá tham khảo</span>
                        </div>
                        <div className="h-10 w-[1px] bg-gray-100"></div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1">
                                <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-2xl font-black">{Number(post.avg_rating).toFixed(1)}</span>
                            </div>
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Đánh giá</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-900 text-lg">Mô tả</h3>
                        <p className="text-gray-600 leading-relaxed">{post.description}</p>
                    </div>

                    {/* Interaction Buttons */}
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => handleInteract('like')}
                            className="flex-1 bg-white border-2 border-gray-100 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold hover:border-red-500 hover:text-red-500 transition shadow-soft"
                        >
                            <Heart size={20} /> Yêu thích
                        </button>
                        <button 
                            onClick={() => handleInteract('favorite')}
                            className="bg-primary-500 text-white p-4 rounded-2xl shadow-premium hover:scale-105 transition"
                        >
                            <MessageSquare size={20} />
                        </button>
                    </div>

                    {/* Rating Interface */}
                    <div className="bg-gray-50 p-6 rounded-3xl space-y-4">
                        <p className="font-bold text-gray-900">Gu của bạn thế nào? (Khai phá sở thích)</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                    key={star} 
                                    size={32} 
                                    className={`cursor-pointer transition ${star <= (hoverRating || rating) ? 'text-yellow-500 fill-yellow-500 scale-110' : 'text-gray-300'}`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => handleInteract('rate', star)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar Section (AI) */}
            <section className="pt-12 border-t border-gray-100 space-y-8">
                <h2 className="text-2xl font-black flex items-center gap-2">
                    <Sparkles className="text-primary-500" />
                    Bản tin gợi ý tương tự (AI Content-based)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {similar.map(item => <PostCard key={item.id} post={item} />)}
                </div>
            </section>
        </div>
    );
};

export default PostDetail;
