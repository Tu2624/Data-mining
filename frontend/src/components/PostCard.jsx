import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import useStore from '../store/useStore';
import HashtagText from './HashtagText';

const PostCard = ({ post, onUpdate }) => {
  const { user } = useStore();
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.like_count || 0);

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return alert('Vui lòng đăng nhập để tương tác!');
    
    try {
      await client.post('/interact', { postId: post.id, action: 'like' });
      setIsLiked(!isLiked);
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!user) return alert('Vui lòng đăng nhập để chia sẻ!');
    
    if (window.confirm('Bạn có muốn chia sẻ bài viết này lên dòng thời gian của mình?')) {
      try {
        await client.post('/posts', {
          title: `Chia sẻ: ${post.title}`,
          description: `Bạn đang chia sẻ món này #Shared #FoodRecAI \n\n --- \n ${post.description}`,
          originalPostId: post.id,
          categoryId: post.category_id,
          imageUrl: post.image_url,
          location: post.location
        });
        alert('Đã chia sẻ thành công!');
        if (onUpdate) onUpdate();
      } catch (error) {
        alert('Lỗi khi chia sẻ');
      }
    }
  };

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-soft ring-1 ring-black/5 mb-6 hover:shadow-premium transition-shadow duration-300">
      {/* Header: User Info */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.user_id}`} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary-600 font-bold border-2 border-white shadow-sm overflow-hidden">
            {post.avatar_url ? (
              <img src={post.avatar_url} alt={post.username} className="w-full h-full object-cover" />
            ) : (
              post.username?.charAt(0).toUpperCase()
            )}
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link to={`/profile/${post.user_id}`} className="font-bold text-gray-900 hover:text-primary-500 transition-colors text-sm">
                {post.username}
              </Link>
              {post.is_ai_recommendation && (
                <span className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  <Star size={8} className="fill-white" />
                  GỢI Ý CHO BẠN
                </span>
              )}
            </div>
            <div className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
              <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
              <span>•</span>
              <span className="flex items-center gap-0.5"><MapPin size={10} /> {post.location}</span>
            </div>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content: Text & HashTags */}
      <div className="px-5 pb-4">
        {post.title && <h3 className="font-black text-gray-900 text-lg mb-2 leading-tight">{post.title}</h3>}
        <HashtagText text={post.description} />
      </div>

      {/* Post Media: Image/Video */}
      <Link to={`/post/${post.id}`} className="block relative aspect-video bg-gray-100 overflow-hidden">
        <img 
          src={post.image_url} 
          alt={post.title} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop';
          }}
        />
        {/* Rating Badge Overlay */}
        <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg border border-white/50">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-black text-gray-900">{Number(post.avg_rating || 0).toFixed(1)}</span>
        </div>
        {post.category_name && (
          <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary-600 border border-white/50">
            {post.category_name}
          </div>
        )}
      </Link>

      {/* Footer: Interactions */}
      <div className="p-3 bg-gray-50/50 flex items-center justify-between border-t border-gray-100">
        <div className="flex items-center gap-1">
          <button 
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all duration-300 font-bold text-sm ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <Heart size={18} className={isLiked ? 'fill-red-500' : ''} />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>
          
          <Link 
            to={`/post/${post.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-gray-100 transition-all text-gray-500 font-bold text-sm"
          >
            <MessageCircle size={18} />
            {post.comment_count > 0 && <span>{post.comment_count}</span>}
          </Link>
        </div>

        <button 
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all text-gray-500 font-bold text-sm"
        >
          <Share2 size={18} />
          <span>{post.share_count > 0 ? post.share_count : 'Chia sẻ'}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
