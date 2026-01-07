"use client";

import WeeklySchedule from "./components/WeeklySchedule";
import CalendarOverrides from "./components/CalendarOverrides";

export default function AdminPage() {
  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>Admin – Program Frizer</h1>

      {/* Program standard */}
      <WeeklySchedule />

      <hr style={{ margin: "40px 0" }} />

      {/* Program special / calendar */}
      <CalendarOverrides />
    </main>
  );
}
