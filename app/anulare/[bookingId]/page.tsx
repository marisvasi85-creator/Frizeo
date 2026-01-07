"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useParams } from "next/navigation";

export default function CancelBookingPage() {
  const { bookingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) return;

    const cancelBooking = async () => {
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", bookingId)
        .eq("status", "active"); // protecție

      if (error) {
        setError("Programarea nu a putut fi anulată.");
      } else {
        setDone(true);
      }

      setLoading(false);
    };

    cancelBooking();
  }, [bookingId]);

  if (loading) {
    return <p style={{ padding: 40 }}>Se anulează programarea...</p>;
  }

  if (error) {
    return <p style={{ padding: 40, color: "red" }}>{error}</p>;
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Programare anulată</h1>
      <p>Programarea ta a fost anulată cu succes.</p>
    </main>
  );
}
