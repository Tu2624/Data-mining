import React from "react";
import { motion } from "framer-motion";
import { Sparkles, MapPin, Star, Heart, BookmarkPlus } from "lucide-react";

const InteractionSection = ({
  post,
  liked,
  favorited,
  rating,
  hoverRating,
  setHoverRating,
  handleInteract,
}) => {
  return (
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
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1] tracking-tighter group-hover:text-indigo-600 transition-colors">
          {post.title}
        </h1>
        <p className="flex items-center gap-3 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] italic">
          <MapPin size={16} className="text-indigo-500" /> {post.location}
        </p>
      </div>

      <div className="flex items-center gap-10 border-y border-slate-100 py-10">
        <div className="flex flex-col gap-1">
          <span className="text-4xl font-black text-slate-900 tracking-tighter">
            {Number(post.price).toLocaleString()}đ
          </span>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Chi phí dự kiến
          </span>
        </div>
        <div className="h-16 w-0.5 bg-slate-100"></div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Star size={28} className="text-amber-500 fill-amber-500" />
            <span className="text-4xl font-black text-slate-900 tracking-tighter">
              {Number(post.avg_rating || 0).toFixed(1)}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            Rating Cộng đồng
          </span>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-widest flex items-center gap-3">
          <div className="w-1 h-3 bg-indigo-600 rounded-full"></div>
          Review Hệ thống
        </h3>
        <p className="text-slate-500 leading-relaxed font-medium text-lg italic bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
          {post.description}
        </p>
      </div>

      {/* Interaction Buttons - Tactile */}
      <div className="flex items-center gap-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleInteract("like")}
          className={`flex-1 border-2 py-6 rounded-[32px] flex items-center justify-center gap-4 font-black text-[11px] uppercase tracking-widest transition-all shadow-soft
                        ${
                          liked
                            ? "bg-rose-50 border-rose-500 text-rose-500 hover:text-white hover:bg-rose-500"
                            : "bg-white border-slate-100 hover:border-rose-500 hover:text-rose-500"
                        }`}
        >
          <Heart
            size={22}
            className={liked ? "fill-rose-500 group-hover:fill-current" : ""}
          />
          {liked ? "Đã yêu thích" : "Lưu món này"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 10 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleInteract("favorite")}
          className={`p-6 rounded-[32px] shadow-2xl transition-all duration-300
                        ${
                          favorited
                            ? "bg-rose-500 text-white shadow-rose-500/30"
                            : "bg-indigo-600 text-white shadow-indigo-600/30"
                        }`}
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
          <p className="font-black text-[10px] uppercase tracking-[0.3em] text-indigo-400">
            Huấn luyện cá nhân hóa
          </p>
          <h4 className="text-xl font-black tracking-tight italic">
            Khẩu vị của bạn hôm nay thế nào?
          </h4>
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
                className={`cursor-pointer transition-all duration-300 ${star <= (hoverRating || rating) ? "text-amber-500 fill-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" : "text-slate-800 hover:text-slate-600"}`}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleInteract("rate", star)}
              />
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">
          * Phản hồi giúp AI giải mã chính xác hơn gu ẩm thực 4.0 của riêng bạn.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default InteractionSection;
