"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useAppState } from "@/context/AppState";

export function CelebrationOverlay() {
  const { state, dispatch } = useAppState();
  const celebration = state.celebrations[0];

  return (
    <AnimatePresence>
      {celebration ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="gold-panel relative w-full max-w-sm overflow-hidden rounded-[2rem] p-6 text-center"
            initial={{ scale: 0.72, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 20 }}
          >
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-fuchsia-500/25 to-transparent" />
            <motion.div
              className="sparkle-ring mx-auto mb-4 grid h-28 w-28 place-items-center rounded-full p-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
            >
              <div className="grid h-full w-full place-items-center rounded-full bg-[#111133] text-5xl text-amber-300">
                <i className={celebration.type === "rank" ? "ti ti-shield-star" : "ti ti-star-filled"} />
              </div>
            </motion.div>
            <div className="relative">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">{celebration.detail}</p>
              <h2 className="mt-2 text-4xl font-black uppercase text-amber-300">{celebration.title}</h2>
              <button
                type="button"
                className="btn-green mt-6 w-full"
                onClick={() => dispatch({ type: "DISMISS_CELEBRATION", id: celebration.id })}
              >
                Awesome
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
