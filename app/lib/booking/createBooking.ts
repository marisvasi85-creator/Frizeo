import { supabase } from "@/app/lib/supabase";

function getDayFromDate(date: string): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[new Date(date).getDay()];
}

export async function createBooking(
  barberId: string,
  date: string,
  time: string
) {
  const day = getDayFromDate(date);

  const { error } = await supabase
    .from("bookings")
    .insert({
      barber_id: barberId,
      date,
      time,
      day,               // ✅ FIXUL CRITIC
      duration: 30,
      status: "confirmed",

      // date minime client
      first_name: "Client",
      last_name: "Online",
      phone: "0000000000",
      email: "client@test.ro",
      service: "Tuns",
    })
    .select(); // ⚠️ IMPORTANT pt Supabase

  if (error) {
    console.error("❌ createBooking error:", error);

    if (error.code === "23505") {
      // index unic → slot deja ocupat
      throw new Error("SLOT_ALREADY_BOOKED");
    }

    throw new Error("BOOKING_FAILED");
  }
}
