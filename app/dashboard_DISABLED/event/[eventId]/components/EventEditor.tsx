"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import WeeklyScheduleEditor from "./WeeklyScheduleEditor";

type Props = {
  eventId: string;
};

export default function EventEditor({ eventId }: Props) {
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);


  useEffect(() => {
    if (!eventId) return;

    const fetchEvent = async () => {
      console.log("🟡 fetchEvent START", eventId);

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();

      console.log("🟢 Supabase RESPONSE", { data, error });

      if (!error && data) {
        setEvent(data);
      }

      setLoading(false);
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return <p>⏳ Se încarcă evenimentul...</p>;
  }

  if (!event) {
    return <p>❌ Eveniment inexistent</p>;
  }

  return (
    <section style={{ padding: 24 }}>
      <h2>{event.name}</h2>

      {event.location && (
        <p>
          📍 Locație: <strong>{event.location}</strong>
        </p>
      )}

      {event.slot_duration && (
        <p>
          ⏱ Durată slot: <strong>{event.slot_duration} min</strong>
        </p>
      )}
      <WeeklyScheduleEditor
  eventId={event.id}
  slotDuration={event.slot_duration}
/>


    </section>
  );
}
