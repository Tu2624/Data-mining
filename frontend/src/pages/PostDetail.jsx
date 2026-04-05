import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";
import useStore from "../store/useStore";
import PostCard from "../components/PostCard";

// Components
import InteractionSection from "../components/PostDetail/InteractionSection";
import CommentSection from "../components/PostDetail/CommentSection";

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
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    fetchPost();
    fetchComments();

    // Ghi nhận lịch sử xem món ăn
    if (user) {
      client
        .post("/interact", { postId: id, action: "view" })
        .catch(console.error);
    }

    window.scrollTo(0, 0);
  }, [id, user]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const res = await client.get(`/posts/${id}`);
      setPost(res.data.post);
      setSimilar(res.data.similar);
      setLiked(Boolean(res.data.post?.is_liked));
      setFavorited(Boolean(res.data.post?.is_favorited));
      setRating(Number(res.data.post?.user_rating || 0));
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
    if (!user) return alert("Vui lòng kết nối thuật toán (Đăng nhập)!");
    try {
      await client.post("/interact", { postId: id, action, score });
      if (action === "like") {
        setLiked(!liked);
      } else if (action === "favorite") {
        setFavorited(!favorited);
      } else if (action === "rate") {
        setRating(score);
        await fetchPost();
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Lỗi hệ thống");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Vui lòng đăng nhập để bình luận!");
    if (!commentText.trim()) return;
    setSubmittingComment(true);
    try {
      const res = await client.post(`/posts/${id}/comments`, {
        content: commentText,
      });
      setComments((prev) => [
        ...prev,
        {
          ...res.data,
          username: user.username,
          avatar_url: user.avatar_url,
        },
      ]);
      setCommentText("");
    } catch (error) {
      alert(error.response?.data?.error || "Lỗi khi gửi bình luận");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading)
    return (
      <div className="p-40 text-center flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-[6px] border-indigo-600 border-t-transparent rounded-full shadow-soft"
        />
        <div className="space-y-2">
          <p className="text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px]">
            Neural Syncing
          </p>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest italic">
            Đang giải mã hương vị...
          </p>
        </div>
      </div>
    );
  if (!post)
    return (
      <div className="p-40 text-center space-y-4">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
          <ChevronLeft size={40} className="text-slate-200" />
        </div>
        <p className="font-black text-slate-900 text-xl tracking-tight">
          Dữ liệu món ăn không tồn tại!
        </p>
      </div>
    );

  const fallbackImage =
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1200&auto=format&fit=crop";
  const displayImage = post.image_url || fallbackImage;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-16 pb-32 px-4 md:px-0"
    >
      <Link
        to="/"
        className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-all font-black mb-10 group w-fit"
      >
        <div className="p-1.5 bg-white shadow-soft rounded-lg group-hover:bg-indigo-50 transition-colors">
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </div>
        <span className="uppercase tracking-[0.2em] text-[10px]">
          Quay lại Feed AI
        </span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Large Media Overlay */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="rounded-[56px] overflow-hidden shadow-premium aspect-[4/5] bg-slate-50 relative group"
        >
          <img
            src={displayImage}
            alt={post.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none"></div>
        </motion.div>

        {/* Info & Interaction System */}
        <InteractionSection
          post={post}
          liked={liked}
          favorited={favorited}
          rating={rating}
          hoverRating={hoverRating}
          setHoverRating={setHoverRating}
          handleInteract={handleInteract}
        />
      </div>

      {/* Similar Context Section */}
      {similar.length > 0 && (
        <section className="pt-24 border-t border-slate-100 space-y-12">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-[28px] shadow-soft font-black text-xl border border-indigo-100">
              <Sparkles size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                Hệ sinh thái hương vị
              </h2>
              <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] italic">
                AI Neural Context-based Recommendations
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {similar.map((item) => (
              <PostCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      )}

      {/* Premium Conversation Section */}
      <CommentSection
        user={user}
        comments={comments}
        commentsLoading={commentsLoading}
        commentText={commentText}
        setCommentText={setCommentText}
        handleCommentSubmit={handleCommentSubmit}
        submittingComment={submittingComment}
      />
    </motion.div>
  );
};

export default PostDetail;
