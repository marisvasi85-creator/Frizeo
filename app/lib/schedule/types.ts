export type ScheduleRow = {
  id: string;
  barber_id: string;
  day: number;          // 0 = Duminică, 6 = Sâmbătă
  start_time: string;  // "09:00"
  end_time: string;    // "17:00"
  enabled: boolean;
};

