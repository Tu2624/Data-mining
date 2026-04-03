import React, { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Clock,
  Sparkles,
  ChevronRight,
  Filter,
  ArrowUpRight,
  MapPin,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import client from "../api/client";
import useStore from "../store/useStore";
import PostCard from "../components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const location = useLocation();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      const query = params.get("q") || "";
      const res = await client.get(`/posts?q=${query}`);
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [location.search]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const getFilteredPosts = () => {
    let result = [...posts];
    if (activeFilter === "Thịnh hành") {
      result.sort(
        (a, b) => Number(b.avg_rating || 0) - Number(a.avg_rating || 0),
      );
    } else if (activeFilter === "Gần đây") {
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
    } else if (activeFilter === "Gợi ý AI") {
      // Giả lập Gợi ý AI bằng cách ưu tiên các bài có rating_count cao và xáo trộn nhẹ
      result.sort(
        (a, b) =>
          (b.rating_count || 0) -
          (a.rating_count || 0) +
          (Math.sin(a.id) - Math.sin(b.id)),
      );
    }
    return result;
  };

  const displayPosts = getFilteredPosts();

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4 md:px-0">
      {/* Hero Section - Modern Culinary AI Overhaul */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-16 rounded-[48px] overflow-hidden bg-slate-950 p-12 lg:p-20 text-white shadow-premium"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-rose-500/10 pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 blur-[120px] rounded-full animate-pulse"></div>

        <div className="relative z-10 max-w-3xl space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-3 bg-white/10 px-6 py-2.5 rounded-full text-[11px] font-black uppercase tracking-[0.3em] border border-white/10 backdrop-blur-md"
          >
            <Sparkles size={16} className="text-indigo-400" />
            Trải nghiệm ẩm thực tương lai
          </motion.div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/60">
            Khám phá <br />
            <span className="text-indigo-400 italic">Vị giác Thế hệ mới</span>
          </h1>

          <p className="text-slate-400 text-xl font-medium max-w-xl leading-relaxed">
            Dựa trên hàng triệu tương tác cộng đồng, FoodRec AI kiến tạo hành
            trình ẩm thực cá nhân hóa dành riêng cho bạn.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <button className="px-10 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:shadow-2xl hover:shadow-indigo-500/40 transition-all active:scale-95">
              Khám phá ngay
            </button>
            <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[24px] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
              Học máy & AI
            </button>
          </div>
        </div>
      </motion.div>

      <div className="sticky top-28 z-50 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 glass-premium p-4 md:p-5 rounded-[32px] shadow-premium">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto whitespace-nowrap">
          {["Tất cả", "Gợi ý AI", "Thịnh hành", "Gần đây"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-8 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all shrink-0
                                ${activeFilter === tab ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative group w-full md:w-80">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
            size={20}
          />
          <input
            type="text"
            placeholder="Tìm kiếm cảm hứng..."
            className="w-full bg-slate-50 border-none rounded-[24px] pl-14 pr-6 py-4 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-4 ring-indigo-50 transition-all outline-none"
          />
        </div>
      </div>

      {/* Feed Grid - Staggered Motion */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-100 rounded-[40px] aspect-[4/5] animate-pulse"
            ></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="py-40 text-center space-y-6">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
            <Search size={40} className="text-slate-200" />
          </div>
          <div className="space-y-2">
            <p className="text-xl font-black text-slate-900">
              Không tìm thấy món ăn nào!
            </p>
            <p className="text-slate-400 font-medium italic">
              Hãy thử từ khóa khác hoặc quay lại sau.
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {displayPosts.map((post) => (
            <PostCard
              key={`${activeFilter}-${post.id}`}
              post={post}
              onUpdate={fetchPosts}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Home;
