export interface ProfileData {
  username: string;
  fullName: string;
  bio: string;
  profilePic: string;
  followers: number;
  following: number;
  posts: number;
  engagementRate: number;
  avgLikes: number;
  avgComments: number;
  recentPosts: PostData[];
  sentimentData: SentimentData;
  weeklyGrowth: WeeklyData[];
  bestPostingTimes: string[];
  aiInsights: string[];
  hashtags: string[];
  streakData: StreakData;
  businessCategory: string;
  contentType: string;
  audienceType: string;
  biTags: {
    category: { tag: string; confidence: number }[];
    services: { tag: string; confidence: number }[];
    themes: { tag: string; confidence: number }[];
    audience: { tag: string; confidence: number }[];
  };
  tagSummary: string;
  businessGrowthImpact: {
    growthPotential: string;
    reachImpact: string;
    leadPotential: string;
    actionResults: { action: string; result: string }[];
  };
  businessType: string;
  monetizationStatus: { label: string; stroke: string; bg: string; icon: string };
  monetizationInsight: string;
}

export interface StreakData {
  current: number;
  best: number;
  history: boolean[];
}

export interface PostData {
  id: number;
  likes: number;
  comments: number;
  type: "image" | "reel" | "carousel";
  date: string;
}

export interface SentimentData {
  positive: number;
  neutral: number;
  negative: number;
}

export interface WeeklyData {
  day: string;
  followers: number;
  followerGrowth: number;
  engagement: number;
}

