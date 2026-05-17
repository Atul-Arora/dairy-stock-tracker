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
