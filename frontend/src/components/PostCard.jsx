import React, { useEffect, useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  MapPin,
  Star,
  Sparkles,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import client from "../api/client";
import useStore from "../store/useStore";
import HashtagText from "./HashtagText";

const PostCard = ({ post, onUpdate }) => {
  const { user } = useStore();
  const [isLiked, setIsLiked] = useState(
    Boolean(post.is_liked || post.is_favorited),
  );
  const [likeCount, setLikeCount] = useState(post.like_count || 0);
  const [following, setFollowing] = useState(post.is_following_author);

  useEffect(() => {
    setIsLiked(Boolean(post.is_liked || post.is_favorited));
    setLikeCount(Number(post.like_count || 0));
    setFollowing(Boolean(post.is_following_author));
  }, [post.is_liked, post.is_favorited, post.like_count, post.is_following_author]);

  const handleFollowToggle = async (e) => {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập để theo dõi!");
    try {
      if (following) {
        await client.post("/social/unfollow", { followingId: post.user_id });
      } else {
        await client.post("/social/follow", { followingId: post.user_id });
      }
      setFollowing(!following);
    } catch (error) {
      console.error(error);
    }
  };


  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập để tương tác!");

    try {
      await client.post("/interact", { postId: post.id, action: "like" });
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập để chia sẻ!");

    if (
      window.confirm(
        "Bạn có muốn chia sẻ bài viết này lên dòng thời gian của mình?",
      )
    ) {
      try {
        await client.post("/posts", {
          title: `Chia sẻ: ${post.title}`,
          description: `Bạn đang chia sẻ món này #Shared #FoodRecAI \n\n --- \n ${post.description}`,
          originalPostId: post.id,
          categoryId: post.category_id,
          imageUrl: post.image_url,
          location: post.location,
        });
        alert("Đã chia sẻ thành công!");
        if (onUpdate) onUpdate();
      } catch (error) {
        alert("Lỗi khi chia sẻ");
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -10 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="bg-white rounded-[40px] overflow-hidden shadow-premium border border-gray-100/50 mb-10 hover:shadow-2xl transition-all duration-500 group"
    >
      {/* Header - Thông tin người dùng */}
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to={`/profile/${post.user_id}`}
            className="relative group/avatar"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black border-2 border-white shadow-soft overflow-hidden transition-transform group-hover/avatar:scale-110">
              {post.avatar_url ? (
                <img
                  src={post.avatar_url}
                  alt={post.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-black">
                  {post.username?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </Link>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                to={`/profile/${post.user_id}`}
                className="font-extrabold text-slate-900 hover:text-indigo-600 transition-all text-[15px] tracking-tight decoration-none"
              >
                {post.username}
              </Link>
              {user?.id !== post.user_id && (
                <button
                  onClick={handleFollowToggle}
                  className={`p-1.5 rounded-lg transition-all ${following ? "text-slate-300 hover:text-slate-400" : "text-indigo-600 hover:bg-indigo-50"}`}
                  title={following ? "Bỏ theo dõi" : "Theo dõi"}
                >
                  {following ? <UserMinus size={14} /> : <UserPlus size={14} />}
                </button>
              )}
              {post.is_ai_recommendation && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-rose-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-indigo-500/20 uppercase tracking-[0.1em]"
                >
                  <Sparkles size={10} className="fill-white" />
                  Gợi ý AI
                </motion.span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
              <span className="opacity-70">
                {post.created_at && !isNaN(new Date(post.created_at))
                  ? new Date(post.created_at).toLocaleDateString("vi-VN")
                  : "Đang cập nhật"}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-200"></span>
              <span className="flex items-center gap-1 text-indigo-400 group-hover:text-indigo-500 transition-colors">
                <MapPin size={10} /> {post.location}
              </span>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ rotate: 90 }}
          className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-300 hover:text-slate-900"
        >
          <MoreHorizontal size={20} />
        </motion.button>
      </div>

      {/* Thân bài viết - Tiêu đề & Nội dung */}
      <div className="px-8 pb-6 space-y-3">
        {post.title && (
          <h3 className="font-black text-slate-900 text-2xl md:text-3xl tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
            {post.title}
          </h3>
        )}
        <div className="text-[15px] text-slate-500 font-medium leading-relaxed italic line-clamp-3">
          <HashtagText text={post.description} />
        </div>
      </div>

      {/* Hình ảnh - Media */}
      <Link
        to={`/post/${post.id}`}
        className="block relative aspect-[16/10] bg-slate-50 overflow-hidden mx-4 mb-4 rounded-[32px] group/media"
      >
        <img
          src={post.image_url}
          alt={post.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover/media:scale-110"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop";
          }}
        />

        {/* Rating Badge Overlay */}
        <div className="absolute top-6 right-6 glass-premium px-4 py-2 rounded-[20px] flex items-center gap-2 shadow-xl border border-white/40">
          <Star size={18} className="text-amber-500 fill-amber-500" />
          <span className="text-sm font-black text-slate-900">
            {Number(post.avg_rating || 0).toFixed(1)}
          </span>
        </div>

        {post.category_name && (
          <div className="absolute bottom-6 left-6 glass-premium px-4 py-2 rounded-[20px] text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 border border-white/40">
            {post.category_name}
          </div>
        )}

        {/* Lớp phủ khi hover */}
        <div className="absolute inset-0 bg-indigo-500/0 group-hover/media:bg-indigo-500/5 transition-colors duration-500 pointer-events-none"></div>
      </Link>

      {/* Footer - Tương tác */}
      <div className="px-6 py-5 bg-white flex items-center justify-between border-t border-slate-50">
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLike}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-[24px] transition-all duration-300 font-black text-[11px] uppercase tracking-widest
              ${isLiked ? "text-rose-500 bg-rose-50 shadow-inner" : "text-slate-400 hover:text-slate-900 bg-slate-50/50 hover:bg-slate-100/50"}`}
          >
            <Heart size={18} className={isLiked ? "fill-rose-500" : ""} />
            {likeCount > 0 && <span>{likeCount}</span>}
            <span className="hidden sm:inline">
              {isLiked ? "Đã thích" : "Thích"}
            </span>
          </motion.button>

          <Link
            to={`/post/${post.id}`}
            className="flex items-center gap-2.5 px-6 py-3 rounded-[24px] bg-slate-50/50 hover:bg-slate-100/50 transition-all text-slate-400 hover:text-slate-900 font-black text-[11px] uppercase tracking-widest no-underline"
          >
            <MessageCircle size={18} />
            {post.comment_count > 0 && <span>{post.comment_count}</span>}
            <span className="hidden sm:inline">Phản hồi</span>
          </Link>
        </div>

        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleShare}
          className="flex items-center gap-2.5 px-6 py-3 rounded-[24px] bg-indigo-50/30 hover:bg-indigo-600 text-indigo-600 hover:text-white transition-all font-black text-[11px] uppercase tracking-widest shadow-soft hover:shadow-lg hover:shadow-indigo-500/20"
        >
          <Share2 size={18} />
          <span className="hidden sm:inline">
            {post.share_count > 0 ? post.share_count : "Chia sẻ"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PostCard;