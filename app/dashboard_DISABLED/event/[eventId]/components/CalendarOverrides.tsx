"use client";

type Props = {
  onSelectDate: (date: string) => void;
};


export default function CalendarOverview({ onSelectDate }: Props) {
  return (
    <input
      type="date"
      onChange={(e) => onSelectDate(e.target.value)}
      style={{ marginTop: 16 }}
    />
  );
}