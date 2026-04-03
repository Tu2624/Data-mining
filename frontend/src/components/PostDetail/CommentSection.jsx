import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";

const CommentSection = ({
  user,
  comments,
  commentsLoading,
  commentText,
  setCommentText,
  handleCommentSubmit,
  submittingComment,
}) => {
  return (
    <section className="pt-24 border-t border-slate-100 space-y-12">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
          <MessageCircle size={32} className="text-slate-300" />
          Cộng đồng{" "}
          <span className="text-indigo-600 italic font-mono text-2xl ml-2 tracking-widest">
            // {comments.length}
          </span>
        </h2>
      </div>

      {/* Floating Submit Form */}
      {user ? (
        <form
          onSubmit={handleCommentSubmit}
          className="flex gap-4 bg-white p-3 rounded-[36px] shadow-premium border border-slate-100 focus-within:ring-4 ring-indigo-50 transition-all"
        >
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
        <Link
          to="/login"
          className="block p-12 bg-slate-50 border-2 border-dashed border-slate-100 rounded-[48px] text-center group hover:bg-white hover:border-indigo-100 transition-all"
        >
          <p className="text-slate-400 font-extrabold uppercase tracking-widest text-sm group-hover:text-indigo-600 transition-colors">
            Kết nối tài khoản DeepMind để tham gia thảo luận
          </p>
        </Link>
      )}

      {/* Staggered Comments List */}
      <div className="space-y-8">
        {commentsLoading ? (
          <div className="text-slate-400 font-black uppercase text-[10px] tracking-widest py-4 animate-pulse">
            Neural Decoding...
          </div>
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
              show: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="space-y-8"
          >
            {comments.map((comment, idx) => (
              <motion.div
                key={comment.id}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 },
                }}
                className="flex gap-6 group"
              >
                <div className="w-14 h-14 rounded-[22px] bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0 overflow-hidden shadow-soft border border-indigo-100 group-hover:ring-4 ring-indigo-50 transition-all">
                  {comment.avatar_url ? (
                    <img
                      src={comment.avatar_url}
                      alt={comment.username}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-black text-lg">
                      {comment.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-1 bg-white p-8 rounded-[40px] shadow-soft border border-slate-100 group-hover:border-indigo-100 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-black text-slate-900 text-base">
                      {comment.username}
                    </span>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">
                      {new Date(comment.created_at).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed italic line-clamp-3 group-hover:text-slate-700">
                    "{comment.content}"
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CommentSection;
