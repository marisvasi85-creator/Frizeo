import { composeDailyAvailability } from "@/lib/engine";
import {
  WeeklyScheduleDay,
  BarberSettings,
  Booking,
} from "@/lib/engine/types";

export default function TestEnginePage() {
  const weeklySchedule: WeeklyScheduleDay[] = [
    {
      weekday: 1,
      working: true,
      range: { start: "09:00", end: "17:00" },
    },
  ];

  const settings: BarberSettings = {
    slotDuration: 30,
    break: { start: "12:00", end: "13:00" },
  };

  const bookings: Booking[] = [
    {
      date: "2026-01-12",
      startTime: "10:00",
      duration: 60,
    },
  ];

  const slots = composeDailyAvailability({
    date: "2026-01-12",
    weeklySchedule,
    settings,
    bookings,
  });

  return (
    <div style={{ padding: 24 }}>
      <h1>🧠 Engine Test</h1>
      <pre>{JSON.stringify(slots, null, 2)}</pre>
    </div>
  );
}
