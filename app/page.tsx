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
};

/* ================= COMPONENT ================= */
export default function Home() {
  const days = ["Luni", "Marți", "Miercuri"];

  const [settings, setSettings] = useState<BarberSettings | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  /* ================= FETCH ================= */
  
  const fetchBookings = async () => {
  const { data, error } = await supabase
    .from("bookings")
    .select("day, time");

  if (error) {
    console.error("Eroare fetch bookings:", error);
    return;
  }

  setBookings((data as Booking[]) ?? []);
};

  
  const fetchSettings = async () => {
  const { data, error } = await supabase
    .from("barber_settings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("Eroare fetch settings:", error);
    return;
  }

  console.log("SETARI DIN DB:", data);
  setSettings(data);
};


  useEffect(() => {
    fetchSettings();
    fetchBookings();
  }, []);

useEffect(() => {
  console.log("SETTINGS DIN BOOKING:", settings);
}, [settings]);

  /* ================= HELPERS ================= */
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const generateTimeSlots = (
    start: string,
    end: string,
    duration: number
  ) => {
    const slots: string[] = [];
    let current = toMinutes(start);
    const endMinutes = toMinutes(end);

    while (current + duration <= endMinutes) {
      const h = Math.floor(current / 60).toString().padStart(2, "0");
      const m = (current % 60).toString().padStart(2, "0");
      slots.push(`${h}:${m}`);
      current += duration;
    }
    return slots;
  };

  const isBlocked = (day: string, time: string) => {
    if (!settings) return false;
    const current = toMinutes(time);

    return bookings.some((b) => {
      if (b.day !== day) return false;
      const start = toMinutes(b.time);
      const end = start + settings.slot_duration;
      return current >= start && current < end;
    });
  };

  const isValidPhoneRO = (phone: string) =>
    /^(07\d{8}|\+407\d{8}|00407\d{8})$/.test(phone.replace(/\s+/g, ""));

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!selectedDay || !selectedTime || !settings) return;

    if (name.trim().length < 2) {
      setError("Numele trebuie să aibă minim 2 caractere");
      return;
    }

    if (!isValidPhoneRO(phone)) {
      setError("Telefon invalid");
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.from("bookings").insert({
      day: selectedDay,
      time: selectedTime,
      duration: settings.slot_duration,
      name,
      phone,
    });

    setLoading(false);

    if (error) {
      setError("Eroare la salvare");
      return;
    }

    setSuccess(true);
    fetchBookings();

    setTimeout(() => {
      setShowForm(false);
      setSuccess(false);
      setName("");
      setPhone("");
      setSelectedDay(null);
      setSelectedTime(null);
    }, 2000);
  };

  const timeSlots =
    settings
      ? generateTimeSlots(
          settings.start_time,
          settings.end_time,
          settings.slot_duration
        )
      : [];

  /* ================= UI ================= */
  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      <header style={headerStyle}>Frizeo</header>


      {settings && (
        <p style={{ padding: 20 }}>
          Durată setată de frizer: <b>{settings.slot_duration} min</b>
        </p>
      )}

      <section style={{ padding: 40 }}>
        <h1>Programează-te rapid</h1>

        <div style={cardStyle}>
          {/* ZIUA */}
          <div>
            <h3>Ziua</h3>
            {days.map((day) => (
              <div
                key={day}
                onClick={() => setSelectedDay(day)}
                style={box(selectedDay === day)}
              >
                {day}
              </div>
            ))}
          </div>

          {/* ORA */}
          <div>
            <h3>Ora</h3>
            {timeSlots.map((time) => {
              const blocked = selectedDay
                ? isBlocked(selectedDay, time)
                : false;

              return (
                <div
                  key={time}
                  onClick={() => !blocked && setSelectedTime(time)}
                  style={{
                    ...box(selectedTime === time),
                    opacity: blocked ? 0.4 : 1,
                    pointerEvents: blocked ? "none" : "auto",
                  }}
                >
                  {time} {blocked ? "⛔" : ""}
                </div>
              );
            })}
          </div>

          <button
            onClick={() => setShowForm(true)}
            disabled={!selectedDay || !selectedTime}
            style={primaryButton(!selectedDay || !selectedTime)}
          >
            Continuă
          </button>

          {showForm && (
            <div>
              <input
                className="frizeo-input"
                placeholder="Nume"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="frizeo-input"
                placeholder="Telefon"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                style={primaryButton(loading)}
              >
                {loading ? "Se salvează..." : "Confirmă programarea"}
              </button>

              {error && <p style={{ color: "red" }}>{error}</p>}
              {success && <p style={{ color: "green" }}>✅ Confirmat</p>}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ================= STYLES ================= */
const headerStyle = {
  padding: "20px 40px",
  fontSize: 20,
  fontWeight: "bold",
  background: "#111",
  color: "#fff",
};

const cardStyle = {
  maxWidth: 600,
  background: "#fff",
  padding: 20,
  borderRadius: 12,
  display: "grid",
  gap: 20,
};

const box = (active: boolean) => ({
  padding: "12px",
  borderRadius: 8,
  background: active ? "#111" : "#eee",
  color: active ? "#fff" : "#000",
  cursor: "pointer",
});

const primaryButton = (disabled = false) => ({
  width: "100%",
  padding: "14px",
  borderRadius: 10,
  border: "none",
  background: disabled ? "#999" : "#000",
  color: "#fff",
  fontSize: 16,
  cursor: disabled ? "not-allowed" : "pointer",
});
