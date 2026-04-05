import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Info, X, Calculator, Users, Star, Heart, ThumbsUp, Eye } from "lucide-react";

const LogicVisualizer = ({ analysis }) => {
  const [showMath, setShowMath] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState(null);

  const weights = analysis?.weights || { rating: 1, favorite: 3, like: 2, view: 1 };

  return (
    <div className="col-span-12 space-y-12">
      {/* Phase 0: Scoring Weights (Hệ thống tính điểm) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: "Rating (Sao)", value: weights.rating, icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Favorite (Yêu thích)", value: weights.favorite, icon: Heart, color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Like (Thích)", value: weights.like, icon: ThumbsUp, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "View (Xem)", value: weights.view, icon: Eye, color: "text-slate-500", bg: "bg-slate-50" },
        ].map((w, i) => (
          <div key={i} className={`p-6 rounded-[32px] ${w.bg} border border-white shadow-sm flex flex-col items-center text-center gap-2`}>
            <w.icon size={24} className={w.color} />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{w.label}</span>
            <span className="text-2xl font-black text-slate-900">×{w.value}đ</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[48px] p-12 shadow-premium border border-slate-100"
      >
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <h3 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              Kiến trúc{" "}
              <span className="text-indigo-600 italic underline decoration-4 decoration-indigo-100">
                Suy luận AI
              </span>
            </h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
              Bản đồ kĩ thuật giải mã hành vi ẩm thực cộng đồng
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMath(!showMath)}
            className={`px-12 py-5 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl
                            ${showMath ? "bg-slate-900 text-white" : "bg-indigo-600 text-white shadow-indigo-600/30"}`}
          >
            {showMath ? "Ẩn bản vẽ kỹ thuật" : "Xem bản vẽ kỹ thuật"}
          </motion.button>
        </div>

        <AnimatePresence>
          {showMath && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="p-12 bg-slate-950 rounded-[40px] text-indigo-400 font-mono text-sm relative border-8 border-slate-900 shadow-inner overflow-x-auto">
                <div className="absolute top-8 right-10 text-[10px] font-black uppercase tracking-widest text-white/20 italic">
                  Logic-Core v.2.5.0
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                  <div className="space-y-8">
                    <div className="p-1 bg-indigo-500/20 w-fit rounded-lg">
                      <h4 className="px-4 py-2 text-[10px] font-black uppercase text-indigo-300">
                        Phase 01: Centered-Cosine Normalization
                      </h4>
                    </div>
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-4">
                      <code className="block text-white font-black text-xl italic">
                        R'_ui = R_ui - μ_u
                      </code>
                      <p className="text-slate-500 text-xs leading-relaxed font-bold uppercase tracking-tighter">
                        Chuẩn hóa điểm số để loại bỏ sai lệch cá nhân giữa người
                        dùng "dễ tính" và "khó tính".
                      </p>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="p-1 bg-rose-500/20 w-fit rounded-lg">
                      <h4 className="px-4 py-2 text-[10px] font-black uppercase text-rose-300">
                        Phase 02: Prediction Mapping
                      </h4>
                    </div>
                    <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-4">
                      <code className="block text-white font-black text-xl italic">
                        P_ui = μ_u + Σ(sim·R'_vi) / Σ|sim|
                      </code>
                      <p className="text-slate-500 text-xs leading-relaxed font-bold uppercase tracking-tighter">
                        Dự báo điểm số dựa trên sự đồng nhất và đóng góp có
                        trọng số từ mạng lưới hàng xóm.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-10">
          <div className="flex items-center gap-6">
            <div className="h-0.5 flex-1 bg-slate-100"></div>
            <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">
              Data Stream Analysis
            </span>
            <div className="h-0.5 flex-1 bg-slate-100"></div>
          </div>

          <div className="overflow-x-auto rounded-[32px] border border-slate-100">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-left">
                  <th className="py-8 px-10 font-black text-slate-400 uppercase text-[11px] tracking-widest">
                    Gợi ý top tinh hoa
                  </th>
                  <th className="py-8 px-10 font-black text-slate-400 uppercase text-[11px] tracking-widest">
                    Độ tin cậy
                  </th>
                  <th className="py-8 px-10 font-black text-slate-400 uppercase text-[11px] tracking-widest">
                    Mạng lưới đóng góp
                  </th>
                  <th className="py-8 px-10 font-black text-slate-400 uppercase text-[11px] tracking-widest text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {analysis.recommendations.map((rec, idx) => (
                  <motion.tr
                    key={rec.postId}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group hover:bg-indigo-50/30 transition-all cursor-default"
                  >
                    <td className="py-10 px-10">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-soft border border-slate-100 flex items-center justify-center text-indigo-600 font-black text-sm group-hover:scale-110 transition-transform">
                          {idx + 1}
                        </div>
                        <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors uppercase">
                          {rec.title}
                        </span>
                      </div>
                    </td>
                    <td className="py-10 px-10">
                      <div className="flex items-center gap-4">
                        <span className="text-base font-black text-slate-900">
                          {(rec.score * 20).toFixed(1)}%
                        </span>
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner hidden md:block">
                          <div
                            className="h-full bg-indigo-600"
                            style={{ width: `${rec.score * 20}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-10 px-10">
                      <div className="flex -space-x-4">
                        {rec.contributors.slice(0, 4).map((c, i) => (
                          <motion.div
                            key={i}
                            whileHover={{ y: -8, zIndex: 50, scale: 1.1 }}
                            className="w-12 h-12 rounded-full bg-white border-2 border-slate-50 shadow-soft flex items-center justify-center text-[12px] font-black text-slate-700 transition-all hover:border-indigo-200"
                            title={`${c.username}: đóng góp ${c.contribution.toFixed(2)}đ`}
                          >
                            {c.username.charAt(0).toUpperCase()}
                          </motion.div>
                        ))}
                      </div>
                    </td>
                    <td className="py-10 px-10 text-right">
                      <button 
                        onClick={() => setSelectedTrace(rec)}
                        className="p-4 bg-slate-900 text-white rounded-2xl hover:bg-indigo-600 transition-colors shadow-lg active:scale-95"
                      >
                        <Info size={18} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Logic Trace Modal */}
      <AnimatePresence>
        {selectedTrace && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrace(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[48px] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]"
            >
              <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Bóc tách logic suy luận</h4>
                  <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tight">{selectedTrace.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedTrace(null)}
                  className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-soft"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-10 overflow-y-auto space-y-10 custom-scrollbar">
                {/* Math Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-8 bg-slate-50 rounded-[32px] space-y-3 border border-slate-100 text-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Trung bình của bạn (μ_u)</span>
                    <span className="text-3xl font-black text-slate-900">{(analysis.userMeans[analysis.user.id] || 0).toFixed(2)}đ</span>
                  </div>
                  <div className="p-8 bg-indigo-50 rounded-[32px] space-y-3 border border-indigo-100 flex flex-col items-center justify-center relative text-center">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Tổng đóng góp hàng xóm</span>
                    <span className="text-3xl font-black text-indigo-600">+{(selectedTrace.score - (analysis.userMeans[analysis.user.id] || 0)).toFixed(2)}đ</span>
                    <Calculator size={48} className="absolute -bottom-4 -right-4 opacity-5 text-indigo-600" />
                  </div>
                  <div className="p-8 bg-slate-900 rounded-[32px] space-y-3 border border-slate-800 shadow-xl shadow-slate-900/20 text-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-indigo-300">Điểm dự báo cuối cùng</span>
                    <span className="text-3xl font-black text-white">{selectedTrace.score.toFixed(2)}đ</span>
                  </div>
                </div>

                {/* Contributors Table */}
                <div className="space-y-6">
                  <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-3">
                    <Users size={16} className="text-indigo-600" />
                    Mạng lưới tính toán (Neighbors Impact)
                  </h5>
                  <div className="overflow-hidden rounded-[32px] border border-slate-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="py-5 px-8 text-left font-black text-slate-400 uppercase text-[9px] tracking-widest">Hàng xóm</th>
                          <th className="py-5 px-8 text-left font-black text-slate-400 uppercase text-[9px] tracking-widest">Độ tương đồng</th>
                          <th className="py-5 px-8 text-left font-black text-slate-400 uppercase text-[9px] tracking-widest">Điểm chuẩn hóa</th>
                          <th className="py-5 px-8 text-right font-black text-slate-400 uppercase text-[9px] tracking-widest">Đóng góp thực tế</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-bold text-slate-700">
                        {selectedTrace.contributors.map((c, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-5 px-8 text-slate-900">{c.username}</td>
                            <td className="py-5 px-8 text-indigo-600">{(c.similarity * 100).toFixed(1)}%</td>
                            <td className="py-5 px-8">{c.adjustedRating > 0 ? "+" : ""}{c.adjustedRating.toFixed(2)}đ</td>
                            <td className="py-5 px-8 text-right font-black text-slate-900">{c.contribution > 0 ? "+" : ""}{c.contribution.toFixed(2)}đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-8 bg-emerald-50 rounded-[32px] border border-emerald-100 flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-emerald-900 uppercase text-[10px] tracking-widest">Kết luận AI</p>
                    <p className="text-emerald-700/80 text-xs font-bold leading-relaxed">
                      Món ăn này nhận được sự ủng hộ mạnh mẽ từ các "hàng xóm" có khẩu vị tương đồng nhất với bạn. 
                      Điểm đóng góp dương từ mạng lưới chứng minh đây là một lựa chọn tiềm năng dựa trên lịch sử yêu thích của cộng đồng.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogicVisualizer;
