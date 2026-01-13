import { Slot, TimeRange } from "./types";

export function applyBreak(
  slots: Slot[],
  breakRange?: TimeRange
): Slot[] {
  if (!breakRange) return slots;

  const breakStart = toMinutes(breakRange.start);
  const breakEnd = toMinutes(breakRange.end);

  return slots.filter(slot => {
    const s = toMinutes(slot.start);
    const e = toMinutes(slot.end);
    return e <= breakStart || s >= breakEnd;
  });
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
