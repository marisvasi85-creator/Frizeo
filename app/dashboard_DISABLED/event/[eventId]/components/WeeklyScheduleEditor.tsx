"use client";

import { useEffect, useState } from "react";
import { getWeeklySchedule, ScheduleRow } from "@/app/lib/schedule/getWeeklySchedule";
import { generateSlotsForDate, Slot } from "@/app/lib/schedule/generateSlots";

const DAYS = [
  { id: 1, label: "Luni" },
  { id: 2, label: "Marți" },
  { id: 3, label: "Miercuri" },
  { id: 4, label: "Joi" },
  { id: 5, label: "Vineri" },
  { id: 6, label: "Sâmbătă" },
  { id: 7, label: "Duminică" },
];

function getDateForDay(day: number) {
  const base = new Date();
  base.setHours(0, 0, 0, 0);

  const currentDay = base.getDay() === 0 ? 7 : base.getDay();
  let diff = day - currentDay;

  // dacă e aceeași zi, mergem pe următoarea săptămână
  if (diff === 0) diff = 7;
  if (diff < 0) diff += 7;

  const result = new Date(base);
  result.setDate(base.getDate() + diff);

  return result;
}


export default function WeeklyScheduleEditor({
  eventId,
  slotDuration,
}: {
  eventId: string;
  slotDuration: number;
}) {
  const [schedule, setSchedule] = useState<ScheduleRow[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [previewDate, setPreviewDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number>(() => {
  const d = new Date().getDay();
  return d === 0 ? 7 : d;
});

  // PASUL 1 – fetch schedule
  useEffect(() => {
    async function load() {
      setLoading(true);
      const data = await getWeeklySchedule(eventId);
      setSchedule(data);
      setLoading(false);
    }
    load();
  }, [eventId]);

  // ✅ PASUL 6 – schimbare zi → schimbare DATĂ
  useEffect(() => {
    const date = getDateForDay(selectedDay);
    setPreviewDate(date);
  }, [selectedDay]);

  // PASUL 4 – generate slots
  useEffect(() => {
    if (!schedule.length) {
      setSlots([]);
      return;
    }


    const generated = generateSlotsForDate(
      previewDate,
      schedule,
      slotDuration
    );

    setSlots(generated);
  }, [schedule, previewDate, slotDuration]);

  if (loading) return <p>⏳ Se încarcă programul…</p>;

  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ marginTop: 24 }}>📅 Alege ziua</h3>

<div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
  {DAYS.map((d) => {
    const isActive = d.id === selectedDay;

    return (
      <button
        key={d.id}
        onClick={() => setSelectedDay(d.id)}
        style={{
          padding: "6px 12px",
          borderRadius: 6,
          border: "1px solid #333",
          background: isActive ? "#2563eb" : "#111",
          color: isActive ? "#fff" : "#aaa",
          cursor: "pointer",
        }}
      >
        {d.label}
      </button>
    );
  })}
</div>

      <h3>🧪 Preview sloturi ({previewDate.toLocaleDateString()})</h3>

<p style={{ opacity: 0.6 }}>
  Debug: zi={selectedDay}, data={previewDate.toDateString()}
</p>

      {slots.length === 0 && <p style={{ color: "#f87171" }}>❌ Niciun slot disponibil</p>}

      <div style={{ display: "grid", gap: 8 }}>
        {slots.map((s, i) => (
          <button key={i}>
            {s.start} – {s.end}
          </button>
        ))}
      </div>
    </div>
  );
}
