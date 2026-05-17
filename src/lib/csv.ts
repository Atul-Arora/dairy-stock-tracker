import { StockEntry } from './stock';

const HEADER = ['date', 'weekday', 'product', 'opening_qty', 'made_or_received_qty', 'sold_qty', 'wasted_qty', 'closing_qty', 'stockout_time', 'missed_customers_count', 'notes', 'is_final', 'last_updated_at', 'final_saved_at'];

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
      entry.isFinal ?? false,
      entry.lastUpdatedAt ?? '',
      entry.finalSavedAt ?? '',
    ].map(csvCell).join(',')),
  ].join('\n');
}

function csvCell(value: string | number | boolean): string {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
