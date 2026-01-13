type Slot = { start: string; end: string };
type Booking = { time: string; duration: number };

function addMinutes(time: string, minutes: number) {
  const [h, m] = time.split(":").map(Number);
  const d = new Date();
  d.setHours(h, m + minutes, 0, 0);
  return d.toTimeString().slice(0, 5);
}

export function filterBookedSlots(
  slots: Slot[],
  bookings: Booking[]
): Slot[] {
  return slots.filter((slot) => {
    return !bookings.some((b) => {
      const bookingEnd = addMinutes(b.time, b.duration);
      return (
        slot.start < bookingEnd &&
        slot.end > b.time
      );
    });
  });
}
