import { useEffect, useState } from "react";
import { Trophy, Users, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderEntry {
  position: number;
  email: string;
  referral_count: number;
}

const maskEmail = (email: string) => {
  const [name, domain] = email.split("@");
  if (!domain) return "***";
  const visible = name.slice(0, 2);
  return `${visible}***@${domain}`;
};

const Leaderboard = () => {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaders = async () => {
    const { data } = await supabase
      .from("waitlist_signups")
      .select("position, email, referral_count")
      .gt("referral_count", 0)
      .order("referral_count", { ascending: false })
      .limit(10);

    if (data) setLeaders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaders();

    const channel = supabase
      .channel("leaderboard")
      .on("postgres_changes", { event: "*", schema: "public", table: "waitlist_signups" }, () => {
        fetchLeaders();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  if (loading || leaders.length === 0) return null;

  const rankStyles = [
    "text-gold-light",
    "text-muted-foreground",
    "text-amber-700",
  ];

  return (
    <div className="w-full bg-secondary border border-input rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Trophy size={16} className="text-accent" />
        <span className="font-mono-dm text-[0.58rem] tracking-[0.2em] uppercase text-accent">
          Top Referrers
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {leaders.map((entry, i) => (
          <div
            key={entry.position}
            className="flex items-center gap-3 py-2 px-3 bg-background/50 border border-input rounded-lg"
          >
            <span className={`font-display font-black text-[1rem] w-6 text-center ${rankStyles[i] || "text-muted-foreground"}`}>
              {i === 0 ? <Crown size={16} className="text-gold-light inline" /> : i + 1}
            </span>
            <span className="flex-1 text-[0.8rem] text-foreground font-medium truncate">
              {maskEmail(entry.email)}
            </span>
            <div className="flex items-center gap-1 text-[0.72rem] text-muted-foreground">
              <Users size={12} />
              <span>
                {entry.referral_count} {entry.referral_count === 1 ? "referral" : "referrals"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
