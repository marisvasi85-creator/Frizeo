import { supabase } from "@/app/lib/supabase";
import { ScheduleRow } from "./types";

export async function getWeeklyScheduleForBarber(
  barberId: string
): Promise<ScheduleRow[]> {
  if (!barberId) return [];

  const { data, error } = await supabase
    .from("barber_weekly_schedule") // 🔥 ASTA E CHEIA
    .select("*")
    .eq("barber_id", barberId)
    .order("day");

  if (error) {
    console.error("schedule error:", error.message);
    return [];
  }

  return data ?? [];
}
