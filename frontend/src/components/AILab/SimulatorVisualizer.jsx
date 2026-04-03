import React from "react";
import { motion } from "framer-motion";
import { Cpu, Database } from "lucide-react";

const SimulatorVisualizer = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-12"
    >
      <div className="bg-slate-950 rounded-[64px] p-16 shadow-premium overflow-hidden relative border border-white/10 group">
        <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity duration-1000">
          <Cpu size={350} className="text-white" />
        </div>
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-indigo-600/10 blur-[180px] rounded-full pointer-events-none animate-pulse"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24">
          <div className="space-y-16">
            <div className="space-y-6">
              <h3 className="text-6xl font-black text-white tracking-tighter leading-none">
                Giả lập <br />
                <span className="text-indigo-400 italic">"What-If"</span> 🧬
              </h3>
              <p className="text-slate-400 font-medium text-2xl leading-relaxed">
                Thay đổi tham số tương tác để quan sát sự dịch chuyển của ma
                trận sở thích trong tương lai.
              </p>
            </div>

            <div className="space-y-8">
              <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em] italic">
                Data Injection Portal
              </h4>
              <div className="flex flex-wrap gap-5">
                {[
                  "Bún Đậu Mắm Tôm",
                  "Phở bò",
                  "Pizza",
                  "Cơm Tấm",
                  "Bánh Mì",
                ].map((dish, idx) => (
                  <motion.button
                    key={dish}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#4f46e5",
                      color: "white",
                    }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="px-10 py-5 bg-white/5 border border-white/10 rounded-[28px] font-black text-[12px] uppercase tracking-widest text-indigo-400 backdrop-blur-xl transition-all shadow-lg"
                  >
                    + Thích {dish}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 30px rgba(79,70,229,0.2)",
                  "0 0 80px rgba(79,70,229,0.4)",
                  "0 0 30px rgba(79,70,229,0.2)",
                ],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="w-full max-w-lg aspect-square bg-black/40 rounded-[80px] border border-white/10 p-16 flex flex-col items-center justify-center text-center gap-12 backdrop-blur-3xl relative"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/20 blur-2xl rounded-full"></div>
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 animate-pulse"></div>
                <Database
                  size={100}
                  className="text-indigo-400 relative z-10"
                />
              </div>
              <div className="space-y-4">
                <p className="text-white font-black text-2xl tracking-tight uppercase">
                  Simulation Online
                </p>
                <p className="text-slate-500 font-bold text-sm uppercase tracking-widest leading-relaxed">
                  DeepMind Neural Engine <br />
                  đang tính toán lại ma trận.
                </p>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  animate={{ left: ["-100%", "100%"] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-full w-2/3 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(79,70,229,0.8)]"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SimulatorVisualizer;
