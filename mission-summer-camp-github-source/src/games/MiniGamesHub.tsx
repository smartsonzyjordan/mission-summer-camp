"use client";

import { gameUnlocks } from "@/data/content";
import { useAppState } from "@/context/AppState";
import type { GameId } from "@/types";

const gameCards: { id: GameId; title: string; subtitle: string; icon: string; art: string }[] = [
  { id: "rocket-runner", title: "Rocket Runner", subtitle: "Run, jump, collect stars", icon: "ti-rocket", art: "/assets/rocket.svg" },
  { id: "space-quiz", title: "Space Quiz", subtitle: "Test your space knowledge", icon: "ti-help-hexagon", art: "/assets/astronaut.svg" },
  { id: "memory-match", title: "Memory Match", subtitle: "Match cards and win", icon: "ti-cards", art: "/assets/planet.svg" },
  { id: "galaxy-puzzle", title: "Galaxy Puzzle", subtitle: "Solve the launch sequence", icon: "ti-puzzle", art: "/assets/dashboard.svg" }
];

export function MiniGamesHub({ openGame }: { openGame: (game: GameId) => void }) {
  const { state } = useAppState();
  return (
    <section className="space-y-3">
      <div className="gold-panel rounded-[1.8rem] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Mini Games Hub</p>
            <h1 className="text-3xl font-black uppercase text-amber-300">Play and earn stars</h1>
          </div>
          <div className="rounded-2xl bg-violet-600 px-3 py-2 text-xl font-black text-white">
            <i className="ti ti-star-filled text-amber-300" /> {state.stars}
          </div>
        </div>
      </div>
      {gameCards.map((game) => {
        const progress = state.games[game.id];
        const unlocked = progress?.unlocked;
        return (
          <article key={game.id} className={`game-card-art relative overflow-hidden rounded-[1.35rem] border border-amber-300/70 p-4 ${unlocked ? "" : "opacity-60"}`}>
            <img src={game.art} alt="" className="absolute -right-3 -top-2 h-28 w-28 object-contain opacity-90" />
            <div className="relative max-w-[68%]">
              <h2 className="text-2xl font-black uppercase italic text-amber-300">{game.title}</h2>
              <p className="text-sm font-bold text-white">{game.subtitle}</p>
              <button
                type="button"
                className="mt-3 h-10 rounded-2xl bg-gradient-to-b from-cyan-300 to-blue-700 px-8 text-sm font-black uppercase text-white shadow-lg disabled:opacity-70"
                disabled={!unlocked}
                onClick={() => openGame(game.id)}
              >
                {unlocked ? "Play" : `${gameUnlocks[game.id]} stars`}
              </button>
            </div>
          </article>
        );
      })}
    </section>
  );
}
