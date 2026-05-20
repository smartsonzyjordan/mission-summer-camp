"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/context/AppState";
import type { GameId } from "@/types";

type Props = {
  game: GameId;
  onClose: () => void;
};

export function GameModal({ game, onClose }: Props) {
  const titles: Record<GameId, string> = {
    "rocket-runner": "Rocket Runner",
    "space-quiz": "Space Quiz",
    "memory-match": "Memory Match",
    "galaxy-puzzle": "Galaxy Puzzle"
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4 backdrop-blur-sm">
      <motion.div className="gold-panel max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-[2rem] p-4" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-2xl font-black uppercase text-amber-300">{titles[game]}</h2>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10" onClick={onClose} aria-label="Close game">
            <i className="ti ti-x" />
          </button>
        </div>
        {game === "rocket-runner" ? <RocketRunner onClose={onClose} /> : null}
        {game === "space-quiz" ? <SpaceQuiz onClose={onClose} /> : null}
        {game === "memory-match" ? <MemoryMatch onClose={onClose} /> : null}
        {game === "galaxy-puzzle" ? <GalaxyPuzzle onClose={onClose} /> : null}
      </motion.div>
    </div>
  );
}

function AwardButton({ gameId, score, stars, onClose }: { gameId: GameId; score: number; stars: number; onClose: () => void }) {
  const { dispatch } = useAppState();
  return (
    <button
      type="button"
      className="btn-green mt-4 w-full"
      onClick={() => {
        dispatch({ type: "AWARD_GAME_STARS", gameId, score, stars });
        onClose();
      }}
    >
      Claim +{stars} stars
    </button>
  );
}

function RocketRunner({ onClose }: { onClose: () => void }) {
  const [position, setPosition] = useState(1);
  const [stars, setStars] = useState(0);
  const [turns, setTurns] = useState(0);
  const lanes = [0, 1, 2];
  const target = (turns * 2 + 1) % 3;
  const done = turns >= 10;

  const move = (lane: number) => {
    if (done) return;
    setPosition(lane);
    setStars((value) => value + (lane === target ? 1 : 0));
    setTurns((value) => value + 1);
  };

  return (
    <div>
      <div className="rounded-3xl bg-slate-950/70 p-4">
        <div className="mb-3 flex justify-between text-sm font-black text-cyan-200">
          <span>Collect the glowing star lane</span>
          <span>{stars}/10</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {lanes.map((lane) => (
            <button key={lane} type="button" onClick={() => move(lane)} className="relative h-48 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-indigo-950 to-slate-950">
              {target === lane ? <i className="ti ti-star-filled absolute left-1/2 top-8 -translate-x-1/2 text-3xl text-amber-300" /> : null}
              {position === lane ? <i className="ti ti-rocket absolute bottom-6 left-1/2 -translate-x-1/2 text-5xl text-cyan-200" /> : null}
            </button>
          ))}
        </div>
      </div>
      {done ? <AwardButton gameId="rocket-runner" score={stars} stars={Math.max(3, Math.min(10, stars))} onClose={onClose} /> : null}
    </div>
  );
}

const quiz = [
  { q: "Which planet is called the Red Planet?", options: ["Mars", "Venus", "Jupiter"], answer: "Mars" },
  { q: "What do astronauts wear in space?", options: ["Space suit", "Rain coat", "Swim suit"], answer: "Space suit" },
  { q: "What gives Earth daylight?", options: ["The Sun", "The Moon", "Saturn"], answer: "The Sun" }
];

function SpaceQuiz({ onClose }: { onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const done = index >= quiz.length;
  const current = quiz[index];

  if (done) return <AwardButton gameId="space-quiz" score={score} stars={score * 3 + 2} onClose={onClose} />;
  return (
    <div className="rounded-3xl bg-slate-950/70 p-4">
      <p className="mb-4 text-lg font-black text-white">{current.q}</p>
      <div className="space-y-2">
        {current.options.map((option) => (
          <button
            key={option}
            type="button"
            className="h-14 w-full rounded-2xl bg-white/10 px-4 text-left font-black"
            onClick={() => {
              setScore((value) => value + (option === current.answer ? 1 : 0));
              setIndex((value) => value + 1);
            }}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function MemoryMatch({ onClose }: { onClose: () => void }) {
  const deck = useMemo(() => ["rocket", "planet", "star", "moon"].flatMap((item) => [item, item]).sort(() => Math.random() - 0.5), []);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const pick = (card: number) => {
    if (open.includes(card) || matched.includes(card) || open.length === 2) return;
    const next = [...open, card];
    setOpen(next);
    if (next.length === 2) {
      if (deck[next[0]] === deck[next[1]]) {
        setTimeout(() => {
          setMatched((value) => [...value, ...next]);
          setOpen([]);
        }, 350);
      } else {
        setTimeout(() => setOpen([]), 650);
      }
    }
  };

  const done = matched.length === deck.length;
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {deck.map((card, index) => {
          const visible = open.includes(index) || matched.includes(index);
          const icon = card === "rocket" ? "ti-rocket" : card === "planet" ? "ti-planet" : card === "star" ? "ti-star-filled" : "ti-moon";
          return (
            <button key={`${card}-${index}`} type="button" className="grid aspect-square place-items-center rounded-2xl bg-violet-700 text-3xl" onClick={() => pick(index)}>
              <i className={`ti ${visible ? icon : "ti-cards"} ${visible ? "text-amber-300" : "text-violet-200"}`} />
            </button>
          );
        })}
      </div>
      {done ? <AwardButton gameId="memory-match" score={8} stars={8} onClose={onClose} /> : null}
    </div>
  );
}

function GalaxyPuzzle({ onClose }: { onClose: () => void }) {
  const correct = ["Fuel", "Suit", "Map", "Launch"];
  const [pieces, setPieces] = useState(["Map", "Fuel", "Launch", "Suit"]);
  const solved = pieces.every((piece, index) => piece === correct[index]);

  const swap = (index: number) => {
    const next = [...pieces];
    const target = (index + 1) % next.length;
    [next[index], next[target]] = [next[target], next[index]];
    setPieces(next);
  };

  return (
    <div>
      <p className="mb-3 text-sm font-bold text-slate-200">Tap tiles to rotate the launch sequence into the right order.</p>
      <div className="space-y-2">
        {pieces.map((piece, index) => (
          <button key={`${piece}-${index}`} type="button" onClick={() => swap(index)} className="flex h-14 w-full items-center justify-between rounded-2xl bg-white/10 px-4 font-black">
            <span>{index + 1}. {piece}</span>
            <i className="ti ti-arrows-exchange" />
          </button>
        ))}
      </div>
      {solved ? <AwardButton gameId="galaxy-puzzle" score={10} stars={10} onClose={onClose} /> : null}
    </div>
  );
}
