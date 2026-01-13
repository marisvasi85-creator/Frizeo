import { supabase } from "@/app/lib/supabase";
import Link from "next/link";

export default async function DashboardPage() {
  const { data: events } = await supabase
    .from("events")
    .select("id, name")
    .order("created_at");

  return (
    <main style={{ padding: 40 }}>
      <h1>Dashboard</h1>

      <Link href="/dashboard/event/new">
        ➕ Creează eveniment
      </Link>

      <ul style={{ marginTop: 24 }}>
        {events?.map(e => (
          <li key={e.id}>
            <Link href={`/dashboard/event/${e.id}`}>
              {e.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
