import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { ProfileData } from "@/lib/mockData";

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass p-3 rounded-lg border border-primary/20 shadow-xl">
        <p className="text-foreground font-bold">{payload[0].name}</p>
        <p className="text-sm tracking-wide" style={{ color: payload[0].payload.color }}>
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`item-${index}`} className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded-full" style={{ background: entry.payload.color }} />
          <span>{entry.value} ({entry.payload.value}%)</span>
        </li>
      ))}
    </ul>
  );
};

const SentimentChart = ({ data }: { data: ProfileData }) => {
  const chartData = [
    { name: "Positive 😊", value: data.sentimentData.positive, fill: "url(#colorPos)", color: "#22c55e" },
    { name: "Neutral 😐", value: data.sentimentData.neutral, fill: "url(#colorNeu)", color: "#eab308" },
    { name: "Negative 😡", value: data.sentimentData.negative, fill: "url(#colorNeg)", color: "#ef4444" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="stat-card relative pt-10"
    >
      <div className="absolute top-3 left-4 flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-accent/80">Sentiment Analysis</span>
      </div>
      <div className="absolute -inset-1 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 blur-xl opacity-30 -z-10 rounded-2xl" />
      <h3 className="text-lg font-semibold text-foreground mb-4">💬 Comment Sentiment</h3>
      <div className="relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <defs>
              <linearGradient id="colorPos" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#16a34a" />
              </linearGradient>
              <linearGradient id="colorNeu" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#ca8a04" />
              </linearGradient>
              <linearGradient id="colorNeg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#dc2626" />
              </linearGradient>
              <filter id="pieGlow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              dataKey="value"
              strokeWidth={0}
              paddingAngle={4}
            >
              {chartData.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.fill} filter="url(#pieGlow)" style={{ outline: 'none' }} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-x-0 top-[100px] flex flex-col items-center justify-center pointer-events-none">
          <span className="text-sm text-muted-foreground font-medium">Overall</span>
          <span className="text-base text-foreground font-bold">Sentiment</span>
        </div>
      </div>
    </motion.div>
  );
};

export default SentimentChart;
