"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */
type Booking = {
  day: string;
  time: string;
};

type BarberSettings = {
  slot_duration: number;
  start_time: string;
  end_time: string;
  working_days: number[];
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
  salonId,
}: {
  barberId: string;
  salonId: string;
}) {
  const [settings, setSettings] = useState<BarberSettings | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [overrides, setOverrides] = useState<BarberDayOverride[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const router = useRouter();

  const [toast, setToast] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const isDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const { data: s } = await supabase
        .from("barber_settings")
        .select("*")
        .eq("barber_id", barberId)
        .single();

      const { data: b } = await supabase
        .from("bookings")
        .select("day, time")
        .eq("barber_id", barberId)
        .eq("salon_id", salonId);

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
      setLoading(false);
    };

    fetchAll();
  }, [barberId, salonId]);

  /* ================= HELPERS ================= */
  const toMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
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

  const generateSlots = (start: string, end: string, duration: number) => {
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

  const overlapsBooking = (day: string, time: string) => {
    if (!settings) return false;
    const start = new Date(`${day}T${time}:00`).getTime();
    const end = start + settings.slot_duration * 60000;

    return bookings.some((b) => {
      if (b.day !== day) return false;
      const bs = new Date(`${b.day}T${b.time}:00`).getTime();
      const be = bs + settings.slot_duration * 60000;
      return start < be && end > bs;
    });
  };

  const isTooSoon = (day: string, time: string) => {
    const now = new Date().getTime();
    const slot = new Date(`${day}T${time}:00`).getTime();
    return (slot - now) / 3600000 < 2;
  };

  /* ================= CREATE ================= */
  const createBooking = async () => {
    if (!selectedDay || !selectedTime || !clientName || !clientPhone) {
      setToast({
        type: "error",
        text: "Completează numele și telefonul",
      });
      return;
    }

    const cancelToken = crypto.randomUUID();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    const { error } = await supabase.rpc(
  "book_slot_with_phone_limit",
  {
    p_barber_id: barberId,
    p_salon_id: salonId,
    p_day: selectedDay,
    p_time: selectedTime,
    p_client_name: clientName,
    p_client_phone: clientPhone,
    p_client_email: clientEmail,
  }
);

if (error) {
  if (error.message.includes("LIMIT_PHONE")) {
    setToast({
      type: "error",
      text: "Ai deja 2 programări active. Anulează una pentru a continua.",
    });
  } else {
    setToast({
      type: "error",
      text: "Slot ocupat sau eroare",
    });
  }
  return;
}


    if (error) {
      setToast({ type: "success", text: "Programare confirmată 🎉" });

localStorage.setItem(
  "frizeo_last_booking",
  JSON.stringify({
    day: selectedDay,
    time: selectedTime,
    name: clientName,
    barberId,
  })
);

setTimeout(() => {
  router.push("/confirmare");
}, 1200);

    }

    setToast({ type: "success", text: "Programare confirmată" });
    setBookings((p) => [...p, { day: selectedDay, time: selectedTime }]);
    setSelectedDay(null);
    setSelectedTime(null);
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

  const bg = isDark ? "#0b0b0b" : "#f4f6f8";
  const card = isDark ? "#111" : "#fff";
  const text = isDark ? "#fff" : "#111";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: bg,
        padding: 24,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: card,
          borderRadius: 16,
          padding: 24,
          color: text,
          boxShadow: "0 10px 30px rgba(0,0,0,.1)",
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>
          Programează-te
        </h1>
        <p style={{ opacity: 0.7, marginBottom: 20 }}>
          Alege ziua și ora
        </p>

        {/* Skeleton */}
        {loading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: 44,
                borderRadius: 10,
                background: isDark ? "#222" : "#eee",
                marginBottom: 10,
                animation: "pulse 1.5s infinite",
              }}
            />
          ))}

        {!loading &&
          days.map((d) => {
            const schedule = getSchedule(d.value);
            const disabled = !schedule;

            return (
              <div
                key={d.value}
                onClick={() =>
                  !disabled && setSelectedDay(d.value)
                }
                style={{
                  padding: 14,
                  marginBottom: 8,
                  borderRadius: 12,
                  background:
                    selectedDay === d.value
                      ? "#111"
                      : isDark
                      ? "#1f2937"
                      : "#fafafa",
                  color:
                    selectedDay === d.value
                      ? "#fff"
                      : text,
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {d.label}
                {disabled && " — Închis"}
              </div>
            );
          })}

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
              <button
                key={t}
                disabled={blocked}
                onClick={() => setSelectedTime(t)}
                style={{
                  margin: 6,
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: "none",
                  background:
                    selectedTime === t
                      ? "#111"
                      : isDark
                      ? "#1f2937"
                      : "#eee",
                  color:
                    selectedTime === t ? "#fff" : text,
                  opacity: blocked ? 0.4 : 1,
                  cursor: blocked
                    ? "not-allowed"
                    : "pointer",
                }}
              >
                {t}
              </button>
            );
          })}

        <input
          placeholder="Nume *"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          style={inputStyle(isDark)}
        />
        <input
          placeholder="Telefon *"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          style={inputStyle(isDark)}
        />
        <input
          placeholder="Email (opțional)"
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          style={inputStyle(isDark)}
        />

        {selectedDay && selectedTime && (
          <button
            onClick={createBooking}
            style={{
              marginTop: 16,
              width: "100%",
              padding: 16,
              borderRadius: 14,
              background: "#111",
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              border: "none",
            }}
          >
            Confirmă programarea
          </button>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            background:
              toast.type === "success"
                ? "#16a34a"
                : "#dc2626",
            color: "#fff",
            padding: "12px 18px",
            borderRadius: 999,
          }}
        >
          {toast.text}
        </div>
      )}
    </main>
  );
}

/* ================= STYLES ================= */
const inputStyle = (dark: boolean) => ({
  width: "100%",
  padding: 14,
  marginTop: 10,
  borderRadius: 12,
  border: "none",
  background: dark ? "#1f2937" : "#eee",
  color: dark ? "#fff" : "#000",
  fontSize: 15,
});
