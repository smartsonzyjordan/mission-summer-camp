import type { Certificate, GameId, Mission, Rank, Reward } from "@/types";

export const CAMP_ACTIVE_DAYS = 36;
export const CAMP_TOTAL_STAR_GOAL = 100;
export const DAILY_PARENT_STAR_CAP = 3;

export const initialMissions: Mission[] = [
  { id: "wake-prayer", icon: "ti-sunrise", title: "Wake Up + Prayer + Gratitude", subtitle: "6:30 AM - Calm & positive start", stars: 0, category: "kindness", completed: false, approved: false },
  { id: "cycling-play", icon: "ti-bike", title: "Cycling / Outdoor Play", subtitle: "7:00 AM - Fitness & energy", stars: 0, category: "health", completed: false, approved: false },
  { id: "bath", icon: "ti-droplet", title: "Return + Bath", subtitle: "7:45 AM - Freshness & hygiene", stars: 0, category: "routine", completed: false, approved: false },
  { id: "exercise", icon: "ti-stretching", title: "Exercise & Stretching", subtitle: "8:15 AM - Strength & flexibility", stars: 0, category: "health", completed: false, approved: false },
  { id: "relax", icon: "ti-sun", title: "Relax / Free Time", subtitle: "8:45 AM - Mind relaxation", stars: 0, category: "routine", completed: false, approved: false },
  { id: "breakfast", icon: "ti-egg", title: "Healthy Breakfast", subtitle: "9:00 AM - Nutrition", stars: 0, category: "health", completed: false, approved: false },
  { id: "handwriting", icon: "ti-pencil", title: "Handwriting Practice", subtitle: "9:30 AM - Better writing", stars: 0, category: "learning", completed: false, approved: false },
  { id: "maths", icon: "ti-calculator", title: "Maths Adventure", subtitle: "10:00 AM - Brain power", stars: 0, category: "learning", completed: false, approved: false },
  { id: "reading-speaking", icon: "ti-book", title: "Reading + Speak Aloud + Writing", subtitle: "10:30 AM - Confidence & communication", stars: 0, category: "learning", completed: false, approved: false },
  { id: "fruit-break", icon: "ti-apple", title: "Fruit Break", subtitle: "11:00 AM - Refresh & health", stars: 0, category: "health", completed: false, approved: false },
  { id: "help-home", icon: "ti-home-heart", title: "Help at Home", subtitle: "11:30 AM - Responsibility & independence", stars: 0, category: "kindness", completed: false, approved: false },
  { id: "drawing-puzzle", icon: "ti-palette", title: "Drawing / Puzzle Time", subtitle: "12:00 PM - Creativity & thinking", stars: 0, category: "learning", completed: false, approved: false },
  { id: "lunch", icon: "ti-bowl", title: "Lunch", subtitle: "1:15 PM - Family time", stars: 0, category: "routine", completed: false, approved: false },
  { id: "nap-prep", icon: "ti-bed", title: "Prepare for Nap", subtitle: "2:00 PM - Relax & wind down", stars: 0, category: "routine", completed: false, approved: false },
  { id: "recharge-sleep", icon: "ti-moon-stars", title: "Astronaut Recharge Sleep", subtitle: "2:15 PM-4:00 PM - Growth & recovery", stars: 0, category: "health", completed: false, approved: false },
  { id: "gk-learning", icon: "ti-world", title: "GK & Fun Learning", subtitle: "4:00 PM - Knowledge & curiosity", stars: 0, category: "learning", completed: false, approved: false },
  { id: "screen-time", icon: "ti-device-tv", title: "Screen Time", subtitle: "4:30 PM - Controlled entertainment", stars: 0, category: "routine", completed: false, approved: false },
  { id: "homework", icon: "ti-notebook", title: "Holiday Homework", subtitle: "5:30 PM - School readiness", stars: 0, category: "learning", completed: false, approved: false },
  { id: "evening-play", icon: "ti-ball-football", title: "Outdoor Activity & Play", subtitle: "6:30 PM - Fitness & fun", stars: 0, category: "health", completed: false, approved: false },
  { id: "dinner", icon: "ti-tools-kitchen-2", title: "Dinner", subtitle: "8:30 PM - Family bonding", stars: 0, category: "routine", completed: false, approved: false },
  { id: "science-time", icon: "ti-microscope", title: "Science Experiment Time", subtitle: "9:00 PM - Curiosity & innovation", stars: 0, category: "learning", completed: false, approved: false },
  { id: "journal", icon: "ti-book-2", title: "Gratitude Journal", subtitle: "9:30 PM - Reflection", stars: 0, category: "kindness", completed: false, approved: false },
  { id: "story-sleep", icon: "ti-moon", title: "Story Time + Sleep", subtitle: "10:00 PM - Imagination & rest", stars: 0, category: "health", completed: false, approved: false }
];

export const ranks: Rank[] = [
  { id: "cadet", name: "Cadet", starsRequired: 0, image: "/assets/planet.svg", color: "#60a5fa" },
  { id: "explorer", name: "Explorer", starsRequired: 25, image: "/assets/astronaut.svg", color: "#34d399" },
  { id: "commander", name: "Commander", starsRequired: 50, image: "/assets/rocket.svg", color: "#fbbf24" },
  { id: "galaxy-hero", name: "Galaxy Hero", starsRequired: 75, image: "/assets/dashboard.svg", color: "#f472b6" },
  { id: "space-legend", name: "Space Legend", starsRequired: 100, image: "/assets/certificate.svg", color: "#a78bfa" }
];

