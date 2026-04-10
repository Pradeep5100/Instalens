import { motion } from "framer-motion";
import { Heart, MessageCircle, TrendingUp, Users } from "lucide-react";
import type { ProfileData } from "@/lib/mockData";

const StatCards = ({ data }: { data: ProfileData }) => {
  const stats = [
    { icon: TrendingUp, label: "Engagement Rate", value: `${data.engagementRate}%`, color: "text-primary" },
    { icon: Heart, label: "Avg. Likes", value: data.avgLikes.toLocaleString(), color: "text-accent" },
    { icon: MessageCircle, label: "Avg. Comments", value: data.avgComments.toLocaleString(), color: "text-chart-3" },
    { icon: Users, label: "Follower Ratio", value: `${(data.followers / data.following).toFixed(1)}x`, color: "text-chart-4" },
  ];

  return (
    <div className="relative pt-8">
      <div className="absolute top-0 left-2 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-blue-400/80">Data Processing</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="stat-card"
          >
            <s.icon className={`w-6 h-6 ${s.color} mb-3`} />
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StatCards;
