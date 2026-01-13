import { ScheduleRow } from "./types";

export type ScheduleRow = {
  id: string;
  barber_id: string;
  day: number;
  start_time: string;
  end_time: string;
  enabled: boolean;
};

export async function getWeeklySchedule(
  barberId: string
): Promise<ScheduleRow[]> {

  const { data, error } = await supabase
    .from("barber_weekly_schedule")
    .select("*")
    .eq("barber_id", barberId)
    .order("day", { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  // ⬇️ AICI ESTE CHEIA
  return (data ?? []).map(row => ({
    ...row,
    enabled: true
  }));
}
