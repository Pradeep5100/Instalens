import { motion } from "framer-motion";
import { Activity, TrendingUp, Target, MessageSquare, Info } from "lucide-react";
import type { ProfileData } from "@/lib/mockData";
import { useEffect, useState } from "react";

const AccountHealthScore = ({ data }: { data: ProfileData }) => {
    const [animatedScore, setAnimatedScore] = useState(0);

    // Scoring Logic (normalized)
    const engScoreRaw = Math.min((data.engagementRate / 3.5) * 100, 100);
    const engagementScore = engScoreRaw * 0.40;

    const totalGrowth = data.weeklyGrowth[0]?.followerGrowth !== undefined
        ? data.weeklyGrowth.reduce((s, d) => s + (d.followerGrowth || 0), 0)
        : 150;

    const groScoreRaw = Math.min(Math.max(totalGrowth, 0) / 120, 1) * 100;
    const growthScore = groScoreRaw * 0.25;

    const conScoreRaw = Math.min((data.streakData?.current || 3) / 7, 1) * 100;
    const consistencyScore = conScoreRaw * 0.20;

    const intScoreRaw = Math.min(data.avgComments / 50, 1) * 100;
    const interactionScore = intScoreRaw * 0.15;

    const finalScore = Math.round(engagementScore + growthScore + consistencyScore + interactionScore);

    useEffect(() => {
        // Smooth counter animation
        let start = 0;
        const duration = 1500; // 1.5s
        const increment = finalScore / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= finalScore) {
                setAnimatedScore(finalScore);
                clearInterval(timer);
            } else {
                setAnimatedScore(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [finalScore]);

    // Status mapping
    let colorClass = "text-green-400";
    let strokeClass = "stroke-green-500";
    let dropShadowColor = "rgba(34, 197, 94, 0.4)";
    let statusText = "Excellent😎";

    if (finalScore < 50) {
        colorClass = "text-red-400";
        strokeClass = "stroke-red-500";
        dropShadowColor = "rgba(239, 68, 68, 0.4)";
        statusText = "Needs Improvement😢";
    } else if (finalScore < 80) {
        colorClass = "text-yellow-400";
        strokeClass = "stroke-yellow-500";
        dropShadowColor = "rgba(234, 179, 8, 0.4)";
        statusText = "Good😇";
    }

    const radius = 38;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="stat-card relative overflow-hidden group border border-border/50 hover:border-primary/30 transition-all duration-500"
        >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Account Health Score
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Overall performance metric</p>
                </div>

                <div className="relative group/tooltip">
                    <Info className="w-4 h-4 text-muted-foreground cursor-help hover:text-foreground transition-colors" />
                    <div className="absolute right-0 top-6 w-48 bg-popover/95 backdrop-blur border border-border text-xs p-2.5 rounded shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
                        Score is calculated using:
                        <br />• Engagement Rate (40%)
                        <br />• Follower Growth (25%)
                        <br />• Consistency (20%)
                        <br />• Interactions (15%)
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8 mb-6">
                {/* Radial Progress */}
                <div className="relative flex items-center justify-center">
                    <svg width="120" height="120" className="transform -rotate-90 drop-shadow-xl" style={{ filter: `drop-shadow(0 0 10px ${dropShadowColor})` }}>
                        <circle
                            cx="60"
                            cy="60"
                            r={radius}
                            className="stroke-muted/30"
                            strokeWidth="10"
                            fill="transparent"
                        />
                        <motion.circle
                            cx="60"
                            cy="60"
                            r={radius}
                            className={`${strokeClass} transition-all duration-500 ease-in-out`}
                            strokeWidth="10"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className={`text-3xl font-black ${colorClass}`}>{animatedScore}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">/ 100</span>
                    </div>
                </div>

                {/* Status & Trends */}
                <div className="flex-1 text-center sm:text-left">
                    <div className={`inline-flex px-3 py-1 bg-background border border-border rounded-full text-sm font-bold mb-3 shadow-lg ${colorClass}`}>
                        {statusText}
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Better than <strong className="text-foreground">72%</strong> of similar industry accounts.
                    </p>
                    <div className="mt-2 text-xs font-semibold text-emerald-400 flex items-center justify-center sm:justify-start gap-1">
                        <TrendingUp className="w-3 h-3" /> +5 points this week
                    </div>
                </div>
            </div>

            {/* Sub-metrics Breakdown */}
            <div className="space-y-4 pt-5 px-3 sm:px-6 border-t border-border/50">
                <MetricBar label="Engagement Rate" score={engScoreRaw} icon={<Activity className="w-3.5 h-3.5" />} color="bg-primary" />
                <MetricBar label="Follower Growth" score={groScoreRaw} icon={<TrendingUp className="w-3.5 h-3.5" />} color="bg-orange-500" />
                <MetricBar label="Posting Consistency" score={conScoreRaw} icon={<Target className="w-3.5 h-3.5" />} color="bg-emerald-500" />
                <MetricBar label="Audience Interaction" score={intScoreRaw} icon={<MessageSquare className="w-3.5 h-3.5" />} color="bg-purple-500" />
            </div>

            {/* Insight */}
            <div className="mt-6 text-sm text-center px-4 py-3 bg-muted/30 rounded-lg">
                {finalScore >= 80 ? (
                    <>Your account is performing <strong>excellently</strong>. Keep maintaining this cadence to dominate your niche!</>
                ) : (
                    <>Your account is performing <strong>well</strong>. Improving posting consistency can easily push your score above 90.</>
                )}
            </div>

        </motion.div>
    );
};

const MetricBar = ({ label, score, icon, color }: any) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-medium">
            <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="text-foreground/70">{icon}</span> {label}
            </span>
            <span className="text-foreground font-bold">{Math.round(score)}/100</span>
        </div>
        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 1, delay: 0.8 }}
                className={`h-full rounded-full ${color}`}
            />
        </div>
    </div>
);

export default AccountHealthScore;
