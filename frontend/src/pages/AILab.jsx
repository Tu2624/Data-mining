import React, { useState, useEffect } from "react";
import { Users, Binary, Cpu, Microscope, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import client from "../api/client";
import useStore from "../store/useStore";

// Components
import SimilaritiesVisualizer from "../components/AILab/SimilaritiesVisualizer";
import LogicVisualizer from "../components/AILab/LogicVisualizer";
import SimulatorVisualizer from "../components/AILab/SimulatorVisualizer";

const AILab = () => {
  const { user } = useStore();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("similarities"); // 'similarities', 'matrix', 'logic', 'simulator'
  const [showMath, setShowMath] = useState(false);

  const fetchAnalysis = async (userId = null) => {
    setLoading(true);
    try {
      const url = userId ? `/ai/full-analysis/${userId}` : "/ai/full-analysis";
      const res = await client.get(url);
      setAnalysis(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAnalysis();
  }, [user]);

  if (!analysis && !loading)
    return (
      <div className="p-40 text-center space-y-4">
        <Microscope size={64} className="mx-auto text-slate-200" />
        <p className="font-black text-slate-400 uppercase tracking-widest text-xs">
          Không có dữ liệu phân tích hệ thống.
        </p>
      </div>
    );

  // Chuẩn bị dữ liệu cho Radar Chart
  const radarData =
    analysis?.similarities?.slice(0, 6).map((sim) => ({
      subject: sim.username,
      A: sim.score * 100,
      fullMark: 100,
    })) || [];

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-32">
      {/* Header Lab - Modern Culinary AI Overhaul */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-950 rounded-[48px] p-12 text-white shadow-premium relative overflow-hidden border border-white/5"
      >
        {/* Scanning Effect Overlay */}
        <motion.div
          initial={{ left: "-100%" }}
          animate={{ left: "200%" }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent skew-x-[-20deg] pointer-events-none"
        />

        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.15),transparent_50%)] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 bg-white/5 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-white/10 backdrop-blur-md">
              <Terminal size={14} className="text-indigo-400 animate-pulse" />
              AI Lab Simulation Core v2.5
            </div>
            <h1 className="text-6xl font-black tracking-tight leading-none">
              Khai phá <span className="text-indigo-400">Tri thức</span> 💎{" "}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                Ẩm thực Số
              </span>
            </h1>
            <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">
              Phòng thí nghiệm sử dụng thuật toán Collaborative Filtering để ánh
              xạ khẩu vị cá nhân vào ma trận cộng đồng.
            </p>
          </div>

          <div className="glass-premium p-3 rounded-[32px] border-white/10 backdrop-blur-2xl flex flex-wrap gap-2">
            {[
              { id: "similarities", label: "Tương đồng", icon: Users },
              { id: "logic", label: "Toán học", icon: Binary },
              { id: "simulator", label: "Giả lập", icon: Cpu },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all duration-500 flex items-center gap-3
                                    ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 border-[6px] border-indigo-600 border-t-transparent rounded-full shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]"
          />
          <div className="space-y-2 text-center">
            <p className="font-black text-slate-900 uppercase tracking-widest text-sm">
              Vui lòng đợi...
            </p>
            <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">
              AI đang giải mã ma trận dữ liệu
            </p>
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.02, y: -10 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-12 gap-10"
          >
            {/* Tab 1: Similarities Visualizer */}
            {activeTab === "similarities" && (
              <SimilaritiesVisualizer
                analysis={analysis}
                radarData={radarData}
              />
            )}

            {/* Tab 2: Logic & Blueprints */}
            {activeTab === "logic" && <LogicVisualizer analysis={analysis} />}

            {/* Tab 3: Simulator (Playground) */}
            {activeTab === "simulator" && <SimulatorVisualizer analysis={analysis} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AILab;
