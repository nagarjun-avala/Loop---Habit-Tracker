import type { DaySummary, Habit, TimeOfDay } from "./types";

export const TODAY_LABEL = "Monday, 16 November";

export const weekDays: DaySummary[] = [
  { label: "Fri", date: 13, percent: 75 },
  { label: "Sat", date: 14, percent: 100 },
  { label: "Sun", date: 15, percent: 88 },
  { label: "Mon", date: 16, percent: 63, isToday: true },
  { label: "Tue", date: 17, percent: null },
  { label: "Wed", date: 18, percent: null },
  { label: "Thu", date: 19, percent: null },
];

export const groupOrder: TimeOfDay[] = ["Morning", "Afternoon", "Evening"];

const h = (s: string) => s.split("").map((c) => c === "1");

export const habits: Habit[] = [
  { id: "wake", name: "Wake up at 6:30", time: "6:30 AM", group: "Morning", streak: 21, history: h("1010110"), done: true },
  { id: "water", name: "Drink 2 glasses of water", time: "7:00 AM", group: "Morning", streak: 14, history: h("1010011"), done: true },
  { id: "workout", name: "20-minute workout", time: "7:30 AM", group: "Morning", streak: 9, history: h("0011111"), done: true },
  { id: "meditate", name: "Meditate for 10 minutes", time: "8:00 AM", group: "Morning", streak: 6, history: h("0110011"), done: true },
  { id: "read", name: "Read 20 pages", time: "1:00 PM", group: "Afternoon", streak: 32, history: h("0111100"), done: true },
  { id: "deepwork", name: "Two-hour deep work block", time: "3:00 PM", group: "Afternoon", streak: 5, history: h("0111111"), done: false },
  { id: "journal", name: "Write a journal entry", time: "9:00 PM", group: "Evening", streak: 12, history: h("1101111"), done: false },
  { id: "screens", name: "No screens after 10 PM", time: "10:00 PM", group: "Evening", streak: 3, history: h("1101101"), done: false },
];

export const weeklyStat = { percent: 88, delta: 6 };
