const LOCALE = "pt-BR";

export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function addDays(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return d;
}

export function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/** weekStartsOn: 0 = Sunday, 1 = Monday */
export function startOfWeek(date: Date, weekStartsOn: 0 | 1 = 0): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  return addDays(d, -diff);
}

export function endOfWeek(date: Date, weekStartsOn: 0 | 1 = 0): Date {
  return endOfDay(addDays(startOfWeek(date, weekStartsOn), 6));
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function isTomorrow(date: Date): boolean {
  return isSameDay(date, addDays(new Date(), 1));
}

export function isPast(date: Date): boolean {
  return date.getTime() < startOfDay(new Date()).getTime();
}

/** Returns a 6x7 grid of dates (42 days) covering the full month view */
export function getMonthGrid(date: Date, weekStartsOn: 0 | 1 = 0): Date[] {
  const firstDay = startOfWeek(startOfMonth(date), weekStartsOn);
  return Array.from({ length: 42 }, (_, i) => addDays(firstDay, i));
}

export function getWeekDays(date: Date, weekStartsOn: 0 | 1 = 0): Date[] {
  const first = startOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(first, i));
}

export function formatDayMonth(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, { day: "2-digit", month: "short" })
    .format(date)
    .replace(".", "")
    .toUpperCase();
}

export function formatWeekdayShort(date: Date): string {
  const s = new Intl.DateTimeFormat(LOCALE, { weekday: "short" }).format(date);
  return s.replace(".", "").replace(/^\w/, (c) => c.toUpperCase());
}

export function formatMonthYear(date: Date): string {
  const s = new Intl.DateTimeFormat(LOCALE, { month: "long", year: "numeric" }).format(
    date
  );
  return s.replace(/^\w/, (c) => c.toUpperCase());
}

export function formatFullDate(date: Date): string {
  const s = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
  return s;
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(LOCALE, { hour: "2-digit", minute: "2-digit" }).format(
    date
  );
}

export function formatRelativeDay(date: Date): string {
  if (isToday(date)) return "Hoje";
  if (isTomorrow(date)) return "Amanhã";
  return formatDayMonth(date);
}

export function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `há ${diffMin} min`;

  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `há ${diffHours}h`;

  const diffDays = Math.round(diffHours / 24);
  if (diffDays < 7) return `há ${diffDays}d`;

  return formatDayMonth(date);
}

/** Timezone-safe local date key (YYYY-MM-DD), unlike toISOString() which shifts to UTC. */
export function toDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toDateInputValue(date: Date): string {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}
