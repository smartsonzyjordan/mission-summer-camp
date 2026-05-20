"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppState } from "@/context/AppState";
import { BrandHeader } from "@/components/BrandHeader";
import { CelebrationOverlay } from "@/components/CelebrationOverlay";
import { ParentGateModal } from "@/components/ParentGateModal";
import { ProfileSetup } from "@/components/ProfileSetup";
import { PwaRegister } from "@/components/PwaRegister";
import { Starfield } from "@/components/Starfield";
import { VisualAsset } from "@/components/VisualAsset";
import { GameModal } from "@/games/GameModal";
import { CoachScreen } from "@/screens/CoachScreen";
import { DashboardScreen } from "@/screens/DashboardScreen";
import { JournalScreen } from "@/screens/JournalScreen";
import { MissionsScreen } from "@/screens/MissionsScreen";
import { MoreHubScreen } from "@/screens/MoreHubScreen";
import { PlannerScreen } from "@/screens/PlannerScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { RewardsScreen } from "@/screens/RewardsScreen";
import type { GameId, ParentAction, ScreenId } from "@/types";

const nav: { id: ScreenId; icon: string; label: string }[] = [
  { id: "home", icon: "ti-home", label: "Home" },
  { id: "missions", icon: "ti-clipboard-check", label: "Missions" },
  { id: "planner", icon: "ti-clock", label: "Planner" },
  { id: "rewards", icon: "ti-gift", label: "Rewards" },
  { id: "journal", icon: "ti-notebook", label: "Journal" },
  { id: "coach", icon: "ti-robot", label: "Coach" },
  { id: "more", icon: "ti-grid-dots", label: "More" },
  { id: "profile", icon: "ti-user-circle", label: "Profile" }
];

type GateRequest = {
  action: ParentAction;
  onApproved: () => void;
};

export function AppShell() {
  const { state, dispatch, hydrated } = useAppState();
  const [gate, setGate] = useState<GateRequest | null>(null);
  const [activeGame, setActiveGame] = useState<GameId | null>(null);

  const screenTitle = useMemo(() => {
    const current = nav.find((item) => item.id === state.activeScreen);
    return current?.label ?? "Mission";
  }, [state.activeScreen]);

  const requestParent = (action: ParentAction, onApproved: () => void) => setGate({ action, onApproved });

  if (!hydrated) {
    return <div className="grid min-h-dvh place-items-center bg-[#050616] text-amber-300">Loading mission control...</div>;
  }

  if (!state.childSessionStarted) {
    return <ProfileSetup />;
  }

  return (
    <main className="relative min-h-dvh overflow-hidden galaxy-bg">
      <PwaRegister />
      <Starfield />
      <div className="relative z-10 mx-auto w-full max-w-6xl p-0 md:p-6">
        <div className="tablet-grid">
          <section className="phone-frame relative mx-auto min-h-dvh w-full max-w-md overflow-hidden bg-[#050616]/80 md:min-h-[860px] md:rounded-[2.2rem]">
            <BrandHeader
              kicker={screenTitle === "Home" ? undefined : screenTitle}
              back={state.activeScreen === "home" ? undefined : () => dispatch({ type: "SET_SCREEN", screen: "home" })}
              right={
                <span className="flex items-center gap-1 text-lg font-black text-white">
                  <i className="ti ti-star-filled text-amber-300" />
                  {state.stars}
                </span>
              }
            />
            <AnimatePresence mode="wait">
              <motion.div key={state.activeScreen} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.22 }}>
                {state.activeScreen === "home" ? <DashboardScreen requestParent={requestParent} /> : null}
                {state.activeScreen === "missions" ? <MissionsScreen requestParent={requestParent} /> : null}
                {state.activeScreen === "planner" ? <PlannerScreen /> : null}
                {state.activeScreen === "rewards" ? <RewardsScreen requestParent={requestParent} /> : null}
                {state.activeScreen === "journal" ? <JournalScreen /> : null}
                {state.activeScreen === "coach" ? <CoachScreen /> : null}
                {state.activeScreen === "more" ? <MoreHubScreen requestParent={requestParent} openGame={setActiveGame} /> : null}
                {state.activeScreen === "profile" ? <ProfileScreen requestParent={requestParent} /> : null}
              </motion.div>
            </AnimatePresence>
            <BottomNav />
          </section>

          <aside className="hidden md:block">
            <div className="gold-panel sticky top-6 rounded-[2rem] p-5">
              <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Tablet Command Center</p>
              <h2 className="mt-1 text-4xl font-black uppercase text-amber-300">Galaxy Journey</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Metric icon="ti-star-filled" value={state.stars} label="Stars" />
                <Metric icon="ti-flame" value={state.streak} label="Streak" />
                <Metric icon="ti-gift" value={Object.values(state.rewards).filter((reward) => reward.unlocked).length} label="Rewards" />
                <Metric icon="ti-certificate" value={state.unlockedCertificates.length} label="Certs" />
              </div>
              <VisualAsset src="/assets/dashboard.svg" alt="Mission dashboard art" className="mt-5 h-72 w-full rounded-[1.5rem]" />
            </div>
          </aside>
        </div>
      </div>

      {gate ? <ParentGateModal action={gate.action} onApproved={gate.onApproved} onClose={() => setGate(null)} /> : null}
      {activeGame ? <GameModal game={activeGame} onClose={() => setActiveGame(null)} /> : null}
      <CelebrationOverlay />
    </main>
  );
}

function BottomNav() {
  const { state, dispatch } = useAppState();
  return (
    <nav className="safe-bottom absolute inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#081127]/95 px-2 pt-2 backdrop-blur-xl">
      <div className="grid grid-cols-8 gap-1">
        {nav.map((item) => {
          const active = state.activeScreen === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl text-[0.56rem] font-bold ${active ? "text-fuchsia-300" : "text-slate-300"}`}
              onClick={() => dispatch({ type: "SET_SCREEN", screen: item.id })}
            >
              <i className={`ti ${item.icon} text-xl ${active ? "drop-shadow" : ""}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Metric({ icon, value, label }: { icon: string; value: number | string; label: string }) {
  return (
    <div className="rounded-3xl bg-white/10 p-4">
      <i className={`ti ${icon} text-3xl text-amber-300`} />
      <div className="mt-2 text-3xl font-black text-white">{value}</div>
      <div className="text-xs font-black uppercase text-slate-300">{label}</div>
    </div>
  );
}
