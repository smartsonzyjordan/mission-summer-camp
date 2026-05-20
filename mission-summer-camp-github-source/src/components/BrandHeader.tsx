import type { ReactNode } from "react";

type BrandHeaderProps = {
  kicker?: string;
  right?: ReactNode;
  back?: () => void;
};

export function BrandHeader({ kicker, right, back }: BrandHeaderProps) {
  return (
    <header className="relative z-10 flex items-start justify-between gap-3 px-4 pt-4">
      <button
        type="button"
        onClick={back}
        className={`grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-xl text-white ${back ? "" : "invisible"}`}
        aria-label="Back"
      >
        <i className="ti ti-arrow-left" />
      </button>
      <div className="text-center">
        <div className="brand-title text-[1.55rem] text-white">Mission</div>
        <div className="brand-title text-[1.82rem] text-amber-300 drop-shadow">Summer Camp</div>
        <div className="text-[0.78rem] font-black uppercase tracking-[0.18em] text-cyan-300">Galaxy Journey</div>
        {kicker ? <div className="mt-2 text-sm font-black uppercase text-white">{kicker}</div> : null}
      </div>
      <div className="grid h-10 min-w-10 place-items-center rounded-2xl border border-white/10 bg-white/5 px-2">{right}</div>
    </header>
  );
}
