import { gameUnlocks, initialMissions, ranks, rewards } from "@/data/content";
import { applyProgression } from "@/services/progression";
import type { AppState, GameId } from "@/types";

const STORAGE_KEY = "mission-summer-camp-galaxy-journey:v2";
const VERSION = 2;

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function createInitialState(): AppState {
  const rewardState = Object.fromEntries(rewards.map((reward) => [reward.id, { unlocked: false, claimed: false }]));
  const games = Object.fromEntries(
    (Object.keys(gameUnlocks) as GameId[]).map((gameId) => [
      gameId,
      { unlocked: gameUnlocks[gameId] === 0, bestScore: 0, plays: 0 }
    ])
  ) as AppState["games"];

  return applyProgression({
    version: VERSION,
    childName: "",
    childAge: "",
    childGrade: "",
    childDescription: "",
    childSessionStarted: false,
    activeScreen: "home",
    activeMoreTab: "certs",
    stars: 0,
    todayStars: 0,
    streak: 0,
    longestStreak: 0,
    missions: initialMissions,
    journalEntries: [],
    rewards: rewardState,
    unlockedCertificates: [],
    activeRankId: ranks[0].id,
    analytics: {},
    games,
    chatHistory: [
      {
        id: "welcome",
        role: "coach",
        text: "Hello Cadet. I am Cosmo, your mission coach. I will help you pick the next mission, celebrate wins, and keep the journey fun.",
        createdAt: new Date().toISOString()
      }
    ],
    celebrations: []
  });
}

export function loadState(): AppState {
  if (typeof window === "undefined") return createInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw) as AppState;
    const merged = {
      ...createInitialState(),
      ...parsed,
      missions: initialMissions.map((mission) => {
        const saved = parsed.missions?.find((item) => item.id === mission.id);
        return saved ? { ...mission, completed: saved.completed, approved: saved.approved } : mission;
      })
    };
    if (!merged.childName?.trim()) {
      merged.childSessionStarted = false;
    }
    if (merged.lastApprovedDate && merged.lastApprovedDate !== todayKey()) {
      merged.todayStars = 0;
      merged.missions = merged.missions.map((mission) => ({ ...mission, completed: false, approved: false }));
    }
    return applyProgression(merged);
  } catch {
    return createInitialState();
  }
}

export function saveState(state: AppState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function getTodayKey() {
  return todayKey();
}
