import { Slot, Booking } from "./types";

export function removeBookedSlots(
  slots: Slot[],
  bookings: Booking[]
): Slot[] {
  return slots.filter(slot => {
    const slotStart = toMinutes(slot.start);
    const slotEnd = toMinutes(slot.end);

    return !bookings.some(b => {
      const bStart = toMinutes(b.startTime);
      const bEnd = bStart + b.duration;

      return slotStart < bEnd && slotEnd > bStart;
    });
  });
}

function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
