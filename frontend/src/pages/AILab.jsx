import React, { useState, useEffect } from 'react';
import { 
    Activity, 
    Zap, 
    BarChart3, 
    Users, 
    ChevronRight, 
    Info, 
    PlusCircle, 
    History, 
    Sparkles,
    CheckCircle2,
    Database,
    Binary,
    Cpu,
    Microscope,
    LineChart,
    Terminal
} from 'lucide-react';
import { 
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, 
    Cell, Legend
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import useStore from '../store/useStore';

const AILab = () => {
    const { user } = useStore();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('similarities'); // 'similarities', 'matrix', 'logic', 'simulator'
    const [showMath, setShowMath] = useState(false);

    const fetchAnalysis = async (userId = null) => {
        setLoading(true);
        try {
            const url = userId ? `/ai/full-analysis/${userId}` : '/ai/full-analysis';
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

    if (!analysis && !loading) return (
        <div className="p-40 text-center space-y-4">
            <Microscope size={64} className="mx-auto text-slate-200" />
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Không có dữ liệu phân tích hệ thống.</p>
        </div>
    );

    // Chuẩn bị dữ liệu cho Radar Chart
    const radarData = analysis?.similarities?.slice(0, 6).map(sim => ({
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
                    initial={{ left: '-100%' }}
                    animate={{ left: '200%' }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
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
                            Khai phá <span className="text-indigo-400">Tri thức</span> 💎 <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Ẩm thực Số</span>
                        </h1>
                        <p className="text-slate-400 font-medium max-w-xl text-lg leading-relaxed">
                            Phòng thí nghiệm sử dụng thuật toán Collaborative Filtering để ánh xạ khẩu vị cá nhân vào ma trận cộng đồng.
                        </p>
                    </div>
                    
                    <div className="glass-premium p-3 rounded-[32px] border-white/10 backdrop-blur-2xl flex flex-wrap gap-2">
                        {[
                            { id: 'similarities', label: 'Tương đồng', icon: Users },
                            { id: 'logic', label: 'Toán học', icon: Binary },
                            { id: 'simulator', label: 'Giả lập', icon: Cpu }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest transition-all duration-500 flex items-center gap-3
                                    ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
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
                        <p className="font-black text-slate-900 uppercase tracking-widest text-sm">Vui lòng đợi...</p>
                        <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">AI đang giải mã ma trận dữ liệu</p>
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
                        {activeTab === 'similarities' && (
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
                                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontStyle: 'italic', fontWeight: 900, textTransform: 'uppercase' }} />
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
                                                        borderRadius: '24px', 
                                                        border: 'none', 
                                                        padding: '16px 24px',
                                                        boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
                                                        background: 'rgba(255, 255, 255, 0.95)',
                                                        backdropFilter: 'blur(10px)',
                                                        fontWeight: 900,
                                                        fontSize: '12px'
                                                    }} 
                                                />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="mt-8 p-8 bg-slate-50 rounded-[32px] border border-slate-100 relative">
                                        <p className="text-[11px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest italic">
                                            Phân tích thuật toán: "Vùng bao phủ xanh đậm thể hiện mức độ tương hợp giữa khẩu vị của bạn và hệ thống."
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
                                                            {i === 0 ? '👑' : `#${i+1}`}
                                                        </div>
                                                        <div>
                                                            <span className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">{n.username}</span>
                                                            <div className="flex items-center gap-3 mt-1.5">
                                                                <div className="w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden shadow-inner">
                                                                    <motion.div 
                                                                        initial={{ width: 0 }}
                                                                        whileInView={{ width: `${n.score * 100}%` }}
                                                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                                                        className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                                                                    />
                                                                </div>
                                                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">{(n.score * 100).toFixed(1)}% SIM</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <ChevronRight className="text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-2 transition-all" size={24} />
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
                                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Mean Absolute Error</span>
                                                        <span className="text-3xl font-black text-indigo-400 leading-none">± {analysis.mae.toFixed(4)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                {analysis.currentUserInteractions.slice(0, 4).map((item, idx) => (
                                                    <div 
                                                        key={item.postId}
                                                        className="p-6 rounded-[28px] border border-white/5 bg-white/5 backdrop-blur-sm group hover:bg-white/10 transition-all"
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Raw Score</span>
                                                            <span className="font-black text-white text-xs">{item.score.toFixed(1)}đ</span>
                                                        </div>
                                                        <p className="font-bold text-slate-200 text-xs truncate group-hover:text-white transition-colors">{item.title}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </>
                        )}

                        {/* Tab 2: Logic & Blueprints */}
                        {activeTab === 'logic' && (
                            <div className="col-span-12 space-y-12">
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[48px] p-12 shadow-premium border border-slate-100"
                                >
                                    <div className="flex items-center justify-between mb-12">
                                        <div className="space-y-2">
                                            <h3 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-4">
                                                Kiến trúc <span className="text-indigo-600 italic underline decoration-4 decoration-indigo-100">Suy luận AI</span>
                                            </h3>
                                            <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">Bản đồ kĩ thuật giải mã hành vi ẩm thực cộng đồng</p>
                                        </div>
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setShowMath(!showMath)}
                                            className={`px-12 py-5 rounded-[28px] font-black text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl
                                                ${showMath ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white shadow-indigo-600/30'}`}
                                        >
                                            {showMath ? 'Ẩn bản vẽ kỹ thuật' : 'Xem bản vẽ kỹ thuật'}
                                        </motion.button>
                                    </div>

                                    <AnimatePresence>
                                        {showMath && (
                                            <motion.div 
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden mb-12"
                                            >
                                                <div className="p-12 bg-slate-950 rounded-[40px] text-indigo-400 font-mono text-sm relative border-8 border-slate-900 shadow-inner overflow-x-auto">
                                                    <div className="absolute top-8 right-10 text-[10px] font-black uppercase tracking-widest text-white/20 italic">Logic-Core v.2.4.0</div>
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                                        <div className="space-y-8">
                                                            <div className="p-1 bg-indigo-500/20 w-fit rounded-lg">
                                                                <h4 className="px-4 py-2 text-[10px] font-black uppercase text-indigo-300">Phase 01: Centered-Cosine Normalization</h4>
                                                            </div>
                                                            <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-4">
                                                                <code className="block text-white font-black text-xl italic">R'_ui = R_ui - μ_u</code>
                                                                <p className="text-slate-500 text-xs leading-relaxed font-bold uppercase tracking-tighter">
                                                                    Chuẩn hóa điểm số để loại bỏ sai lệch cá nhân giữa người dùng "dễ tính" và "khó tính".
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-8">
                                                            <div className="p-1 bg-rose-500/20 w-fit rounded-lg">
                                                                <h4 className="px-4 py-2 text-[10px] font-black uppercase text-rose-300">Phase 02: Prediction Mapping</h4>
                                                            </div>
                                                            <div className="bg-black/20 p-8 rounded-3xl border border-white/5 space-y-4">
                                                                <code className="block text-white font-black text-xl italic">P_ui = μ_u + Σ(sim·R'_vi) / Σ|sim|</code>
                                                                <p className="text-slate-500 text-xs leading-relaxed font-bold uppercase tracking-tighter">
                                                                    Dự báo điểm số dựa trên sự đồng nhất và đóng góp có trọng số từ mạng lưới hàng xóm.
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
                                            <span className="font-black text-slate-300 uppercase tracking-widest text-[10px]">Data Stream Analysis</span>
                                            <div className="h-0.5 flex-1 bg-slate-100"></div>
                                        </div>
                                        
                                        <div className="overflow-x-auto rounded-[32px] border border-slate-100">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="bg-slate-50 border-b border-slate-100 text-left">
                                                        <th className="py-8 px-10 font-black text-slate-400 uppercase text-[11px] tracking-widest">Gợi ý top tinh hoa</th>
                                                        <th className="py-8 px-10 font-black text-slate-400 uppercase text-[11px] tracking-widest">Độ tin cậy</th>
                                                        <th className="py-8 px-10 font-black text-slate-400 uppercase text-[11px] tracking-widest">Mạng lưới đóng góp</th>
                                                        <th className="py-8 px-10 font-black text-slate-400 uppercase text-[11px] tracking-widest">AI Status</th>
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
                                                                    <span className="font-extrabold text-slate-900 text-lg tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{rec.title}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-10 px-10">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="text-base font-black text-slate-900">{(rec.score * 20).toFixed(1)}%</span>
                                                                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner hidden md:block">
                                                                        <div className="h-full bg-indigo-600" style={{ width: `${rec.score * 20}%` }}></div>
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
                        )}

                        {/* Tab 3: Simulator (Playground) */}
                        {activeTab === 'simulator' && (
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
                                                    Giả lập <br/>
                                                    <span className="text-indigo-400 italic">"What-If"</span> 🧬
                                                </h3>
                                                <p className="text-slate-400 font-medium text-2xl leading-relaxed">
                                                    Thay đổi tham số tương tác để quan sát sự dịch chuyển của ma trận sở thích trong tương lai.
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-8">
                                                <h4 className="text-[11px] font-black text-white/40 uppercase tracking-[0.5em] italic">Data Injection Portal</h4>
                                                <div className="flex flex-wrap gap-5">
                                                    {[
                                                        'Bún Đậu Mắm Tôm', 'Phở bò', 'Pizza', 'Cơm Tấm', 'Bánh Mì'
                                                    ].map((dish, idx) => (
                                                        <motion.button 
                                                            key={dish}
                                                            whileHover={{ scale: 1.1, backgroundColor: '#4f46e5', color: 'white' }}
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
                                                    boxShadow: ["0 0 30px rgba(79,70,229,0.2)", "0 0 80px rgba(79,70,229,0.4)", "0 0 30px rgba(79,70,229,0.2)"] 
                                                }}
                                                transition={{ duration: 5, repeat: Infinity }}
                                                className="w-full max-w-lg aspect-square bg-black/40 rounded-[80px] border border-white/10 p-16 flex flex-col items-center justify-center text-center gap-12 backdrop-blur-3xl relative"
                                            >
                                                <div className="absolute -top-10 -right-10 w-24 h-24 bg-rose-500/20 blur-2xl rounded-full"></div>
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 animate-pulse"></div>
                                                    <Database size={100} className="text-indigo-400 relative z-10" />
                                                </div>
                                                <div className="space-y-4">
                                                    <p className="text-white font-black text-2xl tracking-tight uppercase">Simulation Online</p>
                                                    <p className="text-slate-500 font-bold text-sm uppercase tracking-widest leading-relaxed">
                                                        DeepMind Neural Engine <br/> 
                                                        đang tính toán lại ma trận.
                                                    </p>
                                                </div>
                                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                                                    <motion.div 
                                                        animate={{ left: ['-100%', '100%'] }}
                                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                                        className="absolute h-full w-2/3 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(79,70,229,0.8)]"
                                                    />
                                                </div>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </div>
    );
};

export default AILab;
