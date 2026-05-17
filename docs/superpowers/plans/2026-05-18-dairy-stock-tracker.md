# Dairy Stock Tracker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an offline-first Android-friendly PWA for daily dairy stock tracking, missed demand capture, dashboard graphs, and CSV export.

**Architecture:** Fresh Vite React TypeScript app. Business logic lives in pure modules under `src/lib`; UI lives in small components under `src/components`; data persists to browser `localStorage` through one repository module. No backend in version 1.

**Tech Stack:** Vite, React, TypeScript, Vitest, CSS, Web App Manifest, manual CSV export, localStorage.

---

## File Structure

- `package.json`: scripts and dependencies.
- `index.html`: app shell.
- `vite.config.ts`: Vite + Vitest config.
- `src/main.tsx`: React bootstrap.
- `src/App.tsx`: page state and top-level layout.
- `src/styles.css`: mobile-first UI.
- `src/lib/products.ts`: product IDs, labels, units, precision.
- `src/lib/dates.ts`: ISO date and weekday helpers.
- `src/lib/stock.ts`: stock math, carry-forward, summaries, suggestions.
- `src/lib/storage.ts`: localStorage repository.
- `src/lib/csv.ts`: CSV export.
- `src/components/DailyEntry.tsx`: daily product entry cards.
- `src/components/Dashboard.tsx`: summaries and graphs.
- `src/components/ExportPanel.tsx`: CSV export controls.
- `src/components/SimpleBarChart.tsx`: lightweight SVG chart.
- `src/**/*.test.ts`: pure logic tests.
- `public/manifest.webmanifest`: install metadata.
- `public/sw.js`: offline asset cache.

## Task 1: Scaffold App And Tests

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Create project config**

`package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "vitest": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest"
  }
}
```

- [ ] **Step 2: Add Vite config**

`vite.config.ts`:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'node',
  },
});
```

- [ ] **Step 3: Add TypeScript config**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": []
}
```

- [ ] **Step 4: Add app shell**

`index.html`:

```html
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

`src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

`src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app">
      <h1>Dairy Stock</h1>
      <p>Daily stock tracker loading.</p>
    </main>
  );
}
```

`src/styles.css`:

```css
body { margin: 0; font-family: system-ui, sans-serif; background: #f7f7f2; color: #1e1e1a; }
.app { max-width: 860px; margin: 0 auto; padding: 16px; }
```

- [ ] **Step 5: Install and verify**

Run: `npm install`

Run: `npm test`

Expected: Vitest runs with no test files or reports clean pass/no tests depending version.

## Task 2: Data Model And Stock Logic

**Files:**
- Create: `src/lib/products.ts`
- Create: `src/lib/dates.ts`
- Create: `src/lib/stock.ts`
- Create: `src/lib/stock.test.ts`

- [ ] **Step 1: Write tests**

`src/lib/stock.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { buildNextDayEntries, expectedClosing, weekdayAverageSold } from './stock';

describe('stock math', () => {
  it('calculates expected closing quantity', () => {
    expect(expectedClosing({ openingQty: 10, madeOrReceivedQty: 5, soldQty: 12, wastedQty: 1 })).toBe(2);
  });

  it('carries closing quantity into next day opening quantity', () => {
    const next = buildNextDayEntries('2026-05-19', [
      { date: '2026-05-18', weekday: 'Monday', product: 'milk', openingQty: 5, madeOrReceivedQty: 20, soldQty: 18, wastedQty: 0, closingQty: 7, stockoutTime: '', missedCustomersCount: 0, notes: '' },
    ]);
    expect(next[0].openingQty).toBe(7);
    expect(next[0].date).toBe('2026-05-19');
  });

  it('averages sold quantity for same weekday only', () => {
    const avg = weekdayAverageSold([
      { date: '2026-05-04', weekday: 'Monday', product: 'milk', openingQty: 0, madeOrReceivedQty: 0, soldQty: 40, wastedQty: 0, closingQty: 0, stockoutTime: '', missedCustomersCount: 0, notes: '' },
      { date: '2026-05-11', weekday: 'Monday', product: 'milk', openingQty: 0, madeOrReceivedQty: 0, soldQty: 50, wastedQty: 0, closingQty: 0, stockoutTime: '', missedCustomersCount: 0, notes: '' },
      { date: '2026-05-12', weekday: 'Tuesday', product: 'milk', openingQty: 0, madeOrReceivedQty: 0, soldQty: 90, wastedQty: 0, closingQty: 0, stockoutTime: '', missedCustomersCount: 0, notes: '' },
    ], 'milk', 'Monday');
    expect(avg).toBe(45);
  });
});
```

