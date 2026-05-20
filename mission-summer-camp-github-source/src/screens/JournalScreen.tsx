"use client";

import { useState } from "react";
import { useAppState } from "@/context/AppState";
import { VisualAsset } from "@/components/VisualAsset";

export function JournalScreen() {
  const { state, dispatch } = useAppState();
  const today = state.journalEntries[0];
  const [happy, setHappy] = useState(today?.happy ?? "");
  const [learned, setLearned] = useState(today?.learned ?? "");
  const [helped, setHelped] = useState(today?.helped ?? "");

  const save = () => {
    if (!happy.trim() && !learned.trim() && !helped.trim()) return;
    dispatch({ type: "SAVE_JOURNAL", entry: { happy, learned, helped } });
  };

  const fields = [
    ["ti-star-filled", "What made you happy today?", happy, setHappy],
    ["ti-books", "What did you learn today?", learned, setLearned],
    ["ti-heart-filled", "Who did you help today?", helped, setHelped]
  ] as const;

  return (
    <div className="space-y-4 px-4 pb-28 pt-5">
      <section className="gold-panel relative overflow-hidden rounded-[1.8rem] p-4 text-center">
        <div className="absolute right-2 top-2 text-5xl text-amber-200">
          <i className="ti ti-moon-stars" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Gratitude Journal</p>
        <h1 className="text-3xl font-black uppercase text-amber-300">End your day with gratitude</h1>
      </section>

      <section className="relative rounded-[1.8rem] border border-amber-200/60 bg-[#f4d7a6] p-4 text-slate-950 shadow-gold">
        <div className="absolute -left-2 top-6 flex flex-col gap-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <span key={index} className="h-7 w-7 rounded-full border-4 border-purple-700 bg-pink-300" />
          ))}
        </div>
        <div className="space-y-4 pl-4">
          {fields.map(([icon, label, value, setter]) => (
            <label key={label} className="block rounded-3xl border-4 border-purple-800 bg-purple-950 p-3 text-white">
              <div className="mb-2 flex items-center justify-between gap-3 text-sm font-black">
                <span className="flex items-center gap-2">
                  <i className={`ti ${icon} text-xl text-amber-300`} />
                  {label}
                </span>
                <i className="ti ti-pencil text-lg text-purple-200" />
              </div>
              <textarea
                className="min-h-20 w-full resize-none rounded-2xl border border-amber-200 bg-amber-50 p-3 text-base font-bold text-slate-950 outline-none focus:border-fuchsia-500"
                value={value}
                onChange={(event) => setter(event.target.value)}
              />
            </label>
          ))}
        </div>
        <VisualAsset src="/assets/astronaut.svg" alt="" className="pointer-events-none absolute -bottom-2 -right-3 h-28 w-28 rounded-full" />
      </section>

      <button type="button" className="btn-primary w-full" onClick={save}>
        Save Journal Entry
      </button>
    </div>
  );
}
