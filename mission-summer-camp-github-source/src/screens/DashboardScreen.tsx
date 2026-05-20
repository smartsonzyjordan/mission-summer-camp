"use client";

import { motion } from "framer-motion";
import { ranks } from "@/data/content";
import { useAppState } from "@/context/AppState";
import { getNextRank } from "@/services/progression";
import { percent } from "@/utils/format";
import { VisualAsset } from "@/components/VisualAsset";
import type { ParentAction } from "@/types";

type Props = {
  requestParent: (action: ParentAction, onApproved: () => void) => void;
};

export function DashboardScreen({ requestParent }: Props) {
  const { state, dispatch } = useAppState();
  const activeRank = ranks.find((rank) => rank.id === state.activeRankId) ?? ranks[0];
  const nextRank = getNextRank(state.stars);
  const completed = state.missions.filter((mission) => mission.completed).length;
  const approved = state.missions.filter((mission) => mission.approved).length;
  const rankProgress = nextRank ? percent(state.stars - activeRank.starsRequired, nextRank.starsRequired - activeRank.starsRequired) : 100;

  return (
    <div className="space-y-4 px-4 pb-28 pt-5">
      <section className="gold-panel overflow-hidden rounded-[1.8rem] p-4">
        <div className="grid grid-cols-[1fr_8rem] items-center gap-3">
          <div>
            <p className="text-sm font-black uppercase text-amber-200">Good morning, Cadet {state.childName || ""}</p>
            <h1 className="mt-1 text-4xl font-black uppercase leading-none text-white">Mission Control</h1>
            {state.childDescription ? <p className="mt-2 line-clamp-2 text-sm font-bold text-slate-300">{state.childDescription}</p> : null}
            <div className="mt-3 flex items-center gap-3">
              <motion.div animate={{ rotate: [0, 12, -10, 0], scale: [1, 1.16, 1] }} transition={{ duration: 2.4, repeat: Infinity }} className="text-5xl text-amber-300">
                <i className="ti ti-star-filled" />
              </motion.div>
              <div>
                <div className="text-5xl font-black text-amber-300">{state.stars}</div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-300">Total stars</div>
              </div>
            </div>
          </div>
          <VisualAsset src="/assets/astronaut.svg" alt="Astronaut cadet" className="h-32 w-32 drop-shadow-2xl" />
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-amber-300 via-fuchsia-400 to-cyan-300" initial={{ width: 0 }} animate={{ width: `${rankProgress}%` }} />
        </div>
        <p className="mt-2 text-xs font-bold text-slate-300">{nextRank ? `${nextRank.starsRequired - state.stars} stars to ${nextRank.name}` : "Space Legend rank complete"}</p>
      </section>

      <section className="grid grid-cols-3 gap-2">
        {[
          ["ti-flame", state.streak, "Day streak"],
          ["ti-circle-check", completed, "Done today"],
          ["ti-rosette-discount-check", approved, "Approved"]
        ].map(([icon, value, label]) => (
          <div key={String(label)} className="panel rounded-3xl p-3 text-center">
            <i className={`${icon} text-2xl text-cyan-300`} />
            <div className="mt-1 text-2xl font-black text-white">{value}</div>
            <div className="text-[0.68rem] font-bold uppercase text-slate-400">{label}</div>
          </div>
        ))}
      </section>

      <section className="panel rounded-[1.8rem] p-4">
        <div className="flex items-center gap-3">
          <VisualAsset src={activeRank.image} alt={activeRank.name} className="h-16 w-16 rounded-2xl" />
          <div className="min-w-0 flex-1">
            <div className="text-xs font-black uppercase tracking-widest text-cyan-300">Current rank</div>
            <div className="text-2xl font-black uppercase" style={{ color: activeRank.color }}>
              {activeRank.name}
            </div>
          </div>
          <button
            type="button"
            className="grid h-12 w-12 place-items-center rounded-2xl bg-white/10 text-xl"
            onClick={() => requestParent("parent-settings", () => undefined)}
            aria-label="Parent settings"
          >
            <i className="ti ti-settings" />
          </button>
        </div>
      </section>

      <section className="panel rounded-[1.8rem] p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black uppercase text-white">Today&apos;s Missions</h2>
          <button type="button" className="text-sm font-black text-cyan-300" onClick={() => dispatch({ type: "SET_SCREEN", screen: "missions" })}>
            View all
          </button>
        </div>
        <div className="space-y-2">
          {state.missions.slice(0, 5).map((mission) => (
            <button
              key={mission.id}
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_MISSION", missionId: mission.id })}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left"
            >
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${mission.completed ? "bg-emerald-500" : "bg-violet-600/60"}`}>
                <i className={`ti ${mission.completed ? "ti-check" : mission.icon}`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-black text-white">{mission.title}</span>
                <span className="text-xs text-slate-400">{mission.subtitle}</span>
              </span>
              <span className="text-sm font-black text-amber-300">+{mission.stars}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
