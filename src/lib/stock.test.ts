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
