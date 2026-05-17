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

export function mergeEntries(localEntries: StockEntry[], cloudEntries: StockEntry[]): StockEntry[] {
  const byKey = new Map<string, StockEntry>();
  for (const entry of localEntries) byKey.set(entryKey(entry), entry);
  for (const entry of cloudEntries) byKey.set(entryKey(entry), entry);
  return [...byKey.values()].sort((a, b) => `${a.date}-${a.product}`.localeCompare(`${b.date}-${b.product}`));
}

function entryKey(entry: StockEntry): string {
  return `${entry.date}_${entry.product}`;
}