- [ ] **Step 2: Run failing tests**

Run: `npm test`

Expected: FAIL because modules do not exist.

- [ ] **Step 3: Implement model**

`src/lib/products.ts`:

```ts
export type ProductId = 'milk' | 'paneer' | 'curd';

export const PRODUCTS: Array<{ id: ProductId; label: string; unit: string; decimals: number }> = [
  { id: 'milk', label: 'Milk', unit: 'L', decimals: 1 },
  { id: 'paneer', label: 'Paneer', unit: 'kg', decimals: 2 },
  { id: 'curd', label: 'Curd', unit: 'kg', decimals: 2 },
];
```

`src/lib/dates.ts`:

```ts
export type Weekday = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export function weekdayFromDate(date: string): Weekday {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' }) as Weekday;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
```

`src/lib/stock.ts`:

```ts
import { PRODUCTS, ProductId } from './products';
import { Weekday, weekdayFromDate } from './dates';

export type StockEntry = {
  date: string;
  weekday: Weekday;
  product: ProductId;
  openingQty: number;
  madeOrReceivedQty: number;
  soldQty: number;
  wastedQty: number;
  closingQty: number;
  stockoutTime: string;
  missedCustomersCount: number;
  notes: string;
};

export function expectedClosing(input: Pick<StockEntry, 'openingQty' | 'madeOrReceivedQty' | 'soldQty' | 'wastedQty'>): number {
  return roundQty(input.openingQty + input.madeOrReceivedQty - input.soldQty - input.wastedQty);
}

export function roundQty(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildEmptyDay(date: string): StockEntry[] {
  const weekday = weekdayFromDate(date);
  return PRODUCTS.map((product) => ({
    date,
    weekday,
    product: product.id,
    openingQty: 0,
    madeOrReceivedQty: 0,
    soldQty: 0,
    wastedQty: 0,
    closingQty: 0,
    stockoutTime: '',
    missedCustomersCount: 0,
    notes: '',
  }));
}

export function buildNextDayEntries(date: string, previousEntries: StockEntry[]): StockEntry[] {
  const weekday = weekdayFromDate(date);
  return PRODUCTS.map((product) => {
    const previous = previousEntries.find((entry) => entry.product === product.id);
    return {
      date,
      weekday,
      product: product.id,
      openingQty: previous?.closingQty ?? 0,
      madeOrReceivedQty: 0,
      soldQty: 0,
      wastedQty: 0,
      closingQty: previous?.closingQty ?? 0,
      stockoutTime: '',
      missedCustomersCount: 0,
      notes: '',
    };
  });
}

export function weekdayAverageSold(entries: StockEntry[], product: ProductId, weekday: Weekday): number {
  const matches = entries.filter((entry) => entry.product === product && entry.weekday === weekday);
  if (matches.length === 0) return 0;
  return roundQty(matches.reduce((sum, entry) => sum + entry.soldQty, 0) / matches.length);
}
```

- [ ] **Step 4: Verify**

Run: `npm test`

Expected: PASS.

## Task 3: Storage And CSV Export

**Files:**
- Create: `src/lib/storage.ts`
- Create: `src/lib/csv.ts`
- Create: `src/lib/csv.test.ts`

- [ ] **Step 1: Write CSV test**

`src/lib/csv.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { entriesToCsv } from './csv';

describe('entriesToCsv', () => {
  it('exports stable analysis-friendly columns', () => {
    const csv = entriesToCsv([
      { date: '2026-05-18', weekday: 'Monday', product: 'milk', openingQty: 10, madeOrReceivedQty: 20, soldQty: 25, wastedQty: 1, closingQty: 4, stockoutTime: '18:15', missedCustomersCount: 3, notes: 'busy evening' },
    ]);
    expect(csv.split('\n')[0]).toBe('date,weekday,product,opening_qty,made_or_received_qty,sold_qty,wasted_qty,closing_qty,stockout_time,missed_customers_count,notes');
    expect(csv).toContain('2026-05-18,Monday,milk,10,20,25,1,4,18:15,3,busy evening');
  });
});
```

