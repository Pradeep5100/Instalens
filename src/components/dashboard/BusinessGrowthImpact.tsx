import { motion } from "framer-motion";
import { TrendingUp, Globe, Users, ArrowRight, Zap, Target, Sparkles } from "lucide-react";
import type { ProfileData } from "@/lib/mockData";

const BusinessGrowthImpact = ({ data }: { data: ProfileData }) => {
    if (!data.businessGrowthImpact) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card relative border-emerald-500/20 bg-emerald-500/5 overflow-hidden p-0 shadow-[0_0_30px_rgba(16,185,129,0.05)]"
        >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            <div className="px-5 py-2.5 border-b border-border/30 bg-muted/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground/90">Business Growth Impact</span>
                </div>
                <div className={`px-2 py-0.5 rounded-full ${data.monetizationStatus.bg} border ${data.monetizationStatus.stroke} text-[8px] font-black flex items-center gap-1.5`}>
                    <span className="opacity-80">{data.monetizationStatus.icon}</span>
                    <span className={data.monetizationStatus.label.includes("Not") ? "text-red-400" : (data.monetizationStatus.label.includes("Emerging") ? "text-yellow-400" : "text-emerald-400")}>
                        {data.monetizationStatus.label}
                    </span>
                </div>
            </div>

            <div className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                    <ImpactItem
                        label="Growth Potential"
                        value={data.businessGrowthImpact.growthPotential}
                        icon={<TrendingUp className="w-3 h-3" />}
                        description="improvement possible"
                    />
                    <ImpactItem
                        label="Reach Impact"
                        value={data.businessGrowthImpact.reachImpact}
                        icon={<Globe className="w-3 h-3" />}
                        description="increase in profile reach"
                    />
                </div>

                <div className="space-y-1.5 pt-1 border-t border-border/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Lead Potential</span>
                    </div>
                    <p className="text-[10px] leading-relaxed text-foreground/80 font-medium">
                        {data.businessGrowthImpact.leadPotential}
                    </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/20">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Monetization Insight</span>
                        </div>
                    </div>
                    <p className="text-[10px] leading-relaxed text-emerald-400/90 font-bold px-3 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        {data.monetizationInsight}
                    </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-border/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-3 h-3 text-emerald-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Strategies for Business Value</span>
                    </div>
                    <div className="space-y-2">
                        {data.businessGrowthImpact.actionResults.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2 group">
                                <div className="mt-1 w-1 h-1 rounded-full bg-emerald-500/50 group-hover:bg-emerald-500 group-hover:scale-150 transition-all shrink-0" />
                                <p className="text-[9px] leading-tight text-muted-foreground group-hover:text-foreground transition-colors">
                                    <span className="font-bold text-foreground/80">{item.action}</span>
                                    <ArrowRight className="inline w-2 h-2 mx-1 text-emerald-500/50" />
                                    <span>{item.result}</span>
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ImpactItem = ({ label, value, icon, description }: {
    label: string;
    value: string;
    icon: React.ReactNode;
    description: string;
}) => (
    <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <span className="text-emerald-400">{icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex flex-col">
            <span className="text-xl font-black text-emerald-400 glow-emerald">{value}</span>
            <span className="text-[8px] text-muted-foreground uppercase font-medium">{description}</span>
        </div>
    </div>
);

export default BusinessGrowthImpact;
