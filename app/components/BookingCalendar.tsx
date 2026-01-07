"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/* ================= TYPES ================= */
type Booking = {
  day: string;
  time: string;
};

type BarberSettings = {
  slot_duration: number;
  start_time: string;
  end_time: string;
  working_days: number[]; // 1=luni ... 7=duminică
};

type BarberDayOverride = {
  date: string;
  is_working: boolean;
  start_time: string | null;
  end_time: string | null;
};

/* ================= COMPONENT ================= */
export default function BookingCalendar({
  barberId,
}: {
  barberId: string;
}) {
  /* ================= STATE ================= */
  const [settings, setSettings] = useState<BarberSettings | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [overrides, setOverrides] = useState<BarberDayOverride[]>([]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
  if (!barberId) return;

  const fetchAll = async () => {
    // 🔹 settings
    const { data: s } = await supabase
      .from("barber_settings")
      .select("*")
      .eq("barber_id", barberId)
      .single();

    // 🔹 bookings (CU salon_id corect)
    const { data: b } = await supabase
      .from("bookings")
      .select("day, time")
      .eq("barber_id", barberId)
      .eq("salon_id", SALON_ID);

    // 🔹 overrides
    const { data: o } = await supabase
      .from("barber_day_overrides")
      .select("*")
      .eq("barber_id", barberId);

    if (s) {
      setSettings({
        slot_duration: s.slot_duration,
        start_time: s.start_time,
        end_time: s.end_time,
        working_days: s.working_days,
      });
    }

    setBookings(b ?? []);
    setOverrides(o ?? []);
  };

  fetchAll();
}, [barberId]);


  /* ================= HELPERS ================= */
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const SALON_ID = "6f1365d7-b391-457c-ac89-a80a40ae08cf";

  const isTooSoon = (day: string, time: string) => {
    const now = new Date();
    const slot = new Date(`${day}T${time}:00`);
    return (slot.getTime() - now.getTime()) / 3600000 < 2;
  };

  const overlapsBooking = (day: string, time: string) => {
    if (!settings) return false;

    const slotStart = new Date(`${day}T${time}:00`).getTime();
    const slotEnd =
      slotStart + settings.slot_duration * 60 * 1000;

    return bookings.some((b) => {
      if (b.day !== day) return false;

      const bookingStart = new Date(
        `${b.day}T${b.time}:00`
      ).getTime();
      const bookingEnd =
        bookingStart + settings.slot_duration * 60 * 1000;

      return slotStart < bookingEnd && slotEnd > bookingStart;
    });
  };

  const getSchedule = (date: string) => {
    if (!settings) return null;

    const override = overrides.find((o) => o.date === date);
    if (override) {
      if (!override.is_working) return null;
      return {
        start: override.start_time ?? settings.start_time,
        end: override.end_time ?? settings.end_time,
      };
    }

    const jsDay = new Date(`${date}T12:00:00`).getDay();
    const dbDay = jsDay === 0 ? 7 : jsDay;

    if (!settings.working_days.includes(dbDay)) return null;

    return {
      start: settings.start_time,
      end: settings.end_time,
    };
  };

  const generateSlots = (
    start: string,
    end: string,
    duration: number
  ) => {
    const slots: string[] = [];
    let current = toMinutes(start);
    const endM = toMinutes(end);

    while (current + duration <= endM) {
      const h = String(Math.floor(current / 60)).padStart(2, "0");
      const m = String(current % 60).padStart(2, "0");
      slots.push(`${h}:${m}`);
      current += duration;
    }

    return slots;
  };

  const createBooking = async () => {
  if (!selectedDay || !selectedTime || !clientName || !clientPhone) {
    alert("Completează numele și telefonul");
    return;
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      salon_id: SALON_ID,
      barber_id: barberId,
      day: selectedDay,
      time: selectedTime,
      client_name: clientName,
      client_phone: clientPhone,
      client_email: clientEmail || null,
    })
    .select("id") // 🔑 FOARTE IMPORTANT
    .single();

  if (error || !data) {
    alert("⛔ Slot deja ocupat");
    return;
  }

  const bookingId = data.id;

  // 📧 email doar dacă există email
  if (clientEmail) {
    await supabase.from("email_queue").insert({
      to_email: clientEmail,
      subject: "Confirmare programare",
      body: `
Salut ${clientName},

Programarea ta a fost confirmată:

📅 Data: ${selectedDay}
⏰ Ora: ${selectedTime}

❌ Anulează programarea:
https://siteul-tau.ro/anulare/${bookingId}

Te așteptăm!
`,
    });
  }

  // 🔄 update UI
  setBookings((prev) => [
    ...prev,
    { day: selectedDay, time: selectedTime },
  ]);

  alert("✅ Programare confirmată");

  setSelectedDay(null);
  setSelectedTime(null);
  setClientName("");
  setClientPhone("");
  setClientEmail("");
};

  /* ================= UI ================= */
  const days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      value: d.toISOString().split("T")[0],
      label: d.toLocaleDateString("ro-RO", {
        weekday: "long",
        day: "numeric",
        month: "short",
      }),
    };
  });

  return (
    <main style={{ padding: 40 }}>
      <h1>Programează-te</h1>

      {/* ZILE */}
      {days.map((d) => {
        const schedule = getSchedule(d.value);
        const disabled = !schedule;

        return (
          <div
            key={d.value}
            onClick={() => !disabled && setSelectedDay(d.value)}
            style={{
              padding: 12,
              marginBottom: 6,
              background: selectedDay === d.value ? "#000" : "#eee",
              color: selectedDay === d.value ? "#fff" : "#000",
              opacity: disabled ? 0.4 : 1,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            {d.label} {disabled && "— Închis"}
          </div>
        );
      })}

      {/* ORE */}
      {selectedDay &&
        settings &&
        getSchedule(selectedDay) &&
        generateSlots(
          getSchedule(selectedDay)!.start,
          getSchedule(selectedDay)!.end,
          settings.slot_duration
        ).map((t) => {
          const blocked =
            overlapsBooking(selectedDay, t) ||
            isTooSoon(selectedDay, t);

          return (
            <div
              key={t}
              onClick={() => !blocked && setSelectedTime(t)}
              style={{
                padding: 10,
                marginBottom: 4,
                background: selectedTime === t ? "#000" : "#ddd",
                color: selectedTime === t ? "#fff" : "#000",
                opacity: blocked ? 0.4 : 1,
                cursor: blocked ? "not-allowed" : "pointer",
              }}
            >
              {t} {blocked && "⛔"}
            </div>
          );
        })}
<div style={{ marginTop: 20 }}>
  <input
    type="text"
    placeholder="Nume *"
    value={clientName}
    onChange={(e) => setClientName(e.target.value)}
    style={{
      display: "block",
      width: "100%",
      padding: 12,
      marginBottom: 10,
      fontSize: 16,
    }}
  />

  <input
    type="tel"
    placeholder="Telefon *"
    value={clientPhone}
    onChange={(e) => setClientPhone(e.target.value)}
    style={{
      display: "block",
      width: "100%",
      padding: 12,
      marginBottom: 10,
      fontSize: 16,
    }}
  />

  <input
    type="email"
    placeholder="Email (opțional)"
    value={clientEmail}
    onChange={(e) => setClientEmail(e.target.value)}
    style={{
      display: "block",
      width: "100%",
      padding: 12,
      fontSize: 16,
    }}
  />
</div>

      {/* BUTON */}
      {selectedDay && selectedTime && (
        <button
          onClick={createBooking}
          style={{
            marginTop: 20,
            padding: 14,
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Confirmă programarea
        </button>
      )}
    </main>
  );
}
