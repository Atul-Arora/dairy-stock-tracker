import { useEffect, useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import DailyEntry from './components/DailyEntry';
import ExportPanel from './components/ExportPanel';
import { loadCloudEntries, saveDayToCloud } from './lib/cloudStorage';
import { todayIso } from './lib/dates';
import { buildEmptyDay, buildNextDayEntries, markDayFinal, markDayUpdated, StockEntry } from './lib/stock';
import { loadEntries, mergeEntries, saveEntries, upsertDay } from './lib/storage';

export default function App() {
  const [entries, setEntries] = useState<StockEntry[]>([]);
  const [date, setDate] = useState(todayIso());
  const [dayEntries, setDayEntries] = useState<StockEntry[]>([]);
  const [syncStatus, setSyncStatus] = useState('Loading local data...');

  useEffect(() => {
    const localEntries = loadEntries();
    setEntries(localEntries);
    setSyncStatus('Syncing cloud backup...');
    loadCloudEntries()
      .then((cloudEntries) => {
        const merged = mergeEntries(localEntries, cloudEntries);
        setEntries(merged);
        saveEntries(merged);
        setSyncStatus(`Cloud synced: ${merged.length} records`);
      })
      .catch(() => {
        setSyncStatus('Offline/local mode: cloud sync failed');
      });
  }, []);

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

  async function persistDay(entriesToPersist: StockEntry[], message: string) {
    const next = upsertDay(entries, entriesToPersist);
    setDayEntries(entriesToPersist);
    setEntries(next);
    saveEntries(next);
    setSyncStatus('Saving cloud backup...');
    try {
      await saveDayToCloud(entriesToPersist);
      setSyncStatus(message);
    } catch {
      setSyncStatus('Saved on phone. Cloud backup failed.');
    }
  }

  function updateNow() {
    void persistDay(markDayUpdated(dayEntries, new Date().toISOString()), 'Progress update synced');
  }

  function finalSaveDay() {
    void persistDay(markDayFinal(dayEntries, new Date().toISOString()), 'Final day saved and synced');
  }

  return (
    <main className="app">
      <header>
        <h1>Dairy Stock</h1>
        <div>
          <p>{savedDates} saved days</p>
          <p className="sync-status">{syncStatus}</p>
        </div>
      </header>
      <DailyEntry date={date} entries={dayEntries} onDateChange={setDate} onChange={setDayEntries} onUpdate={updateNow} onFinalSave={finalSaveDay} />
      <Dashboard entries={entries} />
      <ExportPanel entries={entries} />
    </main>
  );
}
