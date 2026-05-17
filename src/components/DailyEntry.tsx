import { PRODUCTS } from '../lib/products';
import { expectedClosing, StockEntry } from '../lib/stock';

type Props = {
  date: string;
  entries: StockEntry[];
  onDateChange: (date: string) => void;
  onChange: (entries: StockEntry[]) => void;
  onUpdate: () => void;
  onFinalSave: () => void;
};

export default function DailyEntry({ date, entries, onDateChange, onChange, onUpdate, onFinalSave }: Props) {
  function patch(index: number, changes: Partial<StockEntry>) {
    onChange(entries.map((entry, current) => current === index ? { ...entry, ...changes } : entry));
  }

  return (
    <section>
      <div className="toolbar">
        <label>Date <input type="date" value={date} onChange={(event) => onDateChange(event.target.value)} /></label>
        <div className="button-row">
          <button onClick={onUpdate}>Update now</button>
          <button onClick={onFinalSave}>Final save day</button>
        </div>
      </div>
      <p className="hint">Use Update now during the day. Use Final save day at closing time.</p>
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
              {entry.isFinal && <p className="final-badge">Final saved</p>}
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
