"use client";

import WeeklySchedule from "../dashboard/event/[eventId]/components/WeeklyScheduleEditor";
import CalendarOverrides from "../dashboard/event/[eventId]/components/CalendarOverrides";

export default function AdminPage() {
  return (
    <main style={{ padding: 40, maxWidth: 900 }}>
      <h1>Admin – Program Frizer</h1>

      {/* Program standard */}
      

      <hr style={{ margin: "40px 0" }} />

      {/* Program special / calendar */}
      <CalendarOverrides />
    </main>
  );
}
