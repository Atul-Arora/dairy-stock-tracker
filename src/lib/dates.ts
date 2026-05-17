export type Weekday = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export function weekdayFromDate(date: string): Weekday {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long' }) as Weekday;
}

export function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}
