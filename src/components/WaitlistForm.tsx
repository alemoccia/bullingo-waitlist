import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, ChevronRight, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AppleLogo = () => (
  <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-62.1 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

const AndroidLogo = () => (
  <svg width="14" height="14" viewBox="0 0 576 512" fill="currentColor">
    <path d="M420.55 301.93a24 24 0 1 1 24-24 24 24 0 0 1-24 24m-265.1 0a24 24 0 1 1 24-24 24 24 0 0 1-24 24m273.7-144.48 47.94-83a10 10 0 1 0-17.27-10l-48.54 84.07a306.32 306.32 0 0 0-134.28-29.51 306.56 306.56 0 0 0-134.28 29.51L94.46 64.45a10 10 0 0 0-17.27 10l47.94 83C55.68 196.63 8.14 267.09 0 348.86h576c-8.14-81.77-55.68-152.23-124.85-191.41z"/>
  </svg>
);

const platforms = [
  { id: "ios", label: "iOS", Icon: AppleLogo },
  { id: "android", label: "Android", Icon: AndroidLogo },
];

const WaitlistForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pick = (id: string) => setSelected(id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const refCode = searchParams.get("ref");

      const { data, error } = await supabase.functions.invoke("waitlist-signup", {
        body: {
          email,
          platform: selected,
          referred_by: refCode || null,
        },
      });

      if (error) {
        // Edge function returned an error response
        const msg = data?.error || "Something went wrong";
        if (msg.includes("already")) {
          toast.error(msg);
        } else {
          toast.error("Something went wrong", { description: "Please try again later." });
        }
        return;
      }

      navigate("/confirmed", {
        state: {
          email,
          position: data.position,
          referralCode: data.referralCode,
          referralLink: `${window.location.origin}?ref=${data.referralCode}`,
          totalWaiters: data.totalWaiters,
        },
      });
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full py-[13px] pr-4 pl-11 bg-secondary border border-input rounded-lg font-sans text-[0.88rem] text-foreground outline-none placeholder:text-muted-foreground transition-all duration-200 focus:border-primary-bright/30 focus:shadow-[0_0_0_3px_hsl(var(--primary-glow))]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[10px]">
      {/* Platform select */}
      <div className="flex items-center gap-2">
        <Smartphone size={14} className="text-muted-foreground flex-shrink-0" />
        <span className="font-mono-dm text-[0.52rem] tracking-[0.1em] uppercase text-muted-foreground mr-1">Platform</span>
        {platforms.map((p) => {
          const active = selected === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(p.id)}
              className={`flex items-center gap-2 rounded-lg py-[7px] px-3.5 text-[0.73rem] font-medium transition-all duration-200 border ${
                active
                  ? "bg-primary/20 border-primary-bright/30 text-accent"
                  : "bg-secondary border-input text-foreground hover:border-primary-bright/20"
              }`}
            >
              <p.Icon />
              {p.label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <span className="absolute left-[14px] top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          <Mail size={17} />
        </span>
        <input
          type="email"
          className={inputClass}
          placeholder="Email address..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-[13px] bg-primary text-foreground font-semibold text-[0.88rem] rounded-lg flex items-center justify-center gap-2 transition-all duration-200 hover:bg-primary-light hover:-translate-y-px active:translate-y-0 disabled:opacity-60 group"
      >
        {loading ? "Joining..." : "Get Early Access"}
        <ChevronRight size={15} className="transition-transform duration-150 group-hover:translate-x-[3px]" />
      </button>

      <p className="font-mono-dm text-[0.62rem] tracking-[0.04em] text-muted-foreground">
        <strong className="text-gold-light font-medium">Refer friends</strong> to move up the list — the more you share, the sooner you're in.
      </p>
      <p className="font-mono-dm text-[0.6rem] tracking-[0.04em] text-muted-foreground/50">
        No spam. Unsubscribe anytime.
      </p>
    </form>
  );
};

export default WaitlistForm;
