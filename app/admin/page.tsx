"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type BarberSettings = {
  id: number;
  slot_duration: number;
  start_time: string;
  end_time: string;
};


export default function AdminPage() {
  const [settings, setSettings] = useState<BarberSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const fetchSettings = async () => {
  const { data, error } = await supabase
    .from("barber_settings")
    .select("id, slot_duration, start_time, end_time")
    .single();

  if (error) {
    console.error("Eroare fetch settings:", error);
    return;
  }

  setSettings(data);
};


useEffect(() => {
  const ok = prompt("Parolă admin:");
  if (ok === "admin123") {
    setAllowed(true);
  } else {
    setAllowed(false);
  }
}, []);


  useEffect(() => {
    fetchSettings();
  }, []);

  if (!settings) {
    return <p style={{ padding: 40 }}>Se încarcă setările...</p>;
  }

if (allowed === null) {
  return <p style={{ padding: 40 }}>Verificare acces...</p>;
}

if (allowed === false) {
  return <p style={{ padding: 40 }}>Acces interzis</p>;
}


  return (
    <main style={{ padding: 40, maxWidth: 400 }}>
      <h1>Admin Frizer</h1>

      <label>Durată programare (minute)</label>
      <input
        type="number"
        value={settings.slot_duration}
        onChange={(e) =>
          setSettings({ ...settings, slot_duration: Number(e.target.value) })
        }
      />

      <label>Ora început</label>
      <input
        type="time"
        value={settings.start_time}
        onChange={(e) =>
          setSettings({ ...settings, start_time: e.target.value })
        }
      />

      <label>Ora final</label>
      <input
        type="time"
        value={settings.end_time}
        onChange={(e) =>
          setSettings({ ...settings, end_time: e.target.value })
        }
      />

      <button
  style={{ marginTop: 20 }}
  onClick={async () => {
    setLoading(true);

    const { error } = await supabase
      .from("barber_settings")
      .update({
        slot_duration: settings.slot_duration,
        start_time: settings.start_time,
        end_time: settings.end_time,
      });

    setLoading(false);

    if (error) {
      alert("Eroare la salvare");
      return;
    }

    alert("Setări salvate");
  }}
>
  {loading ? "Salvez..." : "Salvează"}
</button>

    </main>
  );
}
