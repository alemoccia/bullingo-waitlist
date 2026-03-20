import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, TrendingUp, Smartphone, Link2, CalendarDays, Shield, ArrowRight, RefreshCw, Download } from "lucide-react";

interface Signup {
  id: string;
  email: string;
  platform: string | null;
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  position: number;
  created_at: string;
}

interface Stats {
  total: number;
  ios: number;
  android: number;
  noPlatform: number;
  withReferrals: number;
  referredUsers: number;
  todaySignups: number;
}

const Admin = () => {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [signups, setSignups] = useState<Signup[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [referralMap, setReferralMap] = useState<Record<string, string[]>>({});
  const [emailMap, setEmailMap] = useState<Record<string, string>>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("admin-data", {
        headers: { "x-admin-password": password },
      });
      if (fnError) throw fnError;
      if (data.error) {
        if (data.error === "Unauthorized") {
          setError("Wrong password");
          setAuthenticated(false);
          return;
        }
        throw new Error(data.error);
      }
      setSignups(data.signups);
      setStats(data.stats);
      setReferralMap(data.referralMap);
      setEmailMap(data.emailMap);
      setLastUpdate(new Date());
      setAuthenticated(true);
    } catch {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    await fetchData();
  };

  // Realtime subscription
  useEffect(() => {
    if (!authenticated) return;
    const channel = supabase
      .channel("admin-waitlist")
      .on("postgres_changes", { event: "*", schema: "public", table: "waitlist_signups" }, () => {
        fetchData();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [authenticated, fetchData]);

  if (!authenticated) {
    return (
      <section className="w-full min-h-screen flex items-center justify-center p-6 bg-background">
        <form onSubmit={handleLogin} className="w-full max-w-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
            <Shield size={28} className="text-accent" />
            <h1 className="font-display font-black text-2xl text-foreground">Admin Panel</h1>
          </div>
          <input
            type="password"
            placeholder="Enter admin password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full py-3 px-4 bg-secondary border border-input rounded-lg text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary-bright/30"
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-foreground font-semibold text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-primary-light transition-all disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Access Dashboard"}
            <ArrowRight size={15} />
          </button>
        </form>
      </section>
    );
  }

  const exportCSV = () => {
    if (!signups.length) return;
    const headers = ["Position", "Email", "Platform", "Referral Code", "Referred By", "Referral Count", "Joined"];
    const rows = signups.map((s) => [
      s.position,
      s.email,
      s.platform || "",
      s.referral_code,
      s.referred_by ? (emailMap[s.referred_by] || s.referred_by) : "",
      s.referral_count,
      new Date(s.created_at).toISOString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const topReferrers = [...signups].sort((a, b) => b.referral_count - a.referral_count).filter((s) => s.referral_count > 0).slice(0, 10);

  return (
    <section className="w-full min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-accent" />
            <h1 className="font-display font-black text-xl text-foreground">Bullingo Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="font-mono-dm text-[0.6rem] text-muted-foreground">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <button onClick={exportCSV} className="p-2 rounded-lg bg-secondary border border-input hover:border-primary-bright/20 transition-all" title="Export CSV">
              <Download size={14} className="text-muted-foreground" />
            </button>
            <button onClick={fetchData} className="p-2 rounded-lg bg-secondary border border-input hover:border-primary-bright/20 transition-all">
              <RefreshCw size={14} className={`text-muted-foreground ${loading ? "animate-spin" : ""}`} />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/20 border border-accent/30">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="font-mono-dm text-[0.6rem] text-accent tracking-wider uppercase">Live</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Signups", value: stats.total, icon: Users, color: "text-accent" },
              { label: "Today", value: stats.todaySignups, icon: CalendarDays, color: "text-gold-light" },
              { label: "Referrals Made", value: stats.referredUsers, icon: Link2, color: "text-accent" },
              { label: "Active Referrers", value: stats.withReferrals, icon: TrendingUp, color: "text-gold-light" },
            ].map((stat) => (
              <div key={stat.label} className="bg-secondary border border-input rounded-xl p-4 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <stat.icon size={14} className={stat.color} />
                  <span className="font-mono-dm text-[0.55rem] tracking-[0.1em] uppercase text-muted-foreground">{stat.label}</span>
                </div>
                <span className={`font-display font-black text-2xl ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Platform breakdown */}
        {stats && (
          <div className="bg-secondary border border-input rounded-xl p-4">
            <span className="font-mono-dm text-[0.55rem] tracking-[0.1em] uppercase text-muted-foreground mb-3 block">Platform Breakdown</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-foreground" />
                <span className="text-sm text-foreground">iOS: <strong className="text-accent">{stats.ios}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone size={14} className="text-foreground" />
                <span className="text-sm text-foreground">Android: <strong className="text-accent">{stats.android}</strong></span>
              </div>
              <span className="text-sm text-muted-foreground">No preference: {stats.noPlatform}</span>
            </div>
            {stats.total > 0 && (
              <div className="mt-3 flex h-3 rounded-full overflow-hidden border border-input">
                <div className="bg-accent" style={{ width: `${(stats.ios / stats.total) * 100}%` }} />
                <div className="bg-gold" style={{ width: `${(stats.android / stats.total) * 100}%` }} />
                <div className="bg-muted-foreground/30 flex-1" />
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top referrers */}
          <div className="bg-secondary border border-input rounded-xl p-4">
            <span className="font-mono-dm text-[0.55rem] tracking-[0.1em] uppercase text-muted-foreground mb-3 block">Top Referrers</span>
            {topReferrers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No referrals yet</p>
            ) : (
              <div className="flex flex-col gap-2">
                {topReferrers.map((s, i) => (
                  <div key={s.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-background/50 border border-input">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-black text-sm text-accent w-6">#{i + 1}</span>
                      <span className="text-sm text-foreground truncate max-w-[200px]">{s.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={12} className="text-muted-foreground" />
                      <span className="font-mono-dm text-xs text-accent font-medium">{s.referral_count}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Referral chains */}
          <div className="bg-secondary border border-input rounded-xl p-4">
            <span className="font-mono-dm text-[0.55rem] tracking-[0.1em] uppercase text-muted-foreground mb-3 block">Referral Chains</span>
            {Object.keys(referralMap).length === 0 ? (
              <p className="text-sm text-muted-foreground">No referral chains yet</p>
            ) : (
              <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto">
                {Object.entries(referralMap).map(([referrerId, referredIds]) => (
                  <div key={referrerId} className="py-2 px-3 rounded-lg bg-background/50 border border-input">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-accent font-medium truncate max-w-[200px]">{emailMap[referrerId]}</span>
                      <span className="font-mono-dm text-[0.55rem] text-muted-foreground">referred {referredIds.length}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-4">
                      {referredIds.map((rid) => (
                        <span key={rid} className="text-[0.65rem] text-muted-foreground bg-secondary px-2 py-0.5 rounded border border-input truncate max-w-[180px]">
                          → {emailMap[rid]}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Full table */}
        <div className="bg-secondary border border-input rounded-xl overflow-hidden">
          <div className="p-4 border-b border-input">
            <span className="font-mono-dm text-[0.55rem] tracking-[0.1em] uppercase text-muted-foreground">All Signups ({signups.length})</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-input">
                  {["#", "Email", "Platform", "Referral Code", "Referred By", "Referrals", "Joined"].map((h) => (
                    <th key={h} className="text-left py-3 px-4 font-mono-dm text-[0.55rem] tracking-[0.1em] uppercase text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signups.map((s) => (
                  <tr key={s.id} className="border-b border-input/50 hover:bg-background/30 transition-colors">
                    <td className="py-3 px-4 font-display font-bold text-accent">#{s.position}</td>
                    <td className="py-3 px-4 text-foreground">{s.email}</td>
                    <td className="py-3 px-4">
                      {s.platform ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${s.platform === "ios" ? "border-accent/30 text-accent bg-accent/10" : "border-gold/30 text-gold-light bg-gold/10"}`}>
                          {s.platform}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono-dm text-xs text-muted-foreground">{s.referral_code}</td>
                    <td className="py-3 px-4 text-xs text-muted-foreground truncate max-w-[150px]">
                      {s.referred_by ? emailMap[s.referred_by] || s.referred_by : "—"}
                    </td>
                    <td className="py-3 px-4">
                      {s.referral_count > 0 ? (
                        <span className="text-accent font-medium">{s.referral_count}</span>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono-dm text-xs text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString()} {new Date(s.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admin;
