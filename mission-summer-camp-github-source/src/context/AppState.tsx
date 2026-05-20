"use client";

import { createContext, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { Dispatch, ReactNode } from "react";
import { clampCampStars, applyProgression, getParentApprovedDailyStars } from "@/services/progression";
import { getTodayKey, loadState, saveState } from "@/services/storage";
import type { AppState, ChatMessage, GameId, JournalEntry, MoreTab, ParentPinRecord, ScreenId } from "@/types";

type Action =
  | { type: "START_SESSION" }
  | { type: "SET_CHILD_PROFILE"; name: string; age: string; grade: string; description?: string; stayOnScreen?: boolean }
  | { type: "SET_SCREEN"; screen: ScreenId }
  | { type: "SET_MORE_TAB"; tab: MoreTab }
  | { type: "TOGGLE_MISSION"; missionId: string }
  | { type: "APPROVE_MISSIONS" }
  | { type: "SAVE_JOURNAL"; entry: Omit<JournalEntry, "id" | "date"> }
  | { type: "CLAIM_REWARD"; rewardId: string }
  | { type: "SET_PARENT_PIN"; record: ParentPinRecord }
  | { type: "ADD_CHAT"; message: ChatMessage }
  | { type: "AWARD_GAME_STARS"; gameId: GameId; stars: number; score: number }
  | { type: "DISMISS_CELEBRATION"; id: string };

type AppContextValue = {
  state: AppState;
  dispatch: Dispatch<Action>;
  hydrated: boolean;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function withProgression(state: AppState) {
  return applyProgression(state);
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "START_SESSION":
      return { ...state, childSessionStarted: true, activeScreen: state.activeScreen || "home" };
    case "SET_CHILD_PROFILE":
      return {
        ...state,
        childName: action.name.trim(),
        childAge: action.age.trim(),
        childGrade: action.grade.trim(),
        childDescription: action.description?.trim() ?? state.childDescription,
        childSessionStarted: true,
        activeScreen: action.stayOnScreen ? state.activeScreen : "home"
      };
    case "SET_SCREEN":
      return { ...state, activeScreen: action.screen };
    case "SET_MORE_TAB":
      return { ...state, activeMoreTab: action.tab };
    case "TOGGLE_MISSION":
      return {
        ...state,
        missions: state.missions.map((mission) => {
          if (mission.id !== action.missionId || mission.approved) return mission;
          return { ...mission, completed: !mission.completed };
        })
      };
    case "APPROVE_MISSIONS": {
      const pending = state.missions.filter((mission) => mission.completed && !mission.approved);
      if (pending.length === 0) return state;
      const approvedToday = state.missions.filter((mission) => mission.approved).length;
      const completedToday = state.missions.filter((mission) => mission.completed).length;
      const starsAlreadyAwardedToday = getParentApprovedDailyStars(approvedToday, state.missions.length);
      const dailyStars = getParentApprovedDailyStars(completedToday, state.missions.length);
      const earned = Math.max(0, dailyStars - starsAlreadyAwardedToday);
      if (earned === 0) return state;
      const today = getTodayKey();
      const completedCount = state.missions.filter((mission) => mission.completed).length;
      const completionPct = Math.round((completedCount / state.missions.length) * 100);
      const nextStreak = state.lastApprovedDate === today ? state.streak : state.streak + 1;
      return withProgression({
        ...state,
        stars: clampCampStars(state.stars + earned),
        todayStars: state.todayStars + earned,
        streak: nextStreak,
        longestStreak: Math.max(state.longestStreak, nextStreak),
        lastApprovedDate: today,
        analytics: { ...state.analytics, [today]: completionPct },
        missions: state.missions.map((mission) => (mission.completed ? { ...mission, approved: true } : mission)),
        celebrations: [
          ...state.celebrations,
          { id: uid(), type: "stars", title: `+${earned} stars approved`, detail: "Parent validation complete" }
        ]
      });
    }
    case "SAVE_JOURNAL": {
      const today = getTodayKey();
      const previous = state.journalEntries.find((entry) => entry.date === today);
      const nextEntries = previous
        ? state.journalEntries.map((entry) => (entry.date === today ? { ...entry, ...action.entry } : entry))
        : [{ id: uid(), date: today, ...action.entry }, ...state.journalEntries];
      return withProgression({
        ...state,
        journalEntries: nextEntries,
        stars: state.stars,
        todayStars: state.todayStars,
        celebrations: previous
          ? state.celebrations
          : [...state.celebrations, { id: uid(), type: "stars", title: "Journal saved", detail: "Reflection complete" }]
      });
    }
    case "CLAIM_REWARD":
      return {
        ...state,
        rewards: {
          ...state.rewards,
          [action.rewardId]: { ...(state.rewards[action.rewardId] ?? { unlocked: false, claimed: false }), claimed: true }
        }
      };
    case "SET_PARENT_PIN":
      return { ...state, parentPin: action.record };
    case "ADD_CHAT":
      return { ...state, chatHistory: [...state.chatHistory.slice(-24), action.message] };
    case "AWARD_GAME_STARS": {
      const game = state.games[action.gameId];
      return withProgression({
        ...state,
        stars: state.stars,
        todayStars: state.todayStars,
        games: {
          ...state.games,
          [action.gameId]: {
            unlocked: true,
            bestScore: Math.max(game?.bestScore ?? 0, action.score),
            plays: (game?.plays ?? 0) + 1
          }
        },
        celebrations: [
          ...state.celebrations,
          { id: uid(), type: "stars", title: `+${action.stars} bonus stars`, detail: "Mini game complete" }
        ]
      });
    }
    case "DISMISS_CELEBRATION":
      return { ...state, celebrations: state.celebrations.filter((item) => item.id !== action.id) };
    default:
      return state;
  }
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveState(state);
  }, [hydrated, state]);

  const value = useMemo(() => ({ state, dispatch, hydrated }), [hydrated, state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}
