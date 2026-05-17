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
