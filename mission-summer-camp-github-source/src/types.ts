export type ScreenId = "home" | "missions" | "planner" | "rewards" | "journal" | "coach" | "more" | "profile";
export type MoreTab = "certs" | "analytics" | "games" | "final";
export type GameId = "rocket-runner" | "space-quiz" | "memory-match" | "galaxy-puzzle";

export type Mission = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  stars: number;
  category: "routine" | "learning" | "health" | "kindness";
  completed: boolean;
  approved: boolean;
};

export type Reward = {
  id: string;
  name: string;
  description: string;
  starsRequired: number;
  image: string;
};

export type RewardState = {
  unlocked: boolean;
  claimed: boolean;
};

export type Rank = {
  id: string;
  name: string;
  starsRequired: number;
  image: string;
  color: string;
};

export type Certificate = {
  id: string;
  name: string;
  starsRequired: number;
  image: string;
  downloadName: string;
};

export type JournalEntry = {
  id: string;
  date: string;
  happy: string;
  learned: string;
  helped: string;
};

export type ChatMessage = {
  id: string;
  role: "coach" | "child";
  text: string;
  createdAt: string;
};

export type ParentPinRecord = {
  salt: string;
  hash: string;
  updatedAt: string;
};

export type GameProgress = {
  unlocked: boolean;
  bestScore: number;
  plays: number;
};

export type Celebration = {
  id: string;
  type: "stars" | "rank" | "reward" | "certificate" | "game";
  title: string;
  detail: string;
};

export type AppState = {
  version: number;
  childName: string;
  childAge: string;
  childGrade: string;
  childDescription: string;
  childSessionStarted: boolean;
  activeScreen: ScreenId;
  activeMoreTab: MoreTab;
  stars: number;
  todayStars: number;
  streak: number;
  longestStreak: number;
  lastApprovedDate?: string;
  missions: Mission[];
  journalEntries: JournalEntry[];
  rewards: Record<string, RewardState>;
  unlockedCertificates: string[];
  activeRankId: string;
  parentPin?: ParentPinRecord;
  analytics: Record<string, number>;
  games: Record<GameId, GameProgress>;
  chatHistory: ChatMessage[];
  celebrations: Celebration[];
};

export type ParentAction = "approve-stars" | "unlock-reward" | "analytics" | "parent-settings";
