"use client";

import { motion } from "framer-motion";
import { ranks, rewards } from "@/data/content";
import { useAppState } from "@/context/AppState";
import { VisualAsset } from "@/components/VisualAsset";
import type { ParentAction } from "@/types";

type Props = {
  requestParent: (action: ParentAction, onApproved: () => void) => void;
};

export function RewardsScreen({ requestParent }: Props) {
  const { state, dispatch } = useAppState();

  return (
    <div className="space-y-4 px-4 pb-28 pt-5">
      <section className="gold-panel rounded-[1.8rem] p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase text-cyan-300">Reward Vault</p>
            <h1 className="text-3xl font-black uppercase text-amber-300">Stars: {state.stars}</h1>
          </div>
          <i className="ti ti-gift text-5xl text-fuchsia-300" />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rewards.map((reward) => {
          const rewardState = state.rewards[reward.id] ?? { unlocked: false, claimed: false };
          return (
            <motion.article
              key={reward.id}
              whileHover={{ y: -2 }}
              className={`relative overflow-hidden rounded-[1.45rem] border p-3 ${
                rewardState.unlocked ? "border-amber-300/70 bg-amber-300/10 shadow-gold" : "border-white/10 bg-white/5 opacity-75"
              }`}
            >
              <div className="flex items-center gap-3">
                <VisualAsset src={reward.image} alt="" className="h-20 w-20 rounded-2xl" />
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-black uppercase text-white">{reward.name}</h2>
                  <p className="text-sm text-slate-300">{reward.description}</p>
                  <p className="mt-1 text-sm font-black text-amber-300">{rewardState.unlocked ? (rewardState.claimed ? "Claimed" : "Unlocked") : `${reward.starsRequired} stars`}</p>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary mt-3 w-full disabled:opacity-50"
                disabled={!rewardState.unlocked || rewardState.claimed}
                onClick={() => requestParent("unlock-reward", () => dispatch({ type: "CLAIM_REWARD", rewardId: reward.id }))}
              >
                {rewardState.claimed ? "Claimed" : rewardState.unlocked ? "Claim" : "Locked"}
              </button>
            </motion.article>
          );
        })}
      </section>

      <section className="panel rounded-[1.8rem] p-4">
        <h2 className="mb-3 text-lg font-black uppercase text-white">Rank Ladder</h2>
        <div className="space-y-2">
          {ranks.map((rank) => {
            const achieved = state.stars >= rank.starsRequired;
            const current = state.activeRankId === rank.id;
            return (
              <div key={rank.id} className={`flex items-center gap-3 rounded-2xl border p-3 ${current ? "border-fuchsia-300/70 bg-fuchsia-400/10" : achieved ? "border-emerald-300/30 bg-emerald-400/10" : "border-white/10 bg-white/5"}`}>
                <VisualAsset src={rank.image} alt="" className="h-12 w-12 rounded-xl" />
                <div className="flex-1">
                  <div className="font-black uppercase text-white">{rank.name}</div>
                  <div className="text-xs text-slate-400">{rank.starsRequired} stars required</div>
                </div>
                <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-black text-cyan-200">{current ? "Current" : achieved ? "Done" : "Locked"}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
