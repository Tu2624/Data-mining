import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, Star, MapPin, BookmarkPlus, ChevronLeft, Send, Sparkles, User } from 'lucide-react';
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
        if (!user) return alert('Vui lòng đăng nhập!');
        try {
            await client.post('/interact', { postId: id, action, score });
            if (action === 'like') {
                setLiked(true);
            } else if (action === 'favorite') {
                setFavorited(true);
            } else if (action === 'rate') {
                setRating(score);
                await fetchPost();
            }
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.error || 'Lỗi khi tương tác');
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

    if (loading) return <div className="p-20 text-center text-primary-500 font-bold">Đang tải hương vị...</div>;
    if (!post) return <div className="p-20 text-center font-bold">Không tìm thấy bài viết!</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-primary-500 transition font-bold mb-6">
                <ChevronLeft size={20} /> Quay lại
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Large Media */}
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
                                <span className="text-2xl font-black">{Number(post.avg_rating || 0).toFixed(1)}</span>
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
                            disabled={liked}
                            className={`flex-1 border-2 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition shadow-soft
                                ${liked
                                    ? 'bg-red-50 border-red-500 text-red-500 cursor-not-allowed'
                                    : 'bg-white border-gray-100 hover:border-red-500 hover:text-red-500'}`}
                        >
                            <Heart size={20} className={liked ? 'fill-red-500' : ''} />
                            {liked ? 'Đã thích' : 'Yêu thích'}
                        </button>
                        <button
                            onClick={() => handleInteract('favorite')}
                            disabled={favorited}
                            className={`p-4 rounded-2xl shadow-premium transition
                                ${favorited
                                    ? 'bg-yellow-500 text-white cursor-not-allowed'
                                    : 'bg-primary-500 text-white hover:scale-105'}`}
                        >
                            <BookmarkPlus size={20} />
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
                        {rating > 0 && (
                            <p className="text-sm text-gray-500 font-medium">Bạn đã đánh giá {rating} sao</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Similar Section (AI) */}
            {similar.length > 0 && (
                <section className="pt-12 border-t border-gray-100 space-y-8">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <Sparkles className="text-primary-500" />
                        Bản tin gợi ý tương tự (AI Content-based)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {similar.map(item => <PostCard key={item.id} post={item} />)}
                    </div>
                </section>
            )}

            {/* Comment Section */}
            <section className="pt-12 border-t border-gray-100 space-y-8">
                <h2 className="text-2xl font-black">
                    Bình luận ({comments.length})
                </h2>

                {/* Submit form */}
                {user ? (
                    <form onSubmit={handleCommentSubmit} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 flex-shrink-0">
                            <User size={18} />
                        </div>
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Viết bình luận của bạn..."
                                className="flex-1 bg-gray-50 rounded-2xl px-5 py-3 border-2 border-transparent focus:border-primary-500 outline-none font-medium transition-all"
                            />
                            <button
                                type="submit"
                                disabled={submittingComment || !commentText.trim()}
                                className="bg-primary-500 text-white px-5 py-3 rounded-2xl font-bold hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-400 font-medium">
                        <Link to="/login" className="text-primary-500 font-bold hover:underline">Đăng nhập</Link> để bình luận
                    </p>
                )}

                {/* Comments list */}
                <div className="space-y-4">
                    {commentsLoading ? (
                        <div className="text-gray-400 font-medium py-4">Đang tải bình luận...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-gray-400 font-medium text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl">
                            Chưa có bình luận nào. Hãy là người đầu tiên!
                        </div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} className="flex gap-4">
                                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-500 flex-shrink-0 overflow-hidden">
                                    {comment.avatar_url
                                        ? <img src={comment.avatar_url} alt={comment.username} className="w-full h-full object-cover" />
                                        : <User size={16} />
                                    }
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm text-gray-900">{comment.username}</span>
                                        <span className="text-xs text-gray-400">
                                            {new Date(comment.created_at).toLocaleString('vi-VN')}
                                        </span>
                                    </div>
                                    <p className="text-gray-700 text-sm">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default PostDetail;
