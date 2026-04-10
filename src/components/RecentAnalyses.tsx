import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, History, TrendingUp, User } from "lucide-react";

interface RecentAnalysis {
    username: string;
    profilePic: string;
    engagementRate: number;
    followers: number;
    timestamp: number;
}

interface RecentAnalysesProps {
    onSelect: (username: string) => void;
}

const RecentAnalyses = ({ onSelect }: RecentAnalysesProps) => {
    const [analyses, setAnalyses] = useState<RecentAnalysis[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem("recentAnalyses");
        if (saved) {
            try {
                setAnalyses(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse recent analyses", e);
            }
        }
    }, []);

    const clearHistory = () => {
        localStorage.removeItem("recentAnalyses");
        setAnalyses([]);
    };

    if (analyses.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto mb-10"
        >
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <History className="w-3 h-3 text-primary" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black">Recent Analyses</span>
                </div>
                <button
                    onClick={clearHistory}
                    className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground/50 hover:text-red-400 transition-colors uppercase tracking-wider group"
                >
                    <Trash2 className="w-3 h-3 group-hover:animate-bounce" />
                    Clear History
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                    {analyses.map((item, idx) => (
                        <motion.button
                            key={item.username}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => onSelect(item.username)}
                            className="flex-shrink-0 w-48 group text-left"
                        >
                            <div className="stat-card relative p-3 bg-secondary/30 border-border/40 hover:border-primary/50 transition-all duration-300 hover:glow-primary overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex items-center gap-3 mb-2">
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full overflow-hidden border border-border/50 group-hover:border-primary/50 transition-colors">
                                            {item.profilePic ? (
                                                <img src={item.profilePic} alt={item.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                                    <User className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[11px] font-black text-foreground truncate">@{item.username}</div>
                                        <div className="text-[8px] text-muted-foreground font-medium">
                                            {new Date(item.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-1 pt-2 border-t border-border/20">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] uppercase tracking-tighter text-muted-foreground font-black">Followers</span>
                                        <span className="text-[10px] font-bold text-foreground">{(item.followers / 1000).toFixed(1)}K</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] uppercase tracking-tighter text-muted-foreground font-black">Engagement</span>
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                                            <TrendingUp className="w-2.5 h-2.5" />
                                            {item.engagementRate}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.button>
                    ))}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default RecentAnalyses;
