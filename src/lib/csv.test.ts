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