- [ ] **Step 2: Run failing test**

Run: `npm test`

Expected: FAIL because `entriesToCsv` missing.

- [ ] **Step 3: Implement storage and CSV**

`src/lib/storage.ts`:

```ts
import { StockEntry } from './stock';

const STORAGE_KEY = 'dairy-stock-v1';

export function loadEntries(): StockEntry[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveEntries(entries: StockEntry[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function upsertDay(entries: StockEntry[], dayEntries: StockEntry[]): StockEntry[] {
  const date = dayEntries[0]?.date;
  if (!date) return entries;
  return [...entries.filter((entry) => entry.date !== date), ...dayEntries].sort((a, b) => a.date.localeCompare(b.date));
}
```

`src/lib/csv.ts`:

```ts
import { StockEntry } from './stock';

const HEADER = ['date', 'weekday', 'product', 'opening_qty', 'made_or_received_qty', 'sold_qty', 'wasted_qty', 'closing_qty', 'stockout_time', 'missed_customers_count', 'notes'];

export function entriesToCsv(entries: StockEntry[]): string {
  return [
    HEADER.join(','),
    ...entries.map((entry) => [
      entry.date,
      entry.weekday,
      entry.product,
      entry.openingQty,
      entry.madeOrReceivedQty,
      entry.soldQty,
      entry.wastedQty,
      entry.closingQty,
      entry.stockoutTime,
      entry.missedCustomersCount,
      entry.notes,
    ].map(csvCell).join(',')),
  ].join('\n');
}

function csvCell(value: string | number): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
```

- [ ] **Step 4: Verify**

Run: `npm test`

Expected: PASS.

## Task 4: Daily Entry UI

**Files:**
- Create: `src/components/DailyEntry.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Build entry component**

`src/components/DailyEntry.tsx`:

```tsx
import { PRODUCTS } from '../lib/products';
import { expectedClosing, StockEntry } from '../lib/stock';

type Props = {
  date: string;
  entries: StockEntry[];
  onDateChange: (date: string) => void;
  onChange: (entries: StockEntry[]) => void;
  onSave: () => void;
};

