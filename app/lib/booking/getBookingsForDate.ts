import { supabase } from "@/app/lib/supabase";

export type BookingRow = {
  time: string;     // "09:00"
  duration: number; // minute
};

export async function getBookingsForDate(
  barberId: string,
  dateISO: string
): Promise<BookingRow[]> {
  const { data, error } = await supabase
    .from("bookings")
    .select("time, duration")
    .eq("barber_id", barberId)
    .eq("day", dateISO);

  if (error) {
    console.error("❌ bookings error:", error.message);
    return [];
  }

  return data ?? [];
}
