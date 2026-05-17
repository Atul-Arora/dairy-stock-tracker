import { StockEntry } from './stock';

const STORAGE_KEY = 'dairy-stock-v1';

export function loadEntries(): StockEntry[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed as StockEntry[] : [];
}

export function saveEntries(entries: StockEntry[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function upsertDay(entries: StockEntry[], dayEntries: StockEntry[]): StockEntry[] {
  const date = dayEntries[0]?.date;
  if (!date) return entries;
  return [...entries.filter((entry) => entry.date !== date), ...dayEntries].sort((a, b) => a.date.localeCompare(b.date));
}
