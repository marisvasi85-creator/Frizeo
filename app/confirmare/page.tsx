"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BookingData = {
  day: string;
  time: string;
  name: string;
  barberId: string;
};

const buildGoogleCalendarUrl = (
  day: string,
  time: string,
  durationMinutes = 30
) => {
  const start = new Date(`${day}T${time}:00`);
  const end = new Date(start.getTime() + durationMinutes * 60000);

  const format = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Programare Frizeo ✂️",
    details: "Programare la frizer. Te așteptăm!",
    dates: `${format(start)}/${format(end)}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

export default function ConfirmarePage() {
  const [data, setData] = useState<BookingData | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("frizeo_last_booking");
    if (raw) {
      setData(JSON.parse(raw));
    }
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          background: "#111",
          borderRadius: 16,
          padding: 28,
          textAlign: "center",
          boxShadow: "0 20px 40px rgba(0,0,0,.4)",
        }}
      >
        <h1 style={{ fontSize: 24, marginBottom: 12 }}>
          ✅ Programare confirmată
        </h1>

        {data ? (
          <>
            <p style={{ opacity: 0.8 }}>
              Mulțumim, <b>{data.name}</b>
            </p>

            <div
              style={{
                marginTop: 16,
                padding: 16,
                borderRadius: 12,
                background: "#1f2937",
              }}
            >
              <p>📅 {data.day}</p>
              <p>⏰ {data.time}</p>
            </div>
          </>
        ) : (
          <p style={{ opacity: 0.6 }}>
            Detalii indisponibile
          </p>
        )}

{data?.day && data?.time && (
  <a
    href={buildGoogleCalendarUrl(data.day, data.time)}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "block",
      marginTop: 16,
      padding: 14,
      borderRadius: 12,
      background: "#1f2937",
      color: "#fff",
      fontWeight: 600,
      textDecoration: "none",
    }}
  >
    📅 Adaugă în Google Calendar
  </a>
)}

        {/* CTA */}
        <div style={{ marginTop: 24 }}>
          <Link
            href="/"
            style={{
              display: "block",
              padding: 14,
              borderRadius: 12,
              background: "#16a34a",
              color: "#fff",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Mergi la homepage
          </Link>

          <Link
            href="/"
            style={{
              display: "block",
              marginTop: 10,
              padding: 14,
              borderRadius: 12,
              background: "#1f2937",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Programează din nou
          </Link>
        </div>

        <p style={{ marginTop: 20, opacity: 0.5, fontSize: 13 }}>
          Frizeo ✂️ — programări rapide, fără stres
        </p>
      </div>
    </main>
  );
}
