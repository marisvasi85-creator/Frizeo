export type TimeRange = {
  start: string; // "09:00"
  end: string;   // "17:00"
};

export type WeeklyScheduleDay = {
  weekday: number; // 1 = luni ... 7 = duminică
  working: boolean;
  range?: TimeRange;
};

export type BarberSettings = {
  slotDuration: number; // minute
  break?: TimeRange;    // o singură pauză
};

export type Booking = {
  date: string;      // YYYY-MM-DD
  startTime: string; // HH:mm
  duration: number;  // minute
};

export type Slot = {
  start: string;
  end: string;
};
