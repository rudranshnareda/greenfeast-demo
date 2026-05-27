import type { User } from '../types';

const KEY = 'greenfeast_user';

export const getUserFromStorage = (): User | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const saveUserToStorage = (user: Partial<User>): User => {
  const current = getUserFromStorage() || {} as User;
  const merged = { ...current, ...user } as User;
  localStorage.setItem(KEY, JSON.stringify(merged));
  return merged;
};

export const clearStorage = () => {
  localStorage.removeItem(KEY);
};

export const getNextMonday = (): string => {
  const d = new Date();
  const day = d.getDay();
  const daysUntilMonday = day === 0 ? 1 : 8 - day;
  d.setDate(d.getDate() + daysUntilMonday);
  return d.toISOString().split('T')[0];
};
