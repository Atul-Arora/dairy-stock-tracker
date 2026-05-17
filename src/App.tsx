import { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import DailyEntry from './components/DailyEntry';
import ExportPanel from './components/ExportPanel';
import { todayIso } from './lib/dates';
import { buildEmptyDay, buildNextDayEntries, StockEntry } from './lib/stock';
import { loadEntries, saveEntries, upsertDay } from './lib/storage';

export default function App() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [date, setDate] = useState(todayIso());
  const [dayEntries, setDayEntries] = useState<StockEntry[]>([]);

  useEffect(() => setEntries(loadEntries()), []);

  useEffect(() => {
    const existing = entries.filter((entry) => entry.date === date);
    if (existing.length) {
      setDayEntries(existing);
      return;
    }
    const previousDates = [...new Set(entries.map((entry) => entry.date))].filter((item) => item < date).sort();
    const previousDate = previousDates[previousDates.length - 1];
    const previous = previousDate ? entries.filter((entry) => entry.date === previousDate) : [];
    setDayEntries(previous.length ? buildNextDayEntries(date, previous) : buildEmptyDay(date));
  }, [date, entries]);

  const savedDates = useMemo(() => [...new Set(entries.map((entry) => entry.date))].length, [entries]);

  function saveDay() {
    const next = upsertDay(entries, dayEntries);
    setEntries(next);
    saveEntries(next);
  }

  return (
    <main className="app">
      <header>
        <h1>Dairy Stock</h1>
        <p>{savedDates} saved days</p>
      </header>
      <DailyEntry date={date} entries={dayEntries} onDateChange={setDate} onChange={setDayEntries} onSave={saveDay} />
      <Dashboard entries={entries} />
      <ExportPanel entries={entries} />
    </main>
  );
}
