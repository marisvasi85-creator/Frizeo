import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { barberId, date, time } = body;

    if (!barberId || !date || !time) {
      return NextResponse.json(
        { error: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("bookings")
      .insert({
        barber_id: barberId,
        day: date,      // 🔴 FOARTE IMPORTANT (NU date)
        time: time,
        duration: 30,
        first_name: "Client",
        last_name: "Online",
        phone: "0000000000",
        email: "client@test.ro",
        service: "Tuns",
        status: "confirmed",
      });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "SLOT_ALREADY_BOOKED" },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "BOOKING_FAILED", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: "INVALID_REQUEST" },
      { status: 400 }
    );
  }
}
