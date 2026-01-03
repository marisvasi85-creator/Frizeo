"use client";

import { useState } from "react";

export default function Home() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const days = ["Luni", "Marți", "Miercuri"];
  const times = ["09:00", "10:00", "11:00"];

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");


  return (
    <main style={{ minHeight: "100vh", background: "#f5f5f5" }}>
      {/* HEADER */}
      <header
        style={{
          padding: "20px 40px",
          background: "#111",
          color: "#fff",
          fontSize: 20,
          fontWeight: "bold",
        }}
      >
        Frizeo
      </header>

      {/* CONTENT */}
      <section style={{ padding: 40 }}>
        <h1 style={{ marginBottom: 8 }}>Programează-te rapid</h1>
        <p style={{ color: "#555", marginBottom: 32 }}>
          Alege ziua și ora disponibilă
        </p>

        {/* CARD */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            maxWidth: 600,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          {/* ZILE */}
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

          {/* ORE */}
          <div>
            <h3>Ora</h3>
            {times.map((time) => (
              <div
                key={time}
                onClick={() => setSelectedTime(time)}
                style={box(selectedTime === time)}
              >
                {time}
              </div>
            ))}
            {/* BUTON CONTINUA */}
<button
  onClick={() => setShowForm(true)}
  disabled={!selectedDay || !selectedTime}
  style={{
    marginTop: 20,
    padding: "14px",
    borderRadius: 10,
    border: "none",
    background: selectedDay && selectedTime ? "#000" : "#999",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16
  }}
>
  Continuă
</button>
{showForm && (
  <div
    style={{
      marginTop: 30,
      padding: 20,
      borderRadius: 16,
      background: "#fff",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    }}
  >
    <h3 style={{ marginBottom: 10 }}>Datele tale</h3>

    <input
      placeholder="Nume"
      value={name}
      onChange={(e) => setName(e.target.value)}
      style={{
        width: "100%",
        padding: 12,
        marginBottom: 10,
        borderRadius: 8,
        border: "1px solid #ccc"
      }}
    />

    <input
      placeholder="Telefon"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      style={{
        width: "100%",
        padding: 12,
        marginBottom: 16,
        borderRadius: 8,
        border: "1px solid #ccc"
      }}
    />

    <button
      onClick={() =>
        alert(
          `Programare confirmată:\n${name}\n${phone}\n${selectedDay} la ${selectedTime}`
        )
      }
      disabled={!name || !phone}
      style={{
        width: "100%",
        padding: 14,
        borderRadius: 10,
        border: "none",
        background: name && phone ? "#000" : "#999",
        color: "#fff",
        fontSize: 16,
        cursor: "pointer"
      }}
    >
      Confirmă programarea
    </button>
  </div>
)}

          </div>
        </div>

        {/* DEBUG (temporar) */}
        <div style={{ marginTop: 30, color: "#555" }}>
          <strong>Selecție:</strong>{" "}
          {selectedDay ?? "—"} la {selectedTime ?? "—"}
        </div>
      </section>
    </main>
  );
}

/* STYLE */
const box = (active: boolean) => ({
  padding: "12px",
  marginBottom: 10,
  borderRadius: 8,
  background: active ? "#111" : "#eee",
  color: active ? "#fff" : "#000",
  cursor: "pointer",
  transition: "all 0.2s ease",
});