export default function DailyEntry({ date, entries, onDateChange, onChange, onSave }: Props) {
  function patch(index: number, changes: Partial<StockEntry>) {
    onChange(entries.map((entry, current) => current === index ? { ...entry, ...changes } : entry));
  }

  return (
    <section>
      <div className="toolbar">
        <label>Date <input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} /></label>
        <button onClick={onSave}>Save day</button>
      </div>
      <div className="product-grid">
        {entries.map((entry, index) => {
          const product = PRODUCTS.find((item) => item.id === entry.product)!;
          const expected = expectedClosing(entry);
          const mismatch = Math.abs(expected - entry.closingQty) > 0.01;
          return (
            <article className="product-card" key={entry.product}>
              <h2>{product.label}</h2>
              <p className="muted">Unit: {product.unit}</p>
              <NumberField label="Opening" value={entry.openingQty} onChange={(value) => patch(index, { openingQty: value })} />
              <NumberField label="Made/received" value={entry.madeOrReceivedQty} onChange={(value) => patch(index, { madeOrReceivedQty: value })} />
              <NumberField label="Sold" value={entry.soldQty} onChange={(value) => patch(index, { soldQty: value })} />
              <NumberField label="Wasted" value={entry.wastedQty} onChange={(value) => patch(index, { wastedQty: value })} />
              <NumberField label="Closing" value={entry.closingQty} onChange={(value) => patch(index, { closingQty: value })} />
              {mismatch && <p className="warning">Expected closing: {expected} {product.unit}</p>}
              <label>Stockout time <input type="time" value={entry.stockoutTime} onChange={(event) => patch(index, { stockoutTime: event.target.value })} /></label>
              <div className="counter-row">
                <span>Missed: {entry.missedCustomersCount}</span>
                <button onClick={() => patch(index, { missedCustomersCount: entry.missedCustomersCount + 1 })}>+1 missed customer</button>
              </div>
              <label>Notes <textarea value={entry.notes} onChange={(event) => patch(index, { notes: event.target.value })} /></label>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label>{label}
      <input type="number" min="0" step="0.01" value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
```

- [ ] **Step 2: Wire app state**

Replace `src/App.tsx`:

```tsx
import { useEffect, useMemo, useState } from 'react';
import DailyEntry from './components/DailyEntry';
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
    const previousDate = [...new Set(entries.map((entry) => entry.date))].filter((item) => item < date).sort().at(-1);
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
    </main>
  );
}
```

- [ ] **Step 3: Add mobile CSS**

Append to `src/styles.css`:

```css
button, input, textarea { font: inherit; }
button { border: 0; border-radius: 8px; padding: 10px 12px; background: #156b43; color: white; }
input, textarea { width: 100%; box-sizing: border-box; padding: 10px; border: 1px solid #cfcfc7; border-radius: 8px; background: white; }
label { display: grid; gap: 6px; font-weight: 650; }
header, .toolbar { display: flex; justify-content: space-between; gap: 12px; align-items: center; flex-wrap: wrap; }
.product-grid { display: grid; gap: 12px; margin-top: 16px; }
.product-card { display: grid; gap: 10px; background: white; border: 1px solid #deded4; border-radius: 8px; padding: 14px; }
.product-card h2 { margin: 0; }
.muted { color: #666; margin: 0; }
.warning { margin: 0; padding: 8px; border-radius: 8px; background: #fff3cd; color: #6b4e00; }
.counter-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
@media (min-width: 760px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
```

- [ ] **Step 4: Verify**

Run: `npm run build`

Expected: PASS.

## Task 5: Dashboard, Graphs, Suggestions, Export

**Files:**
- Create: `src/components/SimpleBarChart.tsx`
- Create: `src/components/Dashboard.tsx`
- Create: `src/components/ExportPanel.tsx`
- Modify: `src/lib/stock.ts`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add summary helpers**

Append to `src/lib/stock.ts`:

```ts
export function totalMissed(entries: StockEntry[], product: ProductId): number {
  return entries.filter((entry) => entry.product === product).reduce((sum, entry) => sum + entry.missedCustomersCount, 0);
}

export function tomorrowSuggestion(entries: StockEntry[], product: ProductId, weekday: Weekday): { low: number; high: number } {
  const average = weekdayAverageSold(entries, product, weekday);
  const missedAverage = weekdayMissedAverage(entries, product, weekday);
  const adjusted = average + missedAverage * 0.5;
  return { low: roundQty(adjusted * 1.05), high: roundQty(adjusted * 1.15) };
}

export function weekdayMissedAverage(entries: StockEntry[], product: ProductId, weekday: Weekday): number {
  const matches = entries.filter((entry) => entry.product === product && entry.weekday === weekday);
  if (matches.length === 0) return 0;
  return roundQty(matches.reduce((sum, entry) => sum + entry.missedCustomersCount, 0) / matches.length);
}
```

- [ ] **Step 2: Create graph**

`src/components/SimpleBarChart.tsx`:

```tsx
type Point = { label: string; value: number };

export default function SimpleBarChart({ points }: { points: Point[] }) {
  const max = Math.max(1, ...points.map((point) => point.value));
  return (
    <div className="chart">
      {points.map((point) => (
        <div className="bar-row" key={point.label}>
          <span>{point.label}</span>
          <div className="bar-track"><div className="bar-fill" style={{ width: `${(point.value / max) * 100}%` }} /></div>
          <strong>{point.value}</strong>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create dashboard**

`src/components/Dashboard.tsx`:

```tsx
import { useState } from 'react';
import { PRODUCTS, ProductId } from '../lib/products';
import { StockEntry, tomorrowSuggestion, totalMissed, weekdayAverageSold } from '../lib/stock';
import { weekdayFromDate } from '../lib/dates';
import SimpleBarChart from './SimpleBarChart';

export default function Dashboard({ entries }: { entries: StockEntry[] }) {
  const [product, setProduct] = useState<ProductId>('milk');
  const productEntries = entries.filter((entry) => entry.product === product).slice(-30);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowIso = tomorrow.toISOString().slice(0, 10);
  const weekday = weekdayFromDate(tomorrowIso);
  const avg = weekdayAverageSold(entries, product, weekday);
  const suggestion = tomorrowSuggestion(entries, product, weekday);

  return (
    <section className="panel">
      <h2>Dashboard</h2>
      <label>Product
        <select value={product} onChange={(event) => setProduct(event.target.value as ProductId)}>
          {PRODUCTS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
        </select>
      </label>
      <div className="stats">
        <p>Tomorrow weekday: <strong>{weekday}</strong></p>
        <p>Previous {weekday} average sold: <strong>{avg}</strong></p>
        <p>Suggested stock: <strong>{suggestion.low} - {suggestion.high}</strong></p>
        <p>Total missed customers: <strong>{totalMissed(entries, product)}</strong></p>
      </div>
      <h3>Sold quantity</h3>
      <SimpleBarChart points={productEntries.map((entry) => ({ label: entry.date.slice(5), value: entry.soldQty }))} />
      <h3>Missed customers</h3>
      <SimpleBarChart points={productEntries.map((entry) => ({ label: entry.date.slice(5), value: entry.missedCustomersCount }))} />
    </section>
  );
}
```

- [ ] **Step 4: Create export panel**

`src/components/ExportPanel.tsx`:

```tsx
import { entriesToCsv } from '../lib/csv';
import { StockEntry } from '../lib/stock';

export default function ExportPanel({ entries }: { entries: StockEntry[] }) {
  function downloadCsv() {
    const blob = new Blob([entriesToCsv(entries)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dairy-stock-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="panel">
      <h2>Export</h2>
      <p>Download CSV for Excel, Sheets, Python, or AI model training.</p>
      <button onClick={downloadCsv} disabled={entries.length === 0}>Download CSV</button>
    </section>
  );
}
```

- [ ] **Step 5: Wire dashboard/export**

Modify `src/App.tsx` imports:

```tsx
import Dashboard from './components/Dashboard';
import ExportPanel from './components/ExportPanel';
```

Add after `DailyEntry`:

```tsx
<Dashboard entries={entries} />
<ExportPanel entries={entries} />
```

- [ ] **Step 6: Add CSS**

Append to `src/styles.css`:

```css
.panel { margin-top: 18px; background: white; border: 1px solid #deded4; border-radius: 8px; padding: 14px; }
select { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #cfcfc7; background: white; }
.stats { display: grid; gap: 6px; }
.stats p { margin: 0; }
.chart { display: grid; gap: 8px; }
.bar-row { display: grid; grid-template-columns: 52px 1fr 44px; gap: 8px; align-items: center; }
.bar-track { height: 14px; border-radius: 999px; background: #e8e8df; overflow: hidden; }
.bar-fill { height: 100%; background: #2f8f5b; }
```

- [ ] **Step 7: Verify**

Run: `npm run build`

Expected: PASS.

## Task 6: PWA Offline Install

**Files:**
- Create: `public/manifest.webmanifest`
- Create: `public/sw.js`
- Modify: `index.html`
- Modify: `src/main.tsx`

- [ ] **Step 1: Add manifest**

`public/manifest.webmanifest`:

```json
{
  "name": "Dairy Stock Tracker",
  "short_name": "Dairy Stock",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f7f7f2",
  "theme_color": "#156b43",
  "icons": []
}
```

- [ ] **Step 2: Register manifest and service worker**

Modify `index.html`:

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#156b43" />
<link rel="manifest" href="/manifest.webmanifest" />
<div id="root"></div>
<script type="module" src="/src/main.tsx"></script>
```

`public/sw.js`:

```js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
});
```

Append to `src/main.tsx`:

```ts
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}
```

- [ ] **Step 3: Verify**

Run: `npm run build`

Expected: PASS.

## Task 7: Final Verification

**Files:**
- Modify only if verification finds bugs.

- [ ] **Step 1: Run tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 2: Run production build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 3: Start local app**

Run: `npm run dev`

Expected: Vite URL opens and app shows daily entry, dashboard, and export sections.

- [ ] **Step 4: Manual smoke test**

In browser:

1. Enter milk opening `10`, made `20`, sold `25`, wasted `1`, closing `4`.
2. Confirm no warning because expected closing is `4`.
3. Set stockout time.
4. Click `+1 missed customer` twice.
5. Save day.
6. Change date to next day.
7. Confirm milk opening is `4`.
8. Download CSV.
9. Confirm CSV has one row per product per day and includes missed count.

Expected: all pass.

## Self-Review

- Spec coverage: daily stock, carry-forward, missed demand, stockout time, simple graphs, weekday averages, CSV export, offline PWA all covered.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: `StockEntry`, `ProductId`, `Weekday`, and CSV column names stay consistent across tasks.
