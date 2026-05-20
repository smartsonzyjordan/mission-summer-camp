"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppState } from "@/context/AppState";
import { BrandHeader } from "@/components/BrandHeader";
import { PwaRegister } from "@/components/PwaRegister";
import { Starfield } from "@/components/Starfield";
import { VisualAsset } from "@/components/VisualAsset";

export function ProfileSetup() {
  const { state, dispatch } = useAppState();
  const [name, setName] = useState(state.childName);
  const [age, setAge] = useState(state.childAge);
  const [grade, setGrade] = useState(state.childGrade);
  const [description, setDescription] = useState(state.childDescription);
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim()) {
      setError("Please enter the child's name.");
      return;
    }
    dispatch({ type: "SET_CHILD_PROFILE", name, age, grade, description });
  };

  return (
    <main className="relative min-h-dvh overflow-hidden galaxy-bg">
      <PwaRegister />
      <Starfield />
      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-5 py-8 text-center">
        <motion.div initial={{ scale: 0.78, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="phone-frame w-full rounded-[2.2rem] bg-black/30 p-5">
          <BrandHeader />
          <div className="relative mx-auto my-5 h-40 w-40">
            <motion.div className="sparkle-ring absolute inset-0 rounded-full opacity-80 blur-[1px]" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
            <VisualAsset src="/assets/astronaut.svg" alt="Cadet astronaut" className="relative h-full w-full rounded-full drop-shadow-2xl" />
          </div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">Cadet Profile</p>
          <h1 className="mt-1 text-4xl font-black uppercase leading-none text-amber-300">Join Mission Control</h1>
          <div className="mt-5 space-y-3 text-left">
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
                className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none focus:border-cyan-300"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Example: To become disciplined, confident, kind and knowledgeable."
              />
            </label>
          </div>
          {error ? <div className="mt-3 rounded-2xl bg-red-500/20 p-3 text-sm font-bold text-red-100">{error}</div> : null}
          <button type="button" className="btn-green mt-5 w-full" onClick={submit}>
            Start Mission
          </button>
        </motion.div>
      </div>
    </main>
  );
}
