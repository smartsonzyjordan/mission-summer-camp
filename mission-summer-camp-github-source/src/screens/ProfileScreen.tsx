"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/context/AppState";
import { VisualAsset } from "@/components/VisualAsset";
import type { ParentAction } from "@/types";

type Props = {
  requestParent: (action: ParentAction, onApproved: () => void) => void;
};

export function ProfileScreen({ requestParent }: Props) {
  const { state, dispatch } = useAppState();
  const [name, setName] = useState(state.childName);
  const [age, setAge] = useState(state.childAge);
  const [grade, setGrade] = useState(state.childGrade);
  const [description, setDescription] = useState(state.childDescription);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const save = () => {
    if (!name.trim()) {
      setError("Child name is required.");
      return;
    }
    dispatch({ type: "SET_CHILD_PROFILE", name, age, grade, description, stayOnScreen: true });
    setError("");
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div className="space-y-4 px-4 pb-28 pt-5">
      <section className="gold-panel overflow-hidden rounded-[1.8rem] p-4">
        <div className="flex items-center gap-4">
          <VisualAsset src="/assets/astronaut.svg" alt="Child profile" className="h-24 w-24 rounded-3xl shadow-glow" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black uppercase tracking-widest text-cyan-300">Cadet Profile</p>
            <h1 className="truncate text-3xl font-black uppercase text-amber-300">{state.childName || "New Cadet"}</h1>
            <p className="text-sm font-bold text-slate-300">
              {state.childAge ? `${state.childAge} years` : "Age not set"} · {state.childGrade || "Grade not set"}
            </p>
          </div>
        </div>
      </section>

      <section className="panel rounded-[1.8rem] p-4">
        <div className="space-y-3">
          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase text-slate-300">Child name</span>
            <input
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none focus:border-cyan-300"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter name"
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-300">Age</span>
              <input
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none focus:border-cyan-300"
                value={age}
                inputMode="numeric"
                onChange={(event) => setAge(event.target.value.replace(/\D/g, ""))}
                placeholder="Age"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-300">Grade</span>
              <input
                className="h-14 w-full rounded-2xl border border-white/10 bg-white/10 px-4 text-white outline-none focus:border-cyan-300"
                value={grade}
                onChange={(event) => setGrade(event.target.value)}
                placeholder="Grade"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-xs font-black uppercase text-slate-300">Mission description</span>
            <textarea
              className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-300"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe this child's mission or goal"
            />
          </label>
        </div>
        {error ? <div className="mt-3 rounded-2xl bg-red-500/20 p-3 text-sm font-bold text-red-100">{error}</div> : null}
        {saved ? (
          <motion.div className="mt-3 rounded-2xl bg-emerald-500/20 p-3 text-sm font-black text-emerald-100" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            Profile saved
          </motion.div>
        ) : null}
        <button type="button" className="btn-green mt-4 w-full" onClick={save}>
          Save Profile
        </button>
      </section>

      <section className="panel rounded-[1.8rem] p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-black uppercase text-white">Parent PIN</h2>
            <p className="text-sm font-bold text-slate-300">Parents can create or reset the approval PIN here.</p>
          </div>
          <button type="button" className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-600 text-xl shadow-glow" onClick={() => requestParent("parent-settings", () => undefined)} aria-label="Parent PIN settings">
            <i className="ti ti-lock-star" />
          </button>
        </div>
      </section>
    </div>
  );
}
