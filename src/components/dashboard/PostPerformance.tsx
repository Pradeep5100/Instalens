import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import type { ProfileData } from "@/lib/mockData";

const PostPerformance = ({ data }: { data: ProfileData }) => {
  const chartData = data.recentPosts.map((p, i) => ({
    name: `Post ${i + 1}`,
    likes: p.likes,
    comments: p.comments,
    type: p.type,
  }));

  const typeCount = data.recentPosts.reduce(
    (acc, p) => ({ ...acc, [p.type]: (acc[p.type] || 0) + 1 }),
    {} as Record<string, number>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="stat-card"
    >
      <h3 className="text-lg font-semibold text-foreground mb-2">📸 Post Performance</h3>
      <div className="flex gap-3 mb-4">
        {Object.entries(typeCount).map(([type, count]) => (
          <span key={type} className="text-xs text-muted-foreground">
            {type}: <span className="text-foreground font-medium">{count}</span>
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
          <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={11} />
          <YAxis stroke="hsl(215 20% 55%)" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222 44% 9%)",
              border: "1px solid hsl(222 30% 18%)",
              borderRadius: "8px",
              color: "hsl(210 40% 96%)",
            }}
          />
          <Bar dataKey="likes" fill="hsl(174 72% 52%)" radius={[4, 4, 0, 0]} name="Likes" />
          <Bar dataKey="comments" fill="hsl(262 60% 60%)" radius={[4, 4, 0, 0]} name="Comments" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default PostPerformance;
