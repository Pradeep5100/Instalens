import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  Line,
  ComposedChart
} from "recharts";
import type { ProfileData } from "@/lib/mockData";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const engagement = payload.find((p: any) => p.dataKey === 'engagement')?.value;

    return (
      <div className="glass p-3 rounded-lg border border-primary/20 shadow-xl space-y-1">
        <p className="text-foreground font-bold border-b border-border/50 pb-1 mb-2">{label}</p>
        {engagement !== undefined && (
          <p className="text-primary text-sm tracking-wide">
            Engagement Rate: <span className="font-bold">{engagement}%</span>
          </p>
        )}
      </div>
    );
  }
  return null;
};

const EngagementChart = ({ data }: { data: ProfileData }) => {
  const totalGrowth = data.weeklyGrowth.reduce((sum, day) => sum + day.followerGrowth, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="stat-card relative flex flex-col h-full pt-10"
    >
      <div className="absolute top-3 left-4 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-primary/80">AI Analysis</span>
      </div>
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 to-accent/10 blur-xl opacity-50 -z-10 rounded-2xl" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            📊 Weekly Trend
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-bold">
              {totalGrowth > 0 ? `+${totalGrowth}` : totalGrowth} this week
            </span>
          </h3>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.weeklyGrowth} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEngagement" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(262 60% 60%)" />
                <stop offset="100%" stopColor="hsl(174 72% 52%)" />
              </linearGradient>
              <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(174 72% 52%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(174 72% 52%)" stopOpacity={0} />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(222 30% 18%)" opacity={0.4} />
            <XAxis dataKey="day" stroke="hsl(215 20% 55%)" axisLine={false} tickLine={false} fontSize={12} dy={10} />
            <YAxis yAxisId="left" stroke="hsl(215 20% 55%)" axisLine={false} tickLine={false} fontSize={12} dx={-10} />

            <Tooltip cursor={{ stroke: 'hsl(222 30% 18%)', strokeWidth: 2, strokeDasharray: '4 4' }} content={<CustomTooltip />} />

            <AnimatePresence>
              <Area yAxisId="left" type="monotone" dataKey="engagement" stroke="none" fill="url(#colorArea)" isAnimationActive={true} />
            </AnimatePresence>

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="engagement"
              stroke="url(#colorEngagement)"
              strokeWidth={4}
              dot={{ r: 4, fill: "hsl(222 47% 6%)", stroke: "hsl(174 72% 52%)", strokeWidth: 2 }}
              activeDot={{ r: 8, fill: "hsl(174 72% 52%)", stroke: "hsl(222 47% 6%)", strokeWidth: 3 }}
              filter="url(#glow)"
              isAnimationActive={true}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 rounded-lg p-2 text-sm text-foreground/80">
        <Sparkles className="w-4 h-4 text-primary" />
        <span><strong className="text-foreground">Insight:</strong> Consistent engagement trends indicate strong audience resonance.</span>
      </div>
    </motion.div>
  );
};

export default EngagementChart;
