import React from "react";
import { motion } from "framer-motion";
import { Activity, Users, ChevronRight, LineChart } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip as ReTooltip,
} from "recharts";

const SimilaritiesVisualizer = ({ analysis, radarData }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="col-span-12 lg:col-span-6 bg-white rounded-[48px] p-10 shadow-premium border border-slate-100 flex flex-col relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <LineChart size={120} />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-10 flex items-center gap-4">
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
            <Activity size={24} />
          </div>
          Ma trận sở thích (Radar Chart)
        </h3>
        <div className="w-full h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid stroke="#e2e8f0" strokeWidth={2} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fill: "#64748b",
                  fontSize: 10,
                  fontStyle: "italic",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
              <Radar
                name="Độ tương hợp"
                dataKey="A"
                stroke="#4f46e5"
                strokeWidth={4}
                fill="#4f46e5"
                fillOpacity={0.15}
              />
              <ReTooltip
                contentStyle={{
                  borderRadius: "24px",
                  border: "none",
                  padding: "16px 24px",
                  boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.15)",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  fontWeight: 900,
                  fontSize: "12px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-8 p-8 bg-slate-50 rounded-[32px] border border-slate-100 relative">
          <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest italic">
            Phân tích thuật toán: "Vùng bao phủ xanh đậm thể hiện mức độ tương
            hợp giữa khẩu vị của bạn và hệ thống."
          </p>
        </div>
      </motion.div>

      <div className="col-span-12 lg:col-span-6 space-y-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[48px] p-10 shadow-premium border border-slate-100"
        >
          <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-4">
            <Users className="text-indigo-600" />
            Người dùng tương đồng (Neighbors)
          </h3>
          <div className="space-y-4">
            {analysis.neighbors.slice(0, 5).map((n, i) => (
              <motion.div
                key={n.userId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[28px] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-soft transition-all duration-300 group cursor-default"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-soft flex items-center justify-center text-indigo-600 font-black text-xs border border-slate-100 group-hover:scale-110 transition-transform">
                    {i === 0 ? "👑" : `#${i + 1}`}
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">
                      {n.username}
                    </span>
                    <div className="flex items-center gap-3 mt-1.5">
                      <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${n.score * 100}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                        />
                      </div>
                      <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                        {(n.score * 100).toFixed(1)}% SIM
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all"
                  size={24}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-950 rounded-[48px] p-10 shadow-premium text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-indigo-600/5 opacity-50 blur-3xl pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black flex items-center gap-4">
                <Activity className="text-indigo-400" />
                Độ chính xác (MAE Core)
              </h3>
              {analysis.mae !== undefined && (
                <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-3xl backdrop-blur-md group hover:bg-white/10 transition-colors">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                    Mean Absolute Error
                  </span>
                  <span className="text-3xl font-black text-indigo-400 leading-none">
                    ± {analysis.mae.toFixed(4)}
                  </span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {analysis.currentUserInteractions.slice(0, 4).map((item) => (
                <div
                  key={item.postId}
                  className="p-6 rounded-[28px] border border-white/5 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">
                      Raw Score
                    </span>
                    <span className="font-black text-white text-xs">
                      {item.score.toFixed(1)}đ
                    </span>
                  </div>
                  <p className="font-bold text-slate-200 text-xs truncate group-hover:text-white transition-colors">
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SimilaritiesVisualizer;
