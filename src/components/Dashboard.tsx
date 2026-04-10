import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Users, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProfileData } from "@/lib/mockData";
import ProfileHeader from "./dashboard/ProfileHeader";
import StatCards from "./dashboard/StatCards";
import EngagementChart from "./dashboard/EngagementChart";
import SentimentChart from "./dashboard/SentimentChart";
import AiInsights from "./dashboard/AiInsights";
import PostPerformance from "./dashboard/PostPerformance";
import AccountHealthScore from "./dashboard/AccountHealthScore";
import BusinessIntelligenceTags from "./dashboard/BusinessIntelligenceTags";
import BusinessGrowthImpact from "./dashboard/BusinessGrowthImpact";
import GrowthGuidePanel from "./dashboard/GrowthGuidePanel";
import ProfileComparisonModal from "./dashboard/ProfileComparisonModal";
import OutputSummaryCard from "./dashboard/OutputSummaryCard";
import { Database, Search, Cpu, PieChart as PieIcon, Lightbulb, Zap, ArrowRight } from "lucide-react";

interface DashboardProps {
  data: ProfileData;
  onBack: () => void;
  onSelectProfile: (username: string) => void;
}

const Dashboard = ({ data, onBack, onSelectProfile }: DashboardProps) => {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isGrowthGuideOpen, setIsGrowthGuideOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  const handleDownloadReport = async () => {
    setIsGeneratingReport(true);

    import("sonner").then(async ({ toast }) => {
      try {
        // Generate a small delay for feedback
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Create the JSON data
        const reportData = {
          report_type: "InstaLens Business Intelligence Report",
          generated_at: new Date().toISOString(),
          profile: {
            username: data.username,
            full_name: data.fullName,
            bio: data.bio,
            followers: data.followers,
            following: data.following,
            posts: data.posts,
          },
          analytics: {
            engagement_rate: `${data.engagementRate}%`,
            business_category: data.businessCategory,
            business_type: data.businessType,
            monetization_status: data.monetizationStatus.label,
          },
          insights: data.aiInsights,
          growth_impact: data.businessGrowthImpact,
          data_source: "InstaLens AI Engine"
        };

        const jsonString = JSON.stringify(reportData, null, 2);
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `InstaLens_Report_${data.username}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setIsGeneratingReport(false);
        toast.success("Business data downloaded as JSON successfully!");
      } catch (error) {
        console.error("JSON generation failed:", error);
        setIsGeneratingReport(false);
        toast.error("Failed to generate JSON report");
      }
    });
  };
  return (
    <div className="min-h-screen bg-background">
      {/* System Flow Indicator */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="glass rounded-full px-6 py-2 flex items-center justify-center gap-4 text-[10px] font-bold tracking-widest uppercase border-primary/20 bg-primary/5">
          <FlowStep icon={<Search />} label="Input" />
          <FlowArrow />
          <FlowStep icon={<Database />} label="Data Extraction" color="text-purple-400" />
          <FlowArrow />
          <FlowStep icon={<Cpu />} label="AI Analysis" color="text-primary" />
          <FlowArrow />
          <FlowStep icon={<PieIcon />} label="Sentiment" color="text-accent" />
          <FlowArrow />
          <FlowStep icon={<Lightbulb />} label="Insights" color="text-emerald-400" />
          <FlowArrow />
          <FlowStep icon={<Zap />} label="Results" color="text-orange-400" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            New Analysis
          </Button>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleDownloadReport}
              disabled={isGeneratingReport}
              className="bg-card text-foreground border border-border/50 hover:border-primary/50 hover:bg-muted transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <FileDown className="w-4 h-4 mr-2 group-hover:animate-bounce" />
              {isGeneratingReport ? "Downloading..." : "Download Business Data (JSON)"}
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsComparisonOpen(true)}
              className="bg-card text-foreground border border-border/50 hover:bg-muted transition-all duration-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Compare Profiles
            </Button>

            <Button
              onClick={() => setIsGrowthGuideOpen(true)}
              className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground glow-primary transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Open Growth Guide
            </Button>
          </div>
        </motion.div>

        <div className="space-y-6">
          <ProfileHeader data={data} />
          <StatCards data={data} />

          <OutputSummaryCard data={data} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <EngagementChart data={data} />
            </div>
            <SentimentChart data={data} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="flex flex-col gap-6">
              <BusinessGrowthImpact data={data} />
              <AccountHealthScore data={data} />
            </div>
            <AiInsights data={data} />
            <div className="flex flex-col gap-6">
              <BusinessIntelligenceTags data={data} />
              <PostPerformance data={data} />
            </div>
          </div>
        </div>

        <div className="mt-12 mb-8 text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
            Designed for individuals and businesses
          </p>
          <p className="text-[9px] font-medium text-muted-foreground/20 max-w-md mx-auto">
            Insights are generated based on publicly available Instagram profile data and AI analysis.
          </p>
        </div>
      </div>

      <GrowthGuidePanel
        isOpen={isGrowthGuideOpen}
        onClose={() => setIsGrowthGuideOpen(false)}
      />

      <ProfileComparisonModal
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
        onSelectProfile={onSelectProfile}
      />
    </div>
  );
};

const FlowStep = ({ icon, label, color = "text-muted-foreground" }: { icon: React.ReactNode; label: string; color?: string }) => (
  <div className="flex items-center gap-2 overflow-hidden">
    <span className={`w-3 h-3 ${color} shrink-0`}>{icon}</span>
    <span className={`${color} whitespace-nowrap sr-only sm:not-sr-only`}>{label}</span>
  </div>
);

const FlowArrow = () => (
  <ArrowRight className="w-3 h-3 text-muted-foreground/30 shrink-0" />
);

export default Dashboard;
