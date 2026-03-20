import { useLocation, useNavigate } from "react-router-dom";
import { Check, Copy, Share2, ArrowLeft, Twitter, MessageCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import iconLogo from "@/assets/icon-logo.png";
import Leaderboard from "@/components/Leaderboard";

const Confirmed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const email = location.state?.email || "";
  const position = location.state?.position || null;
  // TODO: Waitlister may return a referral token/URL — wire it here
  const referralCode = location.state?.referralCode || "BULL-XXXX";
  const referralLink = location.state?.referralLink || `${window.location.origin}?ref=${referralCode}`;
  const totalWaiters = location.state?.totalWaiters || null;

  const copyLink = async () => {
    await navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = encodeURIComponent("I just joined the Bullingo waitlist! Learn to invest the fun way 📈🐂\nJoin me:");
    const url = encodeURIComponent(referralLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`I just joined the Bullingo waitlist! Learn to invest the fun way 📈🐂 Join me: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "Join Bullingo",
        text: "I just joined the Bullingo waitlist! Learn to invest the fun way.",
        url: referralLink,
      });
    } else {
      copyLink();
    }
  };

  return (
    <section className="w-full min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <div className="grid-overlay" />
      <div className="radial-glow" />

      <div className="relative z-20 max-w-[480px] w-full flex flex-col items-center gap-8 animate-fade-up">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-[42px] h-[42px] rounded-[11px] overflow-hidden flex-shrink-0">
            <img src={iconLogo} alt="Bullingo logo" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-black text-[1.4rem] text-foreground tracking-tight">Bullingo</span>
        </div>

        {/* Success icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-accent flex items-center justify-center">
            <Check size={36} className="text-accent" strokeWidth={3} />
          </div>
          <div className="absolute -inset-3 rounded-full border border-accent/20 animate-[pulse-ring_2s_ease-out_infinite]" />
        </div>

        {/* Headline */}
        <div className="text-center flex flex-col gap-3">
          <h1 className="font-display font-black text-[2rem] text-foreground leading-tight tracking-tight">
            You're on the list!
          </h1>
          {email && (
            <p className="text-[0.85rem] text-muted-foreground">
              Confirmation sent to <span className="text-foreground font-medium">{email}</span>
            </p>
          )}
        {position && (
            <div className="w-full bg-secondary border border-input rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-mono-dm text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground">Your position</span>
                <span className="font-display font-black text-[1.8rem] text-accent leading-none">#{position}</span>
              </div>

              {/* Progress bar */}
              <div className="flex flex-col gap-2">
                <div className="w-full h-2 bg-background rounded-full overflow-hidden border border-input">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(5, Math.min(95, 100 - (position / (totalWaiters || 1)) * 100))}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-dm text-[0.55rem] tracking-[0.08em] text-muted-foreground">
                    {position === 1 ? "You're first! 🎉" : `${position - 1} ${position - 1 === 1 ? "person" : "people"} ahead of you`}
                  </span>
                  <span className="font-mono-dm text-[0.55rem] tracking-[0.08em] text-muted-foreground">
                    {totalWaiters ? `${totalWaiters} total` : ""}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Referral section */}
        <div className="w-full bg-secondary border border-input rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono-dm text-[0.58rem] tracking-[0.2em] uppercase text-accent flex items-center gap-2">
              <span className="w-[18px] h-px bg-accent" />
              Move up the list
            </span>
            <p className="text-[0.85rem] text-foreground leading-relaxed">
              Share your unique link. Each friend who joins bumps you higher on the waitlist.
            </p>
          </div>

          {/* Referral link */}
          <div className="flex items-center gap-2">
            <div className="flex-1 py-[11px] px-4 bg-background border border-input rounded-lg font-mono-dm text-[0.72rem] text-muted-foreground truncate">
              {referralLink}
            </div>
            <button
              onClick={copyLink}
              className="flex-shrink-0 py-[11px] px-4 bg-primary text-foreground rounded-lg flex items-center gap-2 text-[0.8rem] font-semibold transition-all duration-200 hover:bg-primary-light hover:-translate-y-px active:translate-y-0"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={shareTwitter}
              className="flex-1 py-[10px] bg-background border border-input rounded-lg flex items-center justify-center gap-2 text-[0.75rem] font-medium text-foreground transition-all duration-200 hover:border-primary-bright/20"
            >
              <Twitter size={14} />
              Twitter
            </button>
            <button
              onClick={shareWhatsApp}
              className="flex-1 py-[10px] bg-background border border-input rounded-lg flex items-center justify-center gap-2 text-[0.75rem] font-medium text-foreground transition-all duration-200 hover:border-primary-bright/20"
            >
              <MessageCircle size={14} />
              WhatsApp
            </button>
            <button
              onClick={shareNative}
              className="flex-1 py-[10px] bg-background border border-input rounded-lg flex items-center justify-center gap-2 text-[0.75rem] font-medium text-foreground transition-all duration-200 hover:border-primary-bright/20"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <Leaderboard />

        {/* Tip */}
        <p className="font-mono-dm text-[0.62rem] tracking-[0.04em] text-muted-foreground text-center">
          <strong className="text-gold-light font-medium">Pro tip:</strong> The more friends you refer, the sooner you get early access.
        </p>

        {/* Back */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[0.8rem] text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} />
          Back to home
        </button>
      </div>
    </section>
  );
};

export default Confirmed;
