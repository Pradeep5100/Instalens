import { motion } from "framer-motion";
import { Tags, ShieldCheck, Zap, Sparkles, Target, Settings } from "lucide-react";
import type { ProfileData } from "@/lib/mockData";

const BusinessIntelligenceTags = ({ data }: { data: ProfileData }) => {
    if (!data.biTags) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="stat-card relative border-primary/20 bg-primary/5 overflow-hidden p-0"
        >
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <div className="px-5 py-2.5 border-b border-border/30 bg-muted/20 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Tags className="w-3 h-3 text-primary" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-foreground/90">Business Intelligence Tags</span>
                </div>
                <ShieldCheck className="w-3 h-3 text-primary/40" />
            </div>

            <div className="p-5 space-y-4">
                <TagRow
                    label="Business Type"
                    icon={<Target className="w-2.5 h-2.5" />}
                    tags={[{ tag: data.businessType, confidence: 98 }]}
                    colorClass="text-primary"
                    bgColor="bg-primary/10"
                    borderColor="border-primary/20"
                />

                <TagRow
                    label="Category"
                    icon={<Zap className="w-2.5 h-2.5" />}
                    tags={data.biTags.category}
                    colorClass="text-purple-400"
                    bgColor="bg-purple-400/10"
                    borderColor="border-purple-400/20"
                />

                <TagRow
                    label="Services"
                    icon={<Settings className="w-2.5 h-2.5" />}
                    tags={data.biTags.services}
                    colorClass="text-blue-400"
                    bgColor="bg-blue-400/10"
                    borderColor="border-blue-400/20"
                />

                <TagRow
                    label="Themes"
                    icon={<Sparkles className="w-2.5 h-2.5" />}
                    tags={data.biTags.themes}
                    colorClass="text-green-400"
                    bgColor="bg-green-400/10"
                    borderColor="border-green-400/20"
                />

                <TagRow
                    label="Audience"
                    icon={<Target className="w-2.5 h-2.5" />}
                    tags={data.biTags.audience}
                    colorClass="text-yellow-400"
                    bgColor="bg-yellow-400/10"
                    borderColor="border-yellow-400/20"
                />

                <div className="pt-3 mt-1 border-t border-border/20 space-y-2">
                    <p className="text-[10px] leading-relaxed text-muted-foreground italic px-2 border-l-2 border-primary/30 font-medium">
                        "{data.tagSummary}"
                    </p>
                    <p className="text-[10px] leading-relaxed text-foreground/70 px-2 font-bold flex items-center gap-1.5">
                        <Sparkles className="w-2.5 h-2.5 text-primary" />
                        This profile is suitable for brand collaborations, influencer marketing, and audience engagement campaigns.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const TagRow = ({ label, icon, tags, colorClass, bgColor, borderColor }: {
    label: string;
    icon: React.ReactNode;
    tags: { tag: string; confidence: number }[];
    colorClass: string;
    bgColor: string;
    borderColor: string
}) => (
    <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-muted-foreground/60">
            <span className={colorClass}>{icon}</span>
            <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
                <div
                    key={t.tag}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${bgColor} border ${borderColor} text-[10px] font-bold ${colorClass} transition-all duration-300 hover:glow-primary cursor-default group`}
                >
                    {t.tag}
                    <span className="opacity-40 text-[8px] font-medium group-hover:opacity-100 transition-opacity">
                        {t.confidence}%
                    </span>
                </div>
            ))}
        </div>
    </div>
);

export default BusinessIntelligenceTags;
