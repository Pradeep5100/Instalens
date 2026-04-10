import { useState } from "react";
import LandingHero from "@/components/LandingHero";
import Dashboard from "@/components/Dashboard";
import { generateMockData, type ProfileData } from "@/lib/mockData";

const Index = () => {
  const [data, setData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalyze = async (rawUsername: string) => {
    const username = rawUsername.trim().replace(/^@/, "");
    if (!username) return;

    setIsLoading(true);
    try {
      const result = await generateMockData(username);
      setData(result);

      // Save to localStorage
      const saved = localStorage.getItem("recentAnalyses");
      let analyses = saved ? JSON.parse(saved) : [];

      const newEntry = {
        username: result.username,
        profilePic: result.profilePic,
        engagementRate: result.engagementRate,
        followers: result.followers,
        timestamp: Date.now()
      };

      // Remove if exists and add to front
      analyses = [newEntry, ...analyses.filter((a: any) => a.username.toLowerCase() !== username.toLowerCase())].slice(0, 5);
      localStorage.setItem("recentAnalyses", JSON.stringify(analyses));
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  if (data) {
    return <Dashboard data={data} onBack={() => setData(null)} onSelectProfile={handleAnalyze} />;
  }

  return <LandingHero onAnalyze={handleAnalyze} isLoading={isLoading} />;
};

export default Index;
