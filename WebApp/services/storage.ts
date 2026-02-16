import { LeaderboardEntry } from '../types';

const STORAGE_KEY = 'certprep_leaderboard_v1';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load leaderboard', e);
    return [];
  }
};

export const saveRun = (entry: LeaderboardEntry): void => {
  try {
    const current = getLeaderboard();
    const updated = [...current, entry];
    
    // Sort: 1. Correct (desc), 2. Accuracy (desc), 3. Date (desc)
    updated.sort((a, b) => {
      if (b.correct !== a.correct) return b.correct - a.correct;
      if (b.accuracy !== a.accuracy) return b.accuracy - a.accuracy;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save run', e);
  }
};

export const clearLeaderboard = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
