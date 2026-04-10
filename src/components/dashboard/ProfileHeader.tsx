import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { ProfileData } from "@/lib/mockData";

const ProfileHeader = ({ data }: { data: ProfileData }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="stat-card relative flex flex-col sm:flex-row items-center gap-6 pt-10"
  >
    <div className="absolute top-3 left-4 flex items-center gap-1.5">
      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
      <span className="text-[10px] uppercase tracking-widest font-bold text-purple-400/80">Data Extraction</span>
    </div>

    <img
      src={data.profilePic}
      alt={data.username}
      className="w-20 h-20 rounded-full border-2 border-primary/50 shrink-0"
      referrerPolicy="no-referrer"
    />
    <div className="text-center sm:text-left flex-1 min-w-0">
      <div className="flex items-center gap-2 justify-center sm:justify-start">
        <h2 className="text-2xl font-bold text-foreground truncate">@{data.username}</h2>
        <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
      </div>
      <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{data.bio}</p>

      {/* Classification Tags */}
      <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
        <Tag label="Business" value={data.businessCategory || "Digital Creator"} color="text-primary" />
        <Tag label="Content" value={data.contentType || "Lifestyle"} color="text-purple-400" />
        <Tag label="Audience" value={data.audienceType || "General Audience"} color="text-accent" />
      </div>
    </div>
    <div className="flex gap-8 text-center sm:pl-6 sm:border-l border-border/30">
      {[
        { label: "Posts", value: data.posts },
        { label: "Followers", value: data.followers.toLocaleString() },
        { label: "Following", value: data.following.toLocaleString() },
      ].map((s) => (
        <div key={s.label}>
          <div className="text-xl font-bold text-foreground">{s.value}</div>
          <div className="text-xs text-muted-foreground">{s.label}</div>
        </div>
      ))}
    </div>
  </motion.div>
);

const Tag = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/50 border border-border/50 text-[10px] font-medium group transition-all hover:border-primary/30">
    <span className="text-muted-foreground">{label}:</span>
    <span className={`${color} font-bold`}>{value}</span>
  </div>
);

export default ProfileHeader;
