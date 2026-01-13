"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Slot = {
  start: string; // "09:00"
  end: string;   // "09:30"
  disabled?: boolean;
};

export default function BookingSlotPicker() {
  const { barberId } = useParams<{ barberId: string }>();
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState<string>("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===============================
     LOAD SLOTURI PENTRU DATA ALEASĂ
     =============================== */
  useEffect(() => {
    if (!selectedDate) return;

    const loadSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);

      try {
        const res = await fetch(
          `/api/slots?barberId=${barberId}&date=${selectedDate}`
        );
        const data = await res.json();

        setSlots(data.slots || []);
      } catch (err) {
        console.error("Eroare la încărcarea sloturilor", err);
        setSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [selectedDate, barberId]);

  /* ===============================
     CONFIRMĂ PROGRAMAREA
     =============================== */
  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedSlot) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          barberId,
          date: selectedDate,
          time: selectedSlot.start,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "SLOT_ALREADY_BOOKED") {
          alert("❌ Slot deja ocupat");
          return;
        }

        alert("❌ Eroare la salvarea programării");
        return;
      }

      // ✅ SUCCESS
      router.push("/confirmare");
    } catch (err) {
      console.error(err);
      alert("❌ Eroare neașteptată");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===============================
     UI
     =============================== */
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl p-6 shadow">
      <h2 className="text-xl font-semibold mb-4">Programare</h2>

      {/* DATA */}
      <label className="block mb-2 text-sm font-medium">Alege data</label>
      <input
        type="date"
        className="w-full border rounded px-3 py-2 mb-4"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {/* SLOTURI */}
      {loadingSlots && <p>Se încarcă sloturile...</p>}

      {!loadingSlots && slots.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          {slots.map((slot) => {
            const isSelected = selectedSlot?.start === slot.start;

            return (
              <button
                key={slot.start}
                disabled={slot.disabled}
                onClick={() => setSelectedSlot(slot)}
                className={`
                  px-2 py-2 rounded text-sm border
                  ${
                    slot.disabled
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : isSelected
                      ? "bg-green-600 text-white"
                      : "bg-white hover:bg-green-100"
                  }
                `}
              >
                {slot.start}
              </button>
            );
          })}
        </div>
      )}

      {/* CONFIRMARE */}
      <button
        onClick={handleConfirmBooking}
        disabled={!selectedSlot || isSubmitting}
        className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? "Se salvează..." : "Confirmă programarea"}
      </button>
    </div>
  );
}
