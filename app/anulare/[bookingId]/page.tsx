"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

type Booking = {
  id: string;
  day: string;
  time: string;
  client_name: string;
  status: string;
};

export default function CancelBookingPage({
  params,
}: {
  params: { bookingId: string };
}) {
  const { bookingId } = params;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, day, time, client_name, status")
        .eq("id", bookingId)
        .single();

      setBooking(data);
      setLoading(false);
    };

    fetchBooking();
  }, [bookingId]);

  const isTooLateToCancel = () => {
  if (!booking) return true;

  const bookingDate = new Date(`${booking.day}T${booking.time}:00`);
  const now = new Date();

  const diffMs = bookingDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours < 2;
};

  const cancelBooking = async () => {
    if (!booking) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);

    if (error) {
      alert("Eroare la anulare");
      return;
    }

    setDone(true);
  };

  if (loading) {
    return <p style={{ padding: 40 }}>Se încarcă...</p>;
  }

  if (!booking) {
    return <p style={{ padding: 40 }}>Programarea nu există.</p>;
  }

  if (booking.status === "cancelled" || done) {
    return (
      <main style={{ padding: 40 }}>
        <h1>Programare anulată</h1>
        <p>Programarea a fost deja anulată.</p>
      </main>
    );
  }

  return (
  <main style={{ padding: 40 }}>
    <h1>Anulare programare</h1>

    <p>
      <strong>{booking.client_name}</strong>, ai programarea din:
    </p>

    <p>
      📅 {booking.day}
      <br />
      ⏰ {booking.time}
    </p>

    {/* 👇 AICI ESTE TERNARY-UL */}
    {isTooLateToCancel() ? (
      <p style={{ color: "#c00", marginTop: 20 }}>
        ❌ Programarea nu mai poate fi anulată cu mai puțin de 2 ore înainte.
      </p>
    ) : (
      <button
        onClick={cancelBooking}
        style={{
          marginTop: 20,
          padding: 14,
          background: "#c00",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontSize: 16,
        }}
      >
        Anulează programarea
      </button>
    )}
  </main>
);
}