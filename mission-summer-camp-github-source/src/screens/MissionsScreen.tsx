"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAppState } from "@/context/AppState";
import { getParentApprovedDailyStars } from "@/services/progression";
import { percent } from "@/utils/format";
import type { ParentAction } from "@/types";

type Props = {
  requestParent: (action: ParentAction, onApproved: () => void) => void;
};

export function MissionsScreen({ requestParent }: Props) {
  const { state, dispatch } = useAppState();
  const completed = state.missions.filter((mission) => mission.completed).length;
  const approved = state.missions.filter((mission) => mission.approved).length;
  const pendingStars = Math.max(0, getParentApprovedDailyStars(completed, state.missions.length) - getParentApprovedDailyStars(approved, state.missions.length));
  const pendingTasks = state.missions.filter((mission) => mission.completed && !mission.approved).length;

  return (
    <div className="space-y-4 px-4 pb-28 pt-5">
      <section className="gold-panel rounded-[1.8rem] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-black uppercase text-cyan-300">Daily Missions</p>
            <h1 className="text-3xl font-black uppercase text-amber-300">{completed}/{state.missions.length} complete</h1>
          </div>
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-violet-600 text-4xl shadow-glow">
            <i className="ti ti-clipboard-check" />
          </div>
        </div>
        <div className="mt-4 h-4 overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-300" animate={{ width: `${percent(completed, state.missions.length)}%` }} />
        </div>
        <div className="mt-3 rounded-2xl bg-black/20 p-3 text-sm font-bold text-slate-200">
          Your child marks completed tasks first. Stars stay pending until a parent approves them.
        </div>
      </section>

      <div className="space-y-3">
        {state.missions.map((mission) => (
          <motion.button
            key={mission.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => dispatch({ type: "TOGGLE_MISSION", missionId: mission.id })}
            className={`relative flex w-full items-center gap-3 overflow-hidden rounded-[1.35rem] border p-3 text-left ${
              mission.approved
                ? "border-emerald-300/40 bg-emerald-500/12"
                : mission.completed
                  ? "border-amber-300/60 bg-amber-300/10"
                  : "border-white/10 bg-white/5"
            }`}
          >
            <AnimatePresence>
              {mission.completed ? (
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7 }}
                />
              ) : null}
            </AnimatePresence>
            <span className={`relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-2xl ${mission.completed ? "bg-emerald-500" : "bg-violet-700"}`}>
              <i className={`ti ${mission.completed ? "ti-check" : mission.icon}`} />
            </span>
            <span className="relative min-w-0 flex-1">
              <span className="block text-base font-black text-white">{mission.title}</span>
              <span className="text-sm text-slate-400">{mission.subtitle}</span>
            </span>
            <span className="relative rounded-2xl bg-black/25 px-3 py-2 text-sm font-black text-amber-300">Task</span>
            {mission.approved ? (
              <span className="relative rounded-full bg-emerald-500 px-2 py-1 text-[0.65rem] font-black uppercase text-white">Approved</span>
            ) : mission.completed ? (
              <span className="relative rounded-full bg-amber-300 px-2 py-1 text-[0.65rem] font-black uppercase text-slate-950">Pending</span>
            ) : null}
          </motion.button>
        ))}
      </div>

      {pendingStars > 0 ? (
        <button type="button" className="btn-green w-full" onClick={() => requestParent("approve-stars", () => dispatch({ type: "APPROVE_MISSIONS" }))}>
          Parent approve {pendingTasks} task{pendingTasks === 1 ? "" : "s"} - +{pendingStars} stars
        </button>
      ) : (
        <div className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4 text-center">
          <div className="text-lg font-black uppercase text-amber-300">No stars waiting yet</div>
          <p className="mt-1 text-sm font-bold text-slate-300">Tap the tasks your child has completed. They will become pending for parent approval.</p>
        </div>
      )}
    </div>
  );
}
