"use client";

import { useState } from "react";

export default function CalendarOverrides() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isWorking, setIsWorking] = useState(true);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("18:00");

  return (
    <section>
      <h2>Program special (calendar)</h2>

      <p>
        Aici poți seta zile speciale diferite de programul standard
        (exact ca în Calendly)
      </p>

      {/* Selectare zi */}
      <input
        type="date"
        onChange={(e) => setSelectedDate(e.target.value)}
      />

      {selectedDate && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: "1px solid #ccc",
            borderRadius: 8,
            maxWidth: 400,
          }}
        >
          <h3>{selectedDate}</h3>

          <label style={{ display: "block", marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={isWorking}
              onChange={(e) => setIsWorking(e.target.checked)}
            />{" "}
            Lucrează în această zi
          </label>

          {isWorking && (
            <div style={{ display: "flex", gap: 10 }}>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <span>–</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          )}

          <button style={{ marginTop: 20 }}>
            Salvează programul zilei
          </button>
        </div>
      )}
    </section>
  );
}
