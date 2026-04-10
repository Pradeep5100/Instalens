import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, BarChart3, MessageCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroBg from "@/assets/hero-bg.jpg";

import RecentAnalyses from "./RecentAnalyses";

interface LandingHeroProps {
  onAnalyze: (username: string) => void;
  isLoading: boolean;
}

const features = [
  { icon: BarChart3, label: "Profile Analytics", desc: "Deep engagement metrics" },
  { icon: MessageCircle, label: "Sentiment Analysis", desc: "Comment mood tracking" },
  { icon: TrendingUp, label: "Growth Insights", desc: "AI-powered recommendations" },
  { icon: Sparkles, label: "Smart Tips", desc: "Optimize your strategy" },
];

const LandingHero = ({ onAnalyze, isLoading }: LandingHeroProps) => {
  const [username, setUsername] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) onAnalyze(username.trim());
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Instagram Analytics
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          <span className="gradient-text">InstaLens</span>
          <br />
          <span className="text-foreground/90 text-3xl md:text-4xl font-medium">
            Decode Your Instagram Growth
          </span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl mb-6 max-w-xl mx-auto">
          Enter any username to unlock deep analytics, sentiment insights, and AI-powered growth recommendations.
        </p>

        <p className="text-xs font-medium tracking-wide text-muted-foreground/50 mb-10 animate-fade-in uppercase">
          Built for creators, freelancers, and marketing agencies
        </p>

        <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter Instagram username"
              className="pl-12 h-14 text-lg bg-secondary border-border/50 focus:border-primary focus:glow-primary"
            />
          </div>
          <Button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="h-14 px-8 text-lg font-semibold bg-primary text-primary-foreground hover:opacity-90 glow-primary"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            ) : (
              "Analyze"
            )}
          </Button>
        </form>

        <RecentAnalyses onSelect={onAnalyze} />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="stat-card text-center"
            >
              <f.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="font-semibold text-foreground text-sm">{f.label}</div>
              <div className="text-muted-foreground text-xs mt-1">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LandingHero;
