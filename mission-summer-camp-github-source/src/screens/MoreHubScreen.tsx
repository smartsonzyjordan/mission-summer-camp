"use client";

import { certificates, ranks } from "@/data/content";
import { CertificateArtwork, downloadCertificatePng } from "@/components/CertificateArtwork";
import { useAppState } from "@/context/AppState";
import { VisualAsset } from "@/components/VisualAsset";
import { MiniGamesHub } from "@/games/MiniGamesHub";
import type { GameId, MoreTab, ParentAction } from "@/types";

type Props = {
  requestParent: (action: ParentAction, onApproved: () => void) => void;
  openGame: (game: GameId) => void;
};

export function MoreHubScreen({ requestParent, openGame }: Props) {
  const { state, dispatch } = useAppState();
  const tabs: [MoreTab, string, string][] = [
    ["certs", "ti-certificate", "Certs"],
    ["analytics", "ti-chart-bar", "Stats"],
    ["games", "ti-device-gamepad-2", "Games"],
    ["final", "ti-confetti", "Final"]
  ];

  return (
    <div className="space-y-4 px-4 pb-28 pt-5">
      <div className="grid grid-cols-4 gap-2">
        {tabs.map(([tab, icon, label]) => (
          <button
            key={tab}
            type="button"
            className={`h-12 rounded-2xl text-xs font-black uppercase ${state.activeMoreTab === tab ? "bg-violet-600 text-white shadow-glow" : "bg-white/10 text-slate-300"}`}
            onClick={() => dispatch({ type: "SET_MORE_TAB", tab })}
          >
            <i className={`ti ${icon} mr-1`} />
            {label}
          </button>
        ))}
      </div>

      {state.activeMoreTab === "certs" ? <Certificates /> : null}
      {state.activeMoreTab === "analytics" ? <Analytics requestParent={requestParent} /> : null}
      {state.activeMoreTab === "games" ? <MiniGamesHub openGame={openGame} /> : null}
      {state.activeMoreTab === "final" ? <FinalCeremony /> : null}
    </div>
  );
}

function Certificates() {
  const { state } = useAppState();
  return (
    <section className="space-y-3">
      <div className="gold-panel rounded-[1.8rem] p-4 text-center">
        <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Certificate Vault</p>
        <h1 className="text-3xl font-black uppercase text-amber-300">Your achievements</h1>
      </div>
      {certificates.map((cert) => {
        const earned = state.unlockedCertificates.includes(cert.id);
        return (
          <article
            key={cert.id}
            className={`overflow-hidden rounded-[1.35rem] border ${
              earned ? "border-amber-300/70 bg-amber-50 text-slate-950 shadow-gold" : "border-white/10 bg-white/5 text-white opacity-75"
            }`}
          >
            <CertificateArtwork cert={cert} childName={state.childName} locked={!earned} />
            <div className="flex items-center gap-3 p-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-black uppercase">{cert.name}</h2>
                <p className="text-xs font-bold opacity-75">{earned ? "Unlocked and ready to download" : `Unlocks at ${cert.starsRequired} stars`}</p>
              </div>
              {earned ? (
                <button
                  type="button"
                  onClick={() => void downloadCertificatePng(cert, state.childName)}
                  className="grid h-11 w-11 place-items-center rounded-full bg-slate-950 text-xl text-white"
                  aria-label={`Download ${cert.name}`}
                >
                  <i className="ti ti-download" />
                </button>
              ) : (
                <button type="button" className="grid h-11 w-11 place-items-center rounded-full bg-slate-950/70 text-xl text-white" disabled aria-label={`${cert.name} locked`}>
                  <i className="ti ti-lock" />
                </button>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}

function Analytics({ requestParent }: { requestParent: (action: ParentAction, onApproved: () => void) => void }) {
  const { state } = useAppState();
  const days = Object.entries(state.analytics).slice(-7);
  const completion = Math.round((state.missions.filter((mission) => mission.approved).length / state.missions.length) * 100);
  return (
    <section className="panel rounded-[1.8rem] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Parent Analytics</p>
          <h1 className="text-3xl font-black uppercase text-amber-300">Progress Report</h1>
        </div>
        <button type="button" className="rounded-2xl bg-white/10 px-3 py-2 text-xl" onClick={() => requestParent("analytics", () => undefined)}>
          <i className="ti ti-lock-access" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          ["Total stars", state.stars],
          ["Completion", `${completion}%`],
          ["Longest streak", state.longestStreak],
          ["Journal entries", state.journalEntries.length]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white/5 p-3">
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="text-xs font-black uppercase text-slate-400">{label}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {(days.length ? days : ([["Today", completion]] as [string, number][])).map(([day, value]) => (
          <div key={day} className="grid grid-cols-[4rem_1fr] items-center gap-3">
            <span className="text-xs font-black text-slate-300">{day.slice(5) || day}</span>
            <span className="h-5 overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-300" style={{ width: `${value}%` }} />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCeremony() {
  const { state, dispatch } = useAppState();
  const activeRank = ranks.find((rank) => rank.id === state.activeRankId) ?? ranks[0];
  const completion = Math.round((state.missions.filter((mission) => mission.approved).length / state.missions.length) * 100);
  return (
    <section className="gold-panel relative overflow-hidden rounded-[1.8rem] p-4 text-center">
      <p className="text-lg font-black uppercase tracking-widest text-white">Final Mission Complete</p>
      <h1 className="mt-1 text-4xl font-black uppercase leading-tight text-amber-300">Space Legend {state.childName || "Cadet"}</h1>
      <VisualAsset src="/assets/astronaut.svg" alt="Celebrating astronaut" className="mx-auto my-3 h-56 w-56 drop-shadow-2xl" />
      <div className="grid grid-cols-2 gap-2 text-left">
        {[
          ["ti-star-filled", state.stars, "Total stars earned"],
          ["ti-circle-check", `${completion}%`, "Missions completed"],
          ["ti-shield-star", activeRank.name, "Current rank"],
          ["ti-flame", `${state.longestStreak} days`, "Longest streak"]
        ].map(([icon, value, label]) => (
          <div key={label} className="rounded-2xl bg-white/10 p-3">
            <i className={`ti ${icon} text-2xl text-amber-300`} />
            <div className="text-xl font-black text-white">{value}</div>
            <div className="text-[0.68rem] font-black uppercase text-slate-300">{label}</div>
          </div>
        ))}
      </div>
      <div className="my-4 rounded-full bg-emerald-600 px-4 py-3 text-lg font-black uppercase text-white">You did it. We are so proud of you.</div>
      <button type="button" className="btn-primary w-full" onClick={() => dispatch({ type: "SET_SCREEN", screen: "home" })}>
        Back to Home
      </button>
    </section>
  );
}