export const rewards: Reward[] = [
  { id: "dessert", name: "Favorite Dessert", description: "A sweet win after steady effort.", starsRequired: 20, image: "/assets/rewards.svg" },
  { id: "movie-night", name: "Movie Night", description: "Pick a family movie after dinner.", starsRequired: 40, image: "/assets/dashboard.svg" },
  { id: "toy-surprise", name: "Cricket / Science Toy", description: "Choose a skill-building surprise.", starsRequired: 60, image: "/assets/rocket.svg" },
  { id: "family-outing", name: "Family Outing", description: "A parent-planned celebration trip.", starsRequired: 80, image: "/assets/planet.svg" },
  { id: "summer-trophy", name: "Summer Champion Trophy", description: "The 100-star champion reward.", starsRequired: 100, image: "/assets/certificate.svg" }
];

export const certificates: Certificate[] = [
  {
    id: "discipline",
    name: "Discipline Certificate",
    starsRequired: 20,
    image: "/assets/certificate-bases/discipline.png",
    downloadName: "discipline-certificate.jpeg"
  },
  {
    id: "confidence",
    name: "Confidence Champion",
    starsRequired: 40,
    image: "/assets/certificate-bases/confidence.png",
    downloadName: "confidence-certificate.jpeg"
  },
  {
    id: "brain",
    name: "Brain Booster Award",
    starsRequired: 60,
    image: "/assets/certificate-bases/brain-booster.png",
    downloadName: "brain-booster-certificate.jpeg"
  },
  {
    id: "galaxy-hero-cert",
    name: "Galaxy Hero Rank",
    starsRequired: 75,
    image: "/assets/certificate-bases/galaxy-hero.png",
    downloadName: "galaxy-hero-certificate.jpeg"
  },
  {
    id: "space-legend-cert",
    name: "Champions Badge",
    starsRequired: 100,
    image: "/assets/certificate-bases/champions-badge.png",
    downloadName: "champions-badge-certificate.jpeg"
  }
];

export const planner = [
  { time: "6:30 AM", title: "Wake Up + Prayer + Gratitude", icon: "ti-sunrise", mode: "normal", purpose: "Calm & Positive Start" },
  { time: "7:00 AM", title: "Cycling / Outdoor Play", icon: "ti-bike", mode: "normal", purpose: "Fitness & Energy" },
  { time: "7:45 AM", title: "Return + Bath", icon: "ti-droplet", mode: "normal", purpose: "Freshness & Hygiene" },
  { time: "8:15 AM", title: "Exercise & Stretching", icon: "ti-stretching", mode: "normal", purpose: "Strength & Flexibility" },
  { time: "8:45 AM", title: "Relax / Free Time", icon: "ti-sun", mode: "normal", purpose: "Mind Relaxation" },
  { time: "9:00 AM", title: "Healthy Breakfast", icon: "ti-egg", mode: "normal", purpose: "Nutrition" },
  { time: "9:30 AM", title: "Handwriting Practice", icon: "ti-pencil", mode: "normal", purpose: "Better Writing" },
  { time: "10:00 AM", title: "Maths Adventure", icon: "ti-calculator", mode: "normal", purpose: "Brain Power" },
  { time: "10:30 AM", title: "Reading + Speak Aloud + Writing", icon: "ti-book", mode: "normal", purpose: "Confidence & Communication" },
  { time: "11:00 AM", title: "Fruit Break", icon: "ti-apple", mode: "normal", purpose: "Refresh & Health" },
  { time: "11:30 AM", title: "Help at Home", icon: "ti-home-heart", mode: "normal", purpose: "Responsibility & Independence" },
  { time: "12:00 PM", title: "Drawing / Puzzle Time", icon: "ti-palette", mode: "normal", purpose: "Creativity & Thinking" },
  { time: "1:15 PM", title: "Lunch", icon: "ti-bowl", mode: "normal", purpose: "Family Time" },
  { time: "2:00 PM", title: "Prepare for Nap", icon: "ti-bed", mode: "sleep", purpose: "Relax & Wind Down" },
  { time: "2:15-4:00", title: "Astronaut Recharge Sleep", icon: "ti-moon-stars", mode: "sleep", purpose: "Growth & Recovery" },
  { time: "4:00 PM", title: "GK & Fun Learning", icon: "ti-world", mode: "normal", purpose: "Knowledge & Curiosity" },
  { time: "4:30 PM", title: "Screen Time", icon: "ti-device-tv", mode: "normal", purpose: "Controlled Entertainment" },
  { time: "5:30 PM", title: "Holiday Homework", icon: "ti-notebook", mode: "normal", purpose: "School Readiness" },
  { time: "6:30 PM", title: "Outdoor Activity & Play", icon: "ti-ball-football", mode: "normal", purpose: "Fitness & Fun" },
  { time: "8:30 PM", title: "Dinner", icon: "ti-tools-kitchen-2", mode: "normal", purpose: "Family Bonding" },
  { time: "9:00 PM", title: "Science Experiment Time", icon: "ti-microscope", mode: "normal", purpose: "Curiosity & Innovation" },
  { time: "9:30 PM", title: "Gratitude Journal", icon: "ti-book-2", mode: "normal", purpose: "Reflection" },
  { time: "10:00 PM", title: "Story Time + Sleep", icon: "ti-moon", mode: "sleep", purpose: "Imagination & Rest" }
];

export const gameUnlocks: Record<GameId, number> = {
  "rocket-runner": 0,
  "space-quiz": 20,
  "memory-match": 40,
  "galaxy-puzzle": 60
};
