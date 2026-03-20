import iconLogo from "@/assets/icon-logo.png";
import mascot from "@/assets/mascot.png";

const PhoneMockup = () => {
  return (
    <div className="relative inline-block">
      {/* Phone frame */}
      <div className="w-[268px] h-[536px] bg-[#040C18] rounded-[46px] border-2 border-foreground/[0.09] shadow-[0_32px_80px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.04)_inset,0_1px_0_rgba(255,255,255,0.07)_inset] relative overflow-hidden max-md:w-[230px] max-md:h-[460px]">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90px] h-6 bg-[#040C18] rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface to-background flex flex-col px-4 pt-10 gap-[11px]">
          {/* Top bar */}
          <div className="flex items-center justify-between px-0 pt-1.5 pb-0.5">
            <div className="flex items-center gap-[7px]">
              <div className="w-[26px] h-[26px] rounded-[7px] overflow-hidden flex-shrink-0">
                <img src={iconLogo} alt="Bullingo" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-black text-[0.78rem] text-foreground">Bullingo</span>
            </div>
            <div className="flex items-center gap-1 font-mono-dm text-[0.5rem] text-gold-light bg-gold/10 border border-gold/25 rounded-full px-2 py-[3px]">
              🔥 12 DAY STREAK
            </div>
          </div>

          {/* XP Bar */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between font-mono-dm text-[0.48rem] text-muted-foreground">
              <span>Level 4</span>
              <span>620 / 1000 XP</span>
            </div>
            <div className="h-[5px] bg-secondary rounded-sm overflow-hidden">
              <div className="h-full w-[62%] bg-gradient-to-r from-primary to-accent rounded-sm" />
            </div>
          </div>

          <div className="font-mono-dm text-[0.48rem] tracking-[0.12em] uppercase text-accent">Your path</div>

          {/* Module cards */}
          <div className="bg-gradient-to-br from-primary/20 to-secondary border border-primary-bright/30 rounded-xl p-[10px] flex items-center gap-[10px]">
            <div className="w-8 h-8 rounded-[9px] bg-primary flex items-center justify-center text-sm flex-shrink-0">📈</div>
            <div className="flex-1">
              <div className="text-[0.65rem] font-semibold text-foreground mb-1">Stock Basics</div>
              <div className="h-[3px] bg-foreground/[0.08] rounded-sm"><div className="h-full rounded-sm bg-accent" style={{ width: '80%' }} /></div>
            </div>
            <span className="font-mono-dm text-[0.44rem] tracking-[0.06em] px-1.5 py-0.5 rounded-full bg-primary/20 border border-primary-bright/30 text-accent">IN PROGRESS</span>
          </div>

          <div className="bg-secondary border border-foreground/[0.06] rounded-xl p-[10px] flex items-center gap-[10px]">
            <div className="w-8 h-8 rounded-[9px] bg-gold/20 border border-gold/30 flex items-center justify-center text-sm flex-shrink-0">💰</div>
            <div className="flex-1">
              <div className="text-[0.65rem] font-semibold text-foreground mb-1">Compound Interest</div>
              <div className="h-[3px] bg-foreground/[0.08] rounded-sm"><div className="h-full rounded-sm bg-accent" style={{ width: '30%' }} /></div>
            </div>
            <span className="font-mono-dm text-[0.44rem] tracking-[0.06em] px-1.5 py-0.5 rounded-full bg-gold/10 border border-gold/25 text-gold-light">NEW</span>
          </div>

          <div className="bg-secondary border border-foreground/[0.06] rounded-xl p-[10px] flex items-center gap-[10px]">
            <div className="w-8 h-8 rounded-[9px] bg-surface border border-foreground/[0.06] flex items-center justify-center text-sm flex-shrink-0">🔒</div>
            <div className="flex-1">
              <div className="text-[0.65rem] font-semibold text-foreground mb-1">ETFs & Index Funds</div>
              <div className="h-[3px] bg-foreground/[0.08] rounded-sm"><div className="h-full rounded-sm bg-accent" style={{ width: '0%' }} /></div>
            </div>
            <span className="font-mono-dm text-[0.44rem] tracking-[0.06em] px-1.5 py-0.5 rounded-full bg-foreground/[0.04] border border-foreground/[0.08] text-muted-foreground">LOCKED</span>
          </div>

          {/* Tab bar */}
          <div className="mt-auto flex bg-[#040C18]/[0.97] border-t border-foreground/[0.05] py-2 pb-[10px]">
            {[
              { icon: '🏠', label: 'Home', active: true },
              { icon: '📊', label: 'Learn', active: false },
              { icon: '🏆', label: 'Ranks', active: false },
              { icon: '👤', label: 'Profile', active: false },
            ].map((tab) => (
              <div key={tab.label} className="flex-1 flex flex-col items-center gap-0.5 text-[15px]">
                <span>{tab.icon}</span>
                <span className={`font-mono-dm text-[0.37rem] tracking-[0.08em] uppercase ${tab.active ? 'text-accent' : 'text-muted-foreground/50'}`}>{tab.label}</span>
                {tab.active && <div className="w-[3px] h-[3px] rounded-sm bg-accent" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mascot */}
      <img
        src={mascot}
        alt="Ingo mascot"
        className="absolute -bottom-7 -right-[52px] w-[155px] z-10 drop-shadow-[0_10px_28px_rgba(32,101,64,0.3)] animate-float pointer-events-none max-md:w-[120px] max-md:-bottom-5 max-md:-right-[38px]"
      />
    </div>
  );
};

export default PhoneMockup;
