import { CAMP_TOTAL_STAR_GOAL, DAILY_PARENT_STAR_CAP, certificates, gameUnlocks, ranks, rewards } from "@/data/content";
import type { AppState, Celebration, GameId } from "@/types";

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export function getActiveRankId(stars: number) {
  return ranks.reduce((current, rank) => (stars >= rank.starsRequired ? rank : current), ranks[0]).id;
}

export function getNextRank(stars: number) {
  return ranks.find((rank) => rank.starsRequired > stars);
}

export function clampCampStars(stars: number) {
  return Math.min(CAMP_TOTAL_STAR_GOAL, Math.max(0, stars));
}

export function getParentApprovedDailyStars(completedTasks: number, totalTasks: number) {
  if (totalTasks <= 0) return 0;
  const completionRatio = completedTasks / totalTasks;
  if (completionRatio >= 0.9) return DAILY_PARENT_STAR_CAP;
  if (completionRatio >= 0.6) return 2;
  if (completionRatio >= 0.3) return 1;
  return 0;
}

export function applyProgression(state: AppState): AppState {
  const celebrations: Celebration[] = [];
  const stars = clampCampStars(state.stars);
  const activeRankId = getActiveRankId(stars);
  if (activeRankId !== state.activeRankId) {
    const rank = ranks.find((item) => item.id === activeRankId);
    if (rank) {
      celebrations.push({ id: uid(), type: "rank", title: `${rank.name} unlocked`, detail: "New rank achieved" });
    }
  }

  const rewardState = { ...state.rewards };
  for (const reward of rewards) {
    const current = rewardState[reward.id] ?? { unlocked: false, claimed: false };
    if (stars >= reward.starsRequired && !current.unlocked) {
      rewardState[reward.id] = { ...current, unlocked: true };
      celebrations.push({ id: uid(), type: "reward", title: reward.name, detail: "Reward unlocked" });
    } else {
      rewardState[reward.id] = current;
    }
  }

  const unlockedCertificates = [...state.unlockedCertificates];
  for (const cert of certificates) {
    if (stars >= cert.starsRequired && !unlockedCertificates.includes(cert.id)) {
      unlockedCertificates.push(cert.id);
      celebrations.push({ id: uid(), type: "certificate", title: cert.name, detail: "Certificate unlocked" });
    }
  }

  const games = { ...state.games };
  for (const [gameId, starsRequired] of Object.entries(gameUnlocks) as [GameId, number][]) {
    const current = games[gameId] ?? { unlocked: false, bestScore: 0, plays: 0 };
    if (stars >= starsRequired && !current.unlocked) {
      games[gameId] = { ...current, unlocked: true };
      if (starsRequired > 0) {
        celebrations.push({ id: uid(), type: "game", title: gameId.replace("-", " "), detail: "Mini game unlocked" });
      }
    } else {
      games[gameId] = current;
    }
  }

  return {
    ...state,
    stars,
    activeRankId,
    rewards: rewardState,
    unlockedCertificates,
    games,
    celebrations: [...state.celebrations, ...celebrations]
  };
}
