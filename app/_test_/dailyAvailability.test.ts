import { composeDailyAvailability } from "../../lib/engine/composeDailyAvailability";
import {
  WeeklyScheduleDay,
  BarberSettings,
  Booking,
  DayOverride,
} from "../../lib/engine/types";

/* ================= MOCK DATA ================= */

// Program săptămânal
const weeklySchedule: WeeklyScheduleDay[] = [
  {
    weekday: 1, // Luni
    working: true,
    range: { start: "09:00", end: "17:00" },
  },
];

// Setări globale
const settings: BarberSettings = {
  slotDuration: 30,
  break: { start: "12:00", end: "13:00" },
};

// Booking existent
const bookings: Booking[] = [
  {
    date: "2026-01-12", // Luni
    startTime: "10:00",
    duration: 60, // ocupă 10:00–11:00
  },
];

// Fără override
const override: DayOverride | undefined = undefined;

/* ================= TEST ================= */

const result = composeDailyAvailability({
  date: "2026-01-12",
  weeklySchedule,
  settings,
  override,
  bookings,
});

console.log("🔍 AVAILABLE SLOTS:", result.availableSlots);

const overrideClosed: DayOverride = {
  date: "2026-01-12",
  closed: true,
};

const closedResult = composeDailyAvailability({
  date: "2026-01-12",
  weeklySchedule,
  settings,
  override: overrideClosed,
  bookings,
});

console.log("🚫 CLOSED DAY:", closedResult.availableSlots);
