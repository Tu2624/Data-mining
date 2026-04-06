import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, RefreshCcw, Save, ArrowRight, TrendingUp, TrendingDown, 
  Minus, X, Users, Calculator, Info, Zap 
} from "lucide-react";
import client from "../../api/client";

const SimulatorVisualizer = ({ analysis }) => {
  const [weights, setWeights] = useState({
    rating: analysis?.weights?.rating || 1,
    favorite: analysis?.weights?.favorite || 3,
    like: analysis?.weights?.like || 2,
    view: analysis?.weights?.view || 1,
  });
  const [simulating, setSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const [selectedTrace, setSelectedTrace] = useState(null);

  const initialRecs = analysis?.recommendations || [];

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const res = await client.post("/ai/simulate", { weights });
      setSimResult(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setSimulating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await client.post("/ai/update-config", { weights });
      alert("Đã áp dụng cấu hình mới lên toàn hệ thống!");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật cấu hình.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (analysis) handleSimulate();
  }, [analysis]);

  const getRankChange = (postId, newRank) => {
    const oldRank = initialRecs.findIndex(r => r.postId == postId);
    if (oldRank === -1) return "new";
    if (oldRank > newRank) return "up";
    if (oldRank < newRank) return "down";
    return "same";
  };

  const openComparisonTrace = (rec) => {
    const originalRec = initialRecs.find(r => r.postId === rec.postId);
    setSelectedTrace({ 
      simulated: rec, 
      original: originalRec 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-12 space-y-12"
    >
      <div className="bg-slate-900 rounded-[64px] p-16 shadow-premium overflow-hidden relative border border-white/5 group">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
          <Cpu size={350} className="text-white" />
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <h3 className="text-5xl font-black text-white tracking-tighter leading-none">
                Giả lập <span className="text-indigo-400 italic">"What-If"</span> 🧬
              </h3>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Global Weights Simulation</p>
            </div>

            <div className="space-y-8 bg-white/5 p-10 rounded-[40px] border border-white/5 backdrop-blur-xl">
              {[
                { key: "rating", label: "Rating Weight", color: "bg-amber-500" },
                { key: "favorite", label: "Favorite Weight", color: "bg-rose-500" },
                { key: "like", label: "Like Weight", color: "bg-blue-500" },
                { key: "view", label: "View Weight", color: "bg-slate-500" },
              ].map((w) => (
                <div key={w.key} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{w.label}</span>
                    <span className="font-black text-white italic">{weights[w.key]}đ</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={weights[w.key]}
                    onChange={(e) => setWeights({ ...weights, [w.key]: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              ))}

              <div className="pt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={handleSimulate}
                  disabled={simulating}
                  className="flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
                >
                  <RefreshCcw size={16} className={simulating ? "animate-spin" : ""} />
                  {simulating ? "Calculating..." : "Run Sim"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center justify-center gap-3 py-5 bg-white/10 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? "Saving..." : "Apply DB"}
                </button>
              </div>
            </div>
          </div>

          {/* Comparison List */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* Before List */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-4">Hiện tại (Trong DB)</h4>
                <div className="space-y-3">
                  {initialRecs.slice(0, 10).map((r, i) => (
                    <div key={r.postId} className="p-5 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-between opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-black text-white/40">{i+1}</span>
                        <span className="text-white font-bold text-sm truncate max-w-[150px]">{r.title}</span>
                      </div>
                      <span className="text-[10px] font-black text-indigo-400 italic">{r.score.toFixed(1)}đ</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* After List */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] pl-4">Sau giả lập (Dự kiến)</h4>
                <div className="space-y-3 relative">
                  <AnimatePresence mode="popLayout">
                  {(simResult?.recommendations || initialRecs).slice(0, 10).map((r, i) => {
                    const change = getRankChange(r.postId, i);
                    return (
                      <motion.div 
                        layout
                        key={r.postId} 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => openComparisonTrace(r)}
                        className="p-5 bg-indigo-600/10 border border-indigo-500/20 rounded-3xl flex items-center justify-between cursor-pointer hover:bg-indigo-600/30 transition-all shadow-lg active:scale-95 group"
                      >
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center text-[10px] font-black text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">{i+1}</span>
                          <span className="text-white font-bold text-sm truncate max-w-[150px]">{r.title}</span>
                          <Info size={14} className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-[10px] font-black text-white italic">{r.score.toFixed(1)}đ</span>
                          <div className="w-6 h-6 flex items-center justify-center">
                            {change === "up" && <TrendingUp size={14} className="text-emerald-400" />}
                            {change === "down" && <TrendingDown size={14} className="text-rose-400" />}
                            {change === "same" && <Minus size={14} className="text-slate-500" />}
                            {change === "new" && <ArrowRight size={14} className="text-indigo-400" />}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Trace Modal */}
      <AnimatePresence>
        {selectedTrace && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTrace(null)}
              className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="relative w-full max-w-6xl bg-white rounded-[64px] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-12 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em]">So sánh song song logic suy luận</h4>
                  <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-4">
                    {selectedTrace.simulated.title}
                    <Zap size={24} className="text-indigo-500 fill-indigo-500" />
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedTrace(null)}
                  className="w-16 h-16 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all shadow-soft"
                >
                  <X size={32} />
                </button>
              </div>

              <div className="p-12 overflow-y-auto space-y-12 custom-scrollbar">
                {/* Visual Score Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   {/* Old Score Card */}
                   <div className="p-10 bg-slate-50 rounded-[48px] border border-slate-100 space-y-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-5 text-slate-900 group-hover:scale-110 transition-transform">
                        <Users size={120} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Điểm hiện tại (Cũ)</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-slate-900">{selectedTrace.original?.score.toFixed(2) || "0.00"}</span>
                        <span className="text-xl font-bold text-slate-400">đ</span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 italic">Dựa trên trọng số mặc định của hệ thống.</p>
                   </div>

                   {/* New Score Card */}
                   <div className="p-10 bg-indigo-600 rounded-[48px] text-white shadow-2xl shadow-indigo-600/30 space-y-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 text-white group-hover:scale-110 transition-transform">
                        <Zap size={120} />
                      </div>
                      <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest block">Điểm dự kiến (Mới)</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black text-white">{selectedTrace.simulated.score.toFixed(2)}</span>
                        <span className="text-xl font-bold text-indigo-300">đ</span>
                        <div className="ml-4 px-4 py-1.5 bg-white/20 rounded-full text-xs font-black flex items-center gap-2">
                           <TrendingUp size={14} />
                           +{(selectedTrace.simulated.score - (selectedTrace.original?.score || 0)).toFixed(2)}
                        </div>
                      </div>
                      <p className="text-xs font-bold text-indigo-100 italic">Sau khi áp dụng bộ trọng số giả lập "What-If".</p>
                   </div>
                </div>

                {/* Parallel Neighbors Comparison */}
                <div className="space-y-8">
                  <h5 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-3">
                    <Calculator size={16} className="text-indigo-600" />
                    Biến động mạng lưới hàng xóm (Neighbors Shift)
                  </h5>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Original Contributors */}
                    <div className="space-y-4">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block pl-4">Cơ cấu điểm cũ</span>
                      <div className="overflow-hidden rounded-[32px] border border-slate-100">
                        <table className="w-full text-xs">
                          <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                              <th className="py-4 px-6 text-left font-black text-slate-400 uppercase text-[8px]">Hàng xóm</th>
                              <th className="py-4 px-6 text-right font-black text-slate-400 uppercase text-[8px]">Đóng góp</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-50 font-bold text-slate-600 opacity-60">
                            {selectedTrace.original?.contributors.map((c, i) => (
                              <tr key={i}>
                                <td className="py-4 px-6">{c.username}</td>
                                <td className="py-4 px-6 text-right">{c.contribution > 0 ? "+" : ""}{c.contribution.toFixed(2)}đ</td>
                              </tr>
                            )) || <tr><td colSpan="2" className="py-10 text-center text-slate-300">Không có dữ liệu</td></tr>}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Simulated Contributors */}
                    <div className="space-y-4">
                      <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] block pl-4">Cơ cấu điểm mới</span>
                      <div className="overflow-hidden rounded-[32px] border border-indigo-100 shadow-lg shadow-indigo-600/5">
                        <table className="w-full text-xs">
                          <thead className="bg-indigo-50 border-b border-indigo-100">
                            <tr>
                              <th className="py-4 px-6 text-left font-black text-indigo-600 uppercase text-[8px]">Hàng xóm</th>
                              <th className="py-4 px-6 text-right font-black text-indigo-600 uppercase text-[8px]">Đóng góp</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-indigo-50 font-black text-slate-900 bg-indigo-50/20">
                            {selectedTrace.simulated.contributors.map((c, i) => {
                              const oldC = selectedTrace.original?.contributors.find(oc => oc.username === c.username);
                              const diff = c.contribution - (oldC?.contribution || 0);
                              return (
                                <tr key={i}>
                                  <td className="py-4 px-6">{c.username}</td>
                                  <td className="py-4 px-6 text-right flex items-center justify-end gap-2 text-indigo-600">
                                    {c.contribution > 0 ? "+" : ""}{c.contribution.toFixed(2)}đ
                                    <span className={`text-[8px] font-black ${diff >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                      ({diff >= 0 ? '↑' : '↓'}{Math.abs(diff).toFixed(2)})
                                    </span>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conclusion */}
                <div className="p-8 bg-indigo-50 rounded-[40px] border border-indigo-100 flex items-start gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xl shadow-indigo-600/30">
                    <Info size={28} />
                  </div>
                  <div className="space-y-2">
                    <p className="font-black text-indigo-900 uppercase text-xs tracking-widest">Phân tích sự dịch chuyển</p>
                    <p className="text-indigo-700/80 text-sm font-bold leading-relaxed">
                      Khi thay đổi trọng số, hệ thống đã điều chỉnh sự ưu tiên dành cho các tương tác cụ thể. 
                      Các hàng xóm có xu hướng hành vi phù hợp với bộ trọng số mới (ví dụ: nhiều Like hoặc Favorite hơn) 
                      sẽ có tầm ảnh hưởng lớn hơn đến kết quả dự báo của bạn. Điểm số tăng mạnh cho thấy sự đồng thuận cao 
                      hơn giữa bạn và mạng lưới tinh túy mới được lọc ra.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SimulatorVisualizer;
