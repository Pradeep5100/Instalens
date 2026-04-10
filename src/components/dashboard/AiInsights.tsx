import { motion } from "framer-motion";
import { Sparkles, Clock, Hash } from "lucide-react";
import type { ProfileData } from "@/lib/mockData";

const AiInsights = ({ data }: { data: ProfileData }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
    className="stat-card relative pt-10"
  >
    <div className="absolute top-3 left-4 flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-400/80">Automated Insights</span>
    </div>
    <div className="flex items-center gap-2 mb-4">
      <Sparkles className="w-5 h-5 text-primary" />
      <h3 className="text-lg font-semibold text-foreground">AI Recommendations</h3>
    </div>
    <div className="space-y-3 mb-6">
      {data.aiInsights.map((insight, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          className="p-3 rounded-lg bg-secondary/50 text-sm text-foreground/90 border border-border/30"
        >
          {insight}
        </motion.div>
      ))}
    </div>

    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-chart-4" />
        <span className="text-sm font-medium text-foreground">Best Posting Times</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.bestPostingTimes.map((t) => (
          <span key={t} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
            {t}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-3">
        <Hash className="w-4 h-4 text-chart-3" />
        <span className="text-sm font-medium text-foreground">Suggested Hashtags</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.hashtags.map((h) => (
          <span key={h} className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20">
            {h}
          </span>
        ))}
      </div>
    </div>
  </motion.div>
);

export default AiInsights;
