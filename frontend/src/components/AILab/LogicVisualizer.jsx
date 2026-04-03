import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const LogicVisualizer = ({ analysis }) => {
  const [showMath, setShowMath] = useState(false);

  return (
    <div className="col-span-12 space-y-12">
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
                  Logic-Core v.2.4.0
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
                  <th className="py-8 px-10 font-black text-slate-400 uppercase text-[11px] tracking-widest">
                    AI Status
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
                            title={`${c.username}: đóng góp ${(c.contribution * 100).toFixed(1)}%`}
                          >
                            {c.username.charAt(0).toUpperCase()}
                          </motion.div>
                        ))}
                      </div>
                    </td>
                    <td className="py-10 px-10">
                      <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-600 px-6 py-3 rounded-2xl border border-emerald-100 font-black text-[10px] uppercase tracking-widest shadow-sm">
                        <CheckCircle2 size={18} />
                        Verified
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LogicVisualizer;
