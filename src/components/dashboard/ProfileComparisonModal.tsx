import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, Zap, TrendingUp, CheckCircle, AlertTriangle, Loader2, ArrowRight, Plus, Minus, Trophy, Medal, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateMockData } from "@/lib/mockData";

interface ProfileComparisonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectProfile: (username: string) => void;
}

const ProfileComparisonModal = ({ isOpen, onClose, onSelectProfile }: ProfileComparisonModalProps) => {
    const [step, setStep] = useState<"input" | "loading" | "result">("input");
    const [usernames, setUsernames] = useState<string[]>(["", ""]);
    const [result, setResult] = useState<any>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const addUsername = () => {
        if (usernames.length < 10) {
            setUsernames([...usernames, ""]);
        }
    };

    const removeUsername = (index: number) => {
        if (usernames.length > 2) {
            setUsernames(usernames.filter((_, i) => i !== index));
        }
    };

    const updateUsername = (index: number, val: string) => {
        const newUrls = [...usernames];
        newUrls[index] = val;
        setUsernames(newUrls);
    };

    const getScore = (p: any) => {
        const totalGrowth = p.weeklyGrowth.reduce((s: number, d: any) => s + (d.followerGrowth || 0), 0);
        const eng = Math.min((p.engagementRate / 3.5) * 100, 100);
        const gro = Math.min(Math.max(totalGrowth, 0) / 120, 1) * 100;
        const con = Math.min((p.streakData?.current || 3) / 7, 1) * 100;
        const int = Math.min(p.avgComments / 50, 1) * 100;
        return Math.round((eng * 0.40) + (gro * 0.25) + (con * 0.20) + (int * 0.15));
    };

    const handleCompare = async () => {
        const valid = usernames.filter(u => u.trim() !== "").map(u => u.replace("@", ""));
        if (valid.length < 2) return;
        setStep("loading");
        setLoadingProgress(0);

        try {
            const results = [];
            for (let i = 0; i < valid.length; i++) {
                const data = await generateMockData(valid[i]);
                results.push({ ...data, rawScore: getScore(data) });
                setLoadingProgress(((i + 1) / valid.length) * 100);
            }

            // Sort by score
            results.sort((a, b) => b.rawScore - a.rawScore);

            setResult({
                leaderboard: results.map((r, idx) => ({
                    rank: idx + 1,
                    username: `@${r.username}`,
                    rawUsername: r.username,
                    avatarUrl: r.profilePic,
                    category: r.businessCategory,
                    score: r.rawScore,
                    engagementRate: r.engagementRate,
                    followers: r.followers,
                    strengths: [
                        `${r.engagementRate}% engagement rate`,
                        `${r.followers.toLocaleString()} follower base`
                    ],
                    recommendations: r.aiInsights.slice(0, 2)
                }))
            });
            setStep("result");
        } catch (error) {
            console.error("Comparison failed:", error);
            setStep("input");
        }
    };

    const clearModal = () => {
        setStep("input");
        setUsernames(["", ""]);
        setResult(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={clearModal}
                        className="fixed inset-0 bg-background/95 backdrop-blur-xl z-50 overflow-y-auto pt-10 pb-20 px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98, y: 10 }}
                            transition={{ duration: 0.3 }}
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-6xl mx-auto w-full bg-card/80 border border-border/50 rounded-3xl shadow-2xl relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/20 rounded-xl">
                                        <TrendingUp className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-xl font-black tracking-tight uppercase">Multi-Profile IQ Comparison</h2>
                                </div>
                                <Button variant="ghost" size="icon" onClick={clearModal} className="rounded-full hover:bg-muted transition-colors">
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            <div className="p-6 md:p-10 min-h-[500px]">
                                {step === "input" && (
                                    <div className="max-w-3xl mx-auto space-y-10">
                                        <div className="text-center space-y-3">
                                            <h3 className="text-3xl font-black">Benchmark up to 10 Profiles</h3>
                                            <p className="text-muted-foreground text-lg">Compare competitive landscapes and identify market leaders instantly.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {usernames.map((u, idx) => (
                                                <div key={idx} className="relative group">
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded-md bg-muted text-[10px] font-black text-muted-foreground transition-colors group-hover:bg-primary/20 group-hover:text-primary">
                                                        {idx + 1}
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder={`@profile${idx + 1}`}
                                                        className="w-full bg-background/40 border border-border/60 rounded-xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all text-lg font-bold placeholder:text-muted-foreground/30"
                                                        value={u}
                                                        onChange={(e) => updateUsername(idx, e.target.value)}
                                                    />
                                                    {usernames.length > 2 && (
                                                        <button
                                                            onClick={() => removeUsername(idx)}
                                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-red-400 transition-colors"
                                                        >
                                                            <Minus className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {usernames.length < 10 && (
                                                <button
                                                    onClick={addUsername}
                                                    className="w-full border-2 border-dashed border-border/40 rounded-xl py-4 flex items-center justify-center gap-2 text-muted-foreground hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all group"
                                                >
                                                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                                    <span className="font-bold uppercase text-xs tracking-widest">Add Slot ({usernames.length}/10)</span>
                                                </button>
                                            )}
                                        </div>

                                        <div className="pt-6 flex justify-center">
                                            <Button
                                                disabled={usernames.filter(u => u.trim() !== "").length < 2}
                                                onClick={handleCompare}
                                                className="h-16 px-12 rounded-2xl text-xl font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground glow-primary transition-all duration-300 disabled:opacity-30"
                                            >
                                                <Zap className="w-6 h-6 mr-3 fill-current" /> Initialize Comparison
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {step === "loading" && (
                                    <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                                            <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
                                        </div>
                                        <div className="text-center space-y-4 max-w-sm">
                                            <h3 className="text-2xl font-black uppercase tracking-tight">Crunching Market Data</h3>
                                            <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden border border-border/20">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${loadingProgress}%` }}
                                                    className="h-full bg-primary glow-primary"
                                                />
                                            </div>
                                            <p className="text-muted-foreground text-sm font-medium">Processing {usernames.filter(u => u.trim() !== "").length} profiles... {Math.round(loadingProgress)}%</p>
                                        </div>
                                    </div>
                                )}

                                {step === "result" && result && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12 pb-10">
                                        {/* Champion Billboard */}
                                        <div
                                            onClick={() => {
                                                onSelectProfile(result.leaderboard[0].rawUsername);
                                                onClose();
                                            }}
                                            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-purple-500/5 border border-primary/20 p-1 cursor-pointer group hover:ring-2 hover:ring-primary/40 transition-all"
                                        >
                                            <div className="absolute top-0 right-0 p-8 opacity-20">
                                                <Trophy className="w-32 h-32 text-primary" />
                                            </div>
                                            <div className="flex flex-col md:flex-row items-center gap-8 p-10 relative z-10">
                                                <div className="relative">
                                                    <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="w-32 h-32 rounded-full border-4 border-primary p-1 bg-background relative">
                                                        <img src={result.leaderboard[0].avatarUrl} alt="Winner" className="w-full h-full rounded-full object-cover" />
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground p-2 rounded-xl shadow-lg">
                                                        <Trophy className="w-6 h-6" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 text-center md:text-left space-y-2">
                                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-2 border border-primary/30">
                                                        Market Leader
                                                    </div>
                                                    <h2 className="text-4xl font-black tracking-tighter">{result.leaderboard[0].username}</h2>
                                                    <p className="text-muted-foreground text-lg font-medium">{result.leaderboard[0].category} • {result.leaderboard[0].followers.toLocaleString()} Followers</p>
                                                </div>
                                                <div className="text-center bg-background/60 backdrop-blur-md px-10 py-6 rounded-2xl border border-border/50 shadow-xl">
                                                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Wellness Score</div>
                                                    <div className="text-6xl font-black text-primary tracking-tighter">{result.leaderboard[0].score}<span className="text-lg text-muted-foreground/40 font-bold">/100</span></div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* The Leaderboard Grid */}
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-3 px-2">
                                                <Medal className="w-5 h-5 text-purple-400" />
                                                <h3 className="text-lg font-black uppercase tracking-widest">Full Rankings</h3>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {result.leaderboard.map((item: any, idx: number) => (
                                                    <div
                                                        key={item.username}
                                                        onClick={() => {
                                                            onSelectProfile(item.rawUsername);
                                                            onClose();
                                                        }}
                                                        className={`stat-card p-5 relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer ${idx === 0 ? 'border-primary/50' : 'border-border/60'}`}
                                                    >
                                                        <div className="absolute top-3 right-4 text-2xl font-black opacity-10 italic">#{idx + 1}</div>
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="w-12 h-12 rounded-full border border-border/50 overflow-hidden">
                                                                <img src={item.avatarUrl} alt={item.username} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-black truncate">{item.username}</div>
                                                                <div className="text-[10px] font-bold text-muted-foreground/60">{item.engagementRate}% ER</div>
                                                            </div>
                                                        </div>
                                                        <div className="w-full bg-muted/20 h-1.5 rounded-full overflow-hidden mb-4">
                                                            <div className={`h-full ${idx === 0 ? 'bg-primary' : (idx < 3 ? 'bg-purple-400' : 'bg-muted-foreground/50')}`} style={{ width: `${item.score}%` }} />
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="text-xs font-black uppercase text-muted-foreground tracking-tighter">Score</div>
                                                            <div className={`text-xl font-black ${idx === 0 ? 'text-primary' : (idx < 3 ? 'text-purple-400' : 'text-foreground')}`}>{item.score}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Comparison Matrix Table */}
                                        <div className="overflow-x-auto rounded-3xl border border-border/50 bg-background/40 backdrop-blur-sm">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-muted/30">
                                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rank</th>
                                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Competitor</th>
                                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Followers</th>
                                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Engagement</th>
                                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">IQ Score</th>
                                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.leaderboard.map((item: any) => (
                                                        <tr
                                                            key={item.username}
                                                            onClick={() => {
                                                                onSelectProfile(item.rawUsername);
                                                                onClose();
                                                            }}
                                                            className="border-t border-border/20 hover:bg-primary/5 transition-colors group cursor-pointer"
                                                        >
                                                            <td className="px-6 py-4">
                                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${item.rank === 1 ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted/40 text-muted-foreground'}`}>
                                                                    #{item.rank}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <img src={item.avatarUrl} className="w-8 h-8 rounded-full border border-border/50" />
                                                                    <div className="text-sm font-bold group-hover:text-primary transition-colors">{item.username}</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-muted-foreground">{item.followers.toLocaleString()}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="text-sm font-bold">{item.engagementRate}%</div>
                                                                    <TrendingUp className={`w-3 h-3 ${item.engagementRate > 3 ? 'text-emerald-400' : 'text-orange-400'}`} />
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 font-black text-lg tracking-tighter">{item.score}</td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex justify-center">
                                                                    {item.rank === 1 ? (
                                                                        <CheckCircle className="w-5 h-5 text-primary" />
                                                                    ) : (
                                                                        <div className="w-5 h-5 rounded-full border-2 border-border/30" />
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="flex justify-center pt-8">
                                            <Button
                                                variant="outline"
                                                onClick={() => setStep("input")}
                                                className="border-primary/30 bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 px-10 h-12 rounded-xl font-bold uppercase tracking-widest text-xs"
                                            >
                                                Rerurn To Comparison Deck
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ProfileComparisonModal;