async function generateMockData(username: string): Promise<ProfileData> {
  // Default fallback values
  let followers = Math.floor(Math.random() * 50000) + 5000;
  let following = Math.floor(Math.random() * 1500) + 200;
  let postsCount = Math.floor(Math.random() * 300) + 50;
  let realFullName = username.charAt(0).toUpperCase() + username.slice(1).replace(/[._]/g, " ");
  let realBio = "✨ Content Creator | 📸 Photographer | 🌍 Traveler";
  let realProfilePic = `https://api.dicebear.com/9.x/initials/svg?seed=${username}&backgroundColor=0891b2`;
  let officialCategory = "Digital Creator";
  let isBusiness = false;
  let apiHashtags: string[] = [];
  let activeDataSource = "generated";

  // ── Primary: Local Express API (Instaloader) ─────────────────────────────
  try {
    const localRes = await fetch(`/api/profile?username=${encodeURIComponent(username)}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (localRes.ok) {
      const localData = await localRes.json() as any;
      if (!localData.error) {
        followers = localData.followers ?? followers;
        following = localData.following ?? following;
        postsCount = localData.posts ?? postsCount;
        realFullName = localData.fullName || realFullName;
        realBio = localData.bio || realBio;
        // Clean up "None," prefix if present
        officialCategory = (localData.businessCategoryName || officialCategory).replace(/^None,\s*/i, "");
        isBusiness = localData.isBusinessAccount ?? false;
        if (localData.profilePic) {
          realProfilePic = `https://wsrv.nl/?url=${encodeURIComponent(localData.profilePic)}`;
        }
        activeDataSource = localData.dataSource || "instaloader";
        console.info(`[DataSource] ✅ ${activeDataSource} for @${username}`);
      }
    }
  } catch {
    // Server not running or network error — fall through to Apify
    console.info(`[DataSource] ⚠️ Local API unavailable, trying Apify...`);
  }

  // ── Fallback: Apify (only if local API didn't resolve data) ──────────────
  const token = import.meta.env.VITE_APIFY_TOKEN;
  if (activeDataSource === "generated" && token && token !== "your_apify_token_here") {
    try {
      const apifyUrl = `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs?token=${token}&waitForFinish=120`;
      const res = await fetch(apifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernames: [username] })
      });

      if (res.ok) {
        const runInfo = await res.json();
        const datasetId = runInfo.data.defaultDatasetId;
        if (datasetId) {
          const datasetRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`);
          if (datasetRes.ok) {
            const items = await datasetRes.json();
            if (items && items.length > 0) {
              const user = items[0];
              followers = user.followersCount ?? followers;
              following = user.followsCount ?? following;
              postsCount = user.postsCount ?? postsCount;
              realFullName = user.fullName ?? realFullName;
              realBio = user.biography ?? realBio;
              // Clean up "None," prefix if present
              officialCategory = (user.businessCategoryName || officialCategory).replace(/^None,\s*/i, "");
              isBusiness = user.isBusinessAccount ?? false;
              const rawPic = user.profilePicUrlHD ?? user.profilePicUrl;
              if (rawPic) {
                realProfilePic = `https://wsrv.nl/?url=${encodeURIComponent(rawPic)}`;
              }
              activeDataSource = "apify";
              console.info(`[DataSource] ✅ apify fallback for @${username}`);

              // Extract real hashtags from latest posts captions
              if (user.latestPosts && Array.isArray(user.latestPosts)) {
                const allCaps = user.latestPosts.map((p: any) => p.description || p.caption || "").join(" ");
                const matches = allCaps.match(/#[\w\u0590-\u05ff]+/g);
                if (matches) {
                  apiHashtags = [...new Set(matches as string[])].slice(0, 18);
                }
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Apify fetch error:", err);
    }
  }

  const avgLikes = Math.floor(followers * (Math.random() * 0.08 + 0.02));
  const avgComments = Math.floor(avgLikes * 0.05);
  const engagementRate = parseFloat(((avgLikes + avgComments) / (followers || 1) * 100).toFixed(2));

  const recentPosts: PostData[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    likes: Math.floor(avgLikes * (Math.random() * 0.6 + 0.7)),
    comments: Math.floor(avgComments * (Math.random() * 0.8 + 0.6)),
    type: (["image", "reel", "carousel"] as const)[Math.floor(Math.random() * 3)],
    date: new Date(Date.now() - i * 86400000 * 3).toLocaleDateString(),
  }));

  const weeklyGrowth: WeeklyData[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
    day,
    followers: 0,
    followerGrowth: Math.floor(Math.random() * 60) - 10,
    engagement: parseFloat((Math.random() * 3 + 1.5).toFixed(1)),
  }));

  let curFol = followers;
  for (let i = weeklyGrowth.length - 1; i >= 0; i--) {
    weeklyGrowth[i].followers = curFol;
    curFol -= weeklyGrowth[i].followerGrowth;
  }

  const history = Array.from({ length: 7 }, () => Math.random() > 0.3);
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i]) streak++; else break;
  }

  const businessCategory = officialCategory;
  const contentType = postsCount > 100 ? "Informational" : "Entertainment";
  const audienceType = followers > 10000 ? "Professionals" : "Youth";

  const b2bKeywords = ["agency", "service", "consulting", "marketing", "business", "provider", "saas", "software", "solutions"];
  const isActuallyB2B = isBusiness && (
    b2bKeywords.some(k => realBio.toLowerCase().includes(k)) ||
    b2bKeywords.some(k => officialCategory.toLowerCase().includes(k))
  );

  const businessType = isActuallyB2B ? "B2B (Business / Service Provider)" : "B2C (Creator / Influencer)";

  const monetizationStatus = (() => {
    if (followers < 1000 || engagementRate < 2) return { label: "Not Monetizable", stroke: "border-red-500/50", bg: "bg-red-500/20", icon: "❌" };
    if (followers < 10000) return { label: "Emerging Creator", stroke: "border-yellow-500/50", bg: "bg-yellow-500/20", icon: "⚠️" };
    return { label: "Brand Ready", stroke: "border-emerald-500/50", bg: "bg-emerald-500/20", icon: "✅" };
  })();

  // Add variance to confidence scores based on username hash
  const getConf = (base: number) => {
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return Math.min(98, Math.max(75, base + (hash % 10) - 5));
  };

  const biTags = {
    category: [
      { tag: businessCategory, confidence: getConf(92) },
      { tag: isActuallyB2B ? "Enterprise" : "Lifestyle", confidence: getConf(85) }
    ],
    services: [
      { tag: isActuallyB2B ? "Consulting" : "Brand Promotion", confidence: getConf(88) },
      { tag: "Content Strategy", confidence: getConf(94) }
    ],
    themes: [
      { tag: contentType, confidence: getConf(90) },
      { tag: "Digital Trends", confidence: getConf(78) }
    ],
    audience: [
      { tag: audienceType, confidence: getConf(88) },
      { tag: followers > 20000 ? "High Reach" : "Niche Focus", confidence: getConf(82) }
    ]
  };

  const fallbackHashtags = (() => {
    const cat = businessCategory.toLowerCase();
    if (cat.includes("fashion")) return ["#fashion", "#style", "#ootd", "#fashionblogger", "#instastyle"];
    if (cat.includes("fitness") || cat.includes("well")) return ["#fitness", "#workout", "#gym", "#motivation", "#health"];
    if (cat.includes("travel")) return ["#travel", "#adventure", "#explore", "#wanderlust", "#travelgram"];
    if (isActuallyB2B) return ["#business", "#marketing", "#entrepreneur", "#success", "#strategy"];
    return ["#contentcreator", "#digitalmarketing", "#growth", "#instagram", "#socialmedia"];
  })();

  return {
    username,
    fullName: realFullName,
    bio: realBio,
    profilePic: realProfilePic,
    followers,
    following,
    posts: postsCount,
    engagementRate,
    avgLikes,
    avgComments,
    recentPosts,
    sentimentData: { positive: 68, neutral: 22, negative: 10 },
    weeklyGrowth,
    bestPostingTimes: ["6:00 PM - 8:00 PM", "12:00 PM - 1:00 PM", "9:00 AM - 10:00 AM"],
    aiInsights: [
      `📈 Your engagement rate of ${engagementRate}% is ${engagementRate > 3 ? "above" : "below"} the industry average of 3%.`,
      `🎬 Reels get ${Math.floor(Math.random() * 40 + 20)}% more reach than static posts — prioritize video content for maximum visibility!`,
      `⏰ Post consistency is high — maintain your ${streak} day active streak to dominate the algorithm.`,
      `#️⃣ Using 20-25 relevant hashtags per post could boost your reach by up to 28% based on current trends.`,
      `💬 Audience interaction is key: replying to top comments within the first 60 minutes can increase post vitality.`,
      `📊 Your ${businessType.includes("B2B") ? "B2B service focus" : "B2C creator profile"} shows strong alignment with ${officialCategory} trends.`,
      `🚀 ${followers > 10000 ? "Leverage your scale" : "Focus on community"} to drive ${isActuallyB2B ? "lead conversion" : "brand collaborations"} in the next quarter.`
    ],
    hashtags: apiHashtags.length >= 5 ? apiHashtags : [...apiHashtags, ...fallbackHashtags].slice(0, 15),
    streakData: { current: streak, best: streak + 2, history },
    businessCategory,
    contentType,
    audienceType,
    biTags,
    tagSummary: `This profile is a ${businessCategory.toLowerCase()} account with a ${businessType.split(' ')[0]} focus.`,
    businessType,
    monetizationStatus,
    monetizationInsight: isActuallyB2B ? "High potential for lead generation and professional service contracts." : "Excellent potential for brand collaborations and sponsored content.",
    businessGrowthImpact: {
      growthPotential: `+${Math.floor(Math.random() * 10) + 15}%`,
      reachImpact: `up to ${Math.floor(Math.random() * 15) + 30}%`,
      leadPotential: isActuallyB2B ? "Enterprise-grade lead quality with professional conversion paths." : "High consumer resonance with rapid brand-deal conversion potential.",
      actionResults: [
        { action: "Increase posting frequency", result: "higher reach → improved engagement → potential revenue growth" },
        { action: "Use targeted hashtags", result: "better visibility → increased audience acquisition" },
        { action: "Optimize posting time", result: "higher interaction → improved conversion potential" }
      ]
    }
  };
}

export { generateMockData };
