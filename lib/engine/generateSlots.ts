import { TimeRange, Slot } from "./types";

export function generateSlots(
  range: TimeRange,
  slotDuration: number
): Slot[] {
  const slots: Slot[] = [];

  let current = toMinutes(range.start);
  const end = toMinutes(range.end);

  while (current + slotDuration <= end) {
    slots.push({
      start: fromMinutes(current),
      end: fromMinutes(current + slotDuration),
    });
    current += slotDuration;
  }

  return slots;
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function fromMinutes(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
