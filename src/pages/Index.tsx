import iconLogo from "@/assets/icon-logo.png";
import PhoneMockup from "@/components/PhoneMockup";
import WaitlistForm from "@/components/WaitlistForm";

const Index = () => {
  return (
    <section className="w-full min-h-screen flex items-center justify-center p-12 max-md:p-6 relative overflow-hidden">
      <div className="grid-overlay" />
      <div className="radial-glow" />

      <div className="max-w-[1160px] w-full mx-auto relative z-20 flex flex-col gap-10">
        {/* Top badge */}
        <div className="flex justify-center animate-fade-down">
          <div className="inline-flex items-center gap-2 bg-primary/[0.18] border border-primary-bright/30 rounded-full py-[7px] px-[18px] font-mono-dm text-[0.6rem] tracking-[0.15em] uppercase text-accent">
            <div className="relative w-[7px] h-[7px]">
              <div className="absolute inset-0 rounded-full bg-accent" />
              <div className="absolute -inset-[3px] rounded-full bg-accent opacity-0 animate-[pulse-ring_2s_ease-out_infinite]" />
            </div>
            Early Access — Join the waitlist
          </div>
        </div>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-[72px] items-center max-md:grid-cols-1 max-md:gap-12">
          {/* Left */}
          <div className="flex flex-col gap-[22px] animate-fade-up max-md:order-2">
            {/* Logo */}
            <div className="flex items-center gap-[11px]">
              <div className="w-[42px] h-[42px] rounded-[11px] overflow-hidden flex-shrink-0">
                <img src={iconLogo} alt="Bullingo logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-black text-[1.4rem] text-foreground tracking-tight">Bullingo</span>
            </div>

            {/* Eyebrow */}
            <span className="font-mono-dm text-[0.58rem] tracking-[0.2em] uppercase text-accent flex items-center gap-[10px]">
              <span className="w-[22px] h-px bg-accent" />
              Investing, reinvented
            </span>

            {/* Headline */}
            <h1 className="font-display font-black text-foreground leading-[0.94] tracking-tight" style={{ fontSize: 'clamp(2.2rem, 3.5vw, 3.4rem)' }}>
              The Duolingo
              <span className="block text-accent italic">for</span>
              <span className="block bg-gradient-to-br from-gold via-[#FBE8A0] to-gold bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">investing.</span>
            </h1>

            {/* Subhead */}
            <p className="text-[0.95rem] font-normal leading-[1.72] text-foreground max-w-[400px]">
              Bullingo makes learning to invest as easy as your favourite app.
              Bite-sized daily lessons, real skills, zero jargon.
            </p>

            {/* Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: '📈', label: 'STOCKS', text: 'Learn to invest' },
                { icon: '⚡', label: '5 MIN', text: 'Daily lessons' },
                { icon: '🏆', label: 'FREE', text: 'Always' },
              ].map((pill) => (
                <div key={pill.label} className="flex items-center gap-1.5 bg-secondary border border-input rounded-lg py-[7px] px-[13px] text-[0.73rem] text-foreground">
                  {pill.icon} <span className="font-mono-dm text-[0.52rem] text-accent tracking-[0.05em]">{pill.label}</span> {pill.text}
                </div>
              ))}
            </div>

            {/* Form */}
            <WaitlistForm />
          </div>

          {/* Right */}
          <div className="flex justify-center items-center animate-fade-up max-md:order-1" style={{ animationDelay: '0.25s' }}>
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Index;
