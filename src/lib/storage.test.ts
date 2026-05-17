import { describe, expect, it } from 'vitest';
import { mergeEntries } from './storage';
import { StockEntry } from './stock';

const base: StockEntry = {
  date: '2026-05-18',
  weekday: 'Monday',
  product: 'milk',
  openingQty: 0,
  madeOrReceivedQty: 0,
  soldQty: 10,
  wastedQty: 0,
  closingQty: 0,
  stockoutTime: '',
  missedCustomersCount: 0,
  notes: '',
};

describe('mergeEntries', () => {
  it('merges local and cloud entries by date and product with cloud taking precedence', () => {
    const merged = mergeEntries(
      [{ ...base, soldQty: 10 }],
      [{ ...base, soldQty: 12 }],
    );

    expect(merged).toHaveLength(1);
    expect(merged[0].soldQty).toBe(12);
  });

  it('sorts merged entries by date then product', () => {
    const merged = mergeEntries([
      { ...base, date: '2026-05-19', product: 'curd' },
      { ...base, date: '2026-05-18', product: 'milk' },
    ], []);

    expect(merged.map((entry) => `${entry.date}-${entry.product}`)).toEqual([
      '2026-05-18-milk',
      '2026-05-19-curd',
    ]);
  });
});
