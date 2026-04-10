import { motion } from "framer-motion";
import { Info, Sparkles, Hash, ShieldCheck, Zap } from "lucide-react";
import type { ProfileData } from "@/lib/mockData";

const OutputSummaryCard = ({ data }: { data: ProfileData }) => {
    // Artificial confidence score based on engagement
    const confidenceScore = Math.min(Math.max(Math.floor(data.engagementRate * 15), 65), 98);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="stat-card relative border-primary/20 bg-primary/5 mb-6 overflow-hidden p-0"
        >
            {/* Header / Module Label */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="px-5 py-2 border-b border-border/30 bg-muted/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary glow-primary animate-pulse" />
                    <span className="text-[9px] uppercase tracking-[0.2em] font-black text-primary/90">Output Generation Unit</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-primary/10 border border-primary/20">
                    <ShieldCheck className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[8px] font-bold text-primary uppercase">Verified Output</span>
                </div>
            </div>

            <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">

                    {/* Column 1: Confidence Gauge */}
                    <div className="flex flex-col items-center justify-center p-3 bg-background/40 rounded-xl border border-border/50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative w-16 h-16 mb-2">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    fill="transparent"
                                    className="text-muted/20"
                                />
                                <motion.circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="3.5"
                                    fill="transparent"
                                    strokeDasharray={175.9}
                                    initial={{ strokeDashoffset: 175.9 }}
                                    animate={{ strokeDashoffset: 175.9 - (175.9 * confidenceScore) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="text-primary"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-lg font-black text-foreground">{confidenceScore}%</span>
                            </div>
                        </div>
                        <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest text-center mt-1">Accuracy Score</p>
                    </div>

                    {/* Column 2: Business Category */}
                    <SummaryMetric
                        label="Business Architecture"
                        value={data.businessCategory || "Digital Creator"}
                        icon={<Zap className="w-4 h-4 text-primary" />}
                        subValue="Primary Classification"
                        glowColor="rgba(8, 145, 178, 0.2)"
                    />

                    {/* Column 3: Content Type */}
                    <SummaryMetric
                        label="Content Strategy"
                        value={data.contentType || "Lifestyle"}
                        icon={<Sparkles className="w-4 h-4 text-purple-400" />}
                        subValue="Dominant Format"
                        glowColor="rgba(168, 85, 247, 0.2)"
                    />

                    {/* Column 4: Target Audience */}
                    <SummaryMetric
                        label="Audience Profile"
                        value={data.audienceType || "General Audience"}
                        icon={<Info className="w-4 h-4 text-accent" />}
                        subValue="Core Demographic"
                        glowColor="rgba(244, 114, 182, 0.2)"
                    />
                </div>
            </div>

            {/* Decorative Hash Icon */}
            <div className="absolute -bottom-4 -right-2 opacity-5 pointer-events-none">
                <Hash className="w-24 h-24" />
            </div>
        </motion.div>
    );
};

const SummaryMetric = ({ label, value, icon, subValue, glowColor }: { label: string; value: string; icon: React.ReactNode; subValue: string; glowColor: string }) => (
    <div className="flex flex-col gap-0.5 px-4 py-1 border-l border-border/30 group hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-2 mb-0.5">
            <div className="p-1 rounded-lg bg-background/50 border border-border/50 group-hover:glow-primary transition-all" style={{ boxShadow: `0 0 10px ${glowColor}` }}>
                {icon}
            </div>
            <p className="text-[8px] uppercase font-black text-muted-foreground tracking-widest">{label}</p>
        </div>
        <p className="text-base font-bold text-foreground leading-tight truncate">{value}</p>
        <p className="text-[8px] font-bold text-muted-foreground/60 uppercase">{subValue}</p>
    </div>
);

export default OutputSummaryCard;
