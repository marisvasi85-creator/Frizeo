"use client";

import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

/* ================= TYPES ================= */
type Booking = {
  day: string;
  time: string;
};

type BarberSettings = {
  id: string;
  slot_duration: number;
  start_time: string;
  end_time: string;
  working_days: number[];
  break_enabled: boolean;
  break_start: string | null;
  break_end: string | null;
};

type BarberDayOverride = {
  date: string;
  is_working: boolean;
  start_time: string | null;
  end_time: string | null;
};

/* ================= COMPONENT ================= */
export default function Home() {
  const barberId = "6f1365d7-b391-457c-ac89-a80a40ae08cf";
  const salonId = "fa15fcc6-7902-4751-9882-0e620885c405";

  /* ===== STATE ===== */
  const [settings, setSettings] = useState<BarberSettings | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [overrides, setOverrides] = useState<BarberDayOverride[]>([]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH ================= */
  const fetchSettings = async (barberId: string) => {
  const { data, error } = await supabase
    .from("barber_settings")
    .select("*")
    .eq("barber_id", barberId)   // 🔴 LIPSEA
    .single();

  if (error || !data) {
    console.error("Eroare settings:", error);
    return;
  }

  setSettings({
    ...data,
    working_days: Array.isArray(data.working_days)
      ? data.working_days.map(Number)
      : [],
    break_enabled: data.break_enabled ?? false,
    break_start: data.break_start ?? null,
    break_end: data.break_end ?? null,
  });
};



  const fetchOverrides = async (barberId: string) => {
    const today = new Date().toISOString().split("T")[0];
    const future = new Date();
    future.setDate(future.getDate() + 30);

    const { data } = await supabase
      .from("barber_day_overrides")
      .select("*")
      .eq("barber_id", barberId)
      .gte("date", today)
      .lte("date", future.toISOString().split("T")[0]);

    setOverrides(data ?? []);
  };

  const fetchBookings = async (barberId: string) => {
    const { data } = await supabase
      .from("bookings")
      .select("day, time")
      .eq("barber_id", barberId);

    setBookings(data ?? []);
  };

  useEffect(() => {
  if (!barberId) return;

  fetchSettings(barberId);
  fetchOverrides(barberId);
  fetchBookings(barberId);
}, [barberId]);



  /* ================= HELPERS ================= */
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const isPastTime = (day: string, time: string) => {
    return new Date(`${day}T${time}`) < new Date();
  };

  const isBlocked = (day: string, time: string) => {
    if (!settings) return false;
    const current = toMinutes(time);

    return bookings.some((b) => {
      if (b.day !== day) return false;
      const start = toMinutes(b.time);
      return current >= start && current < start + settings.slot_duration;
    });
  };

  const getDaySchedule = (date: string) => {
    if (!settings) return null;

    const override = overrides.find((o) => o.date === date);
    if (override) {
      if (!override.is_working) return null;
      return {
        start: override.start_time ?? settings.start_time,
        end: override.end_time ?? settings.end_time,
      };
    }

    const dayOfWeek = new Date(date).getDay();
    if (!settings.working_days.includes(dayOfWeek)) return null;

    return {
      start: settings.start_time,
      end: settings.end_time,
    };
  };

  const generateDays = (count = 14) => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push({
        value: d.toISOString().split("T")[0],
        label: d.toLocaleDateString("ro-RO", {
          weekday: "long",
          day: "numeric",
          month: "short",
        }),
      });
    }
    return days;
  };

  const generateTimeSlots = (start: string, end: string, duration: number) => {
    const slots: string[] = [];
    let current = toMinutes(start);
    const endMin = toMinutes(end);

    while (current + duration <= endMin) {
      const h = Math.floor(current / 60).toString().padStart(2, "0");
      const m = (current % 60).toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
      current += duration;
    }

    return slots;
  };

  const isValidPhoneRO = (phone: string) =>
    /^(07\d{8}|\+407\d{8}|00407\d{8})$/.test(phone.replace(/\s+/g, ""));

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!settings || !selectedDay || !selectedTime) return;

    if (name.trim().length < 2) {
      setError("Nume prea scurt");
      return;
    }

    if (!isValidPhoneRO(phone)) {
      setError("Telefon invalid");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase.rpc("book_slot_atomic", {
      p_day: selectedDay,
      p_time: selectedTime,
      p_duration: settings.slot_duration,
      p_name: name,
      p_phone: phone,
      p_barber_id: barberId,
      p_salon_id: salonId,
    });

    setLoading(false);

    if (error || !data) {
      setError("⛔ Slot ocupat între timp");
      return;
    }

    setSuccess(true);
    fetchBookings(barberId);

    setTimeout(() => {
      setShowForm(false);
      setSuccess(false);
      setName("");
      setPhone("");
      setSelectedDay(null);
      setSelectedTime(null);
    }, 2000);
  };

  /* ================= UI ================= */
  useEffect(() => {
  console.log("SETTINGS:", settings);
}, [settings]);

  const days = generateDays();
  const timeSlots =
    selectedDay && settings
      ? (() => {
          const schedule = getDaySchedule(selectedDay);
          if (!schedule) return [];
          return generateTimeSlots(
            schedule.start,
            schedule.end,
            settings.slot_duration
          );
        })()
      : [];

  return (
    <main style={{ padding: 40 }}>
      <h1>Programează-te</h1>

      {days.map((d) => {
  // ⛔ NU decidem nimic dacă settings nu sunt încă încărcate
  if (!settings) {
    return (
      <div
        key={d.value}
        style={{
          ...styles.box(false),
          opacity: 0.4,
          pointerEvents: "none",
        }}
      >
        {d.label}
      </div>
    );
  }

  // ✅ settings există → putem calcula corect
  const schedule = getDaySchedule(d.value);
  const disabled = schedule === null;

  return (
    <div
      key={d.value}
      onClick={() => {
        if (disabled) return;
        setSelectedDay(d.value);
        setSelectedTime(null);
      }}
      style={{
        ...styles.box(selectedDay === d.value),
        opacity: disabled ? 0.4 : 1,
        pointerEvents: disabled ? "none" : "auto",
      }}
    >
      {d.label} {disabled && "— Închis"}
    </div>
  );
})}


      {selectedDay &&
        timeSlots.map((t) => {
          const blocked = isBlocked(selectedDay, t) || isPastTime(selectedDay, t);
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

      <button
        disabled={!selectedDay || !selectedTime}
        onClick={() => setShowForm(true)}
      >
        Continuă
      </button>

      {showForm && (
        <>
          <input placeholder="Nume" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button onClick={handleSubmit}>
            {loading ? "Se salvează..." : "Confirmă"}
          </button>
          {error && <p>{error}</p>}
          {success && <p>✅ Programare confirmată</p>}
        </>
      )}
    </main>
  );
}
import type { CSSProperties } from "react";

const styles = {
  box: (active: boolean): CSSProperties => ({
    padding: 12,
    marginBottom: 6,
    borderRadius: 8,
    background: active ? "#111" : "#eee",
    color: active ? "#fff" : "#000",
    cursor: "pointer",
    userSelect: "none", // ✅ acum e tipat corect
  }),
};

