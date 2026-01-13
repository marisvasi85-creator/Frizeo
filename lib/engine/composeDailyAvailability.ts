import {
  WeeklyScheduleDay,
  BarberSettings,
  Booking,
  Slot,
} from "./types";
import { generateSlots } from "./generateSlots";
import { removeBookedSlots } from "./removeBookedSlots";
import { applyBreak } from "./applyDayOverrides";

export function composeDailyAvailability({
  date,
  weeklySchedule,
  settings,
  bookings,
}: {
  date: string;
  weeklySchedule: WeeklyScheduleDay[];
  settings: BarberSettings;
  bookings: Booking[];
}): Slot[] {
  const weekday = getWeekday(date);

  const dayConfig = weeklySchedule.find(d => d.weekday === weekday);

  if (!dayConfig || !dayConfig.working || !dayConfig.range) {
    return [];
  }

  let slots = generateSlots(
    dayConfig.range,
    settings.slotDuration
  );

  slots = applyBreak(slots, settings.break);
  slots = removeBookedSlots(slots, bookings);

  return slots;
}

function getWeekday(date: string) {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 ? 7 : day;
}
