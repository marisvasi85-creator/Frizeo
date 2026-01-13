import { getWeeklyScheduleForBarber } from "@/app/lib/schedule/getWeeklyScheduleForBarber";
import BookingSlotPicker from "./components/BookingSlotPicker";

type PageProps = {
  params: Promise<{
    barberId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { barberId } = await params;

  const schedule = await getWeeklyScheduleForBarber(barberId);

  return (
    <div style={{ padding: 24 }}>
      <h1>Programare</h1>
      <BookingSlotPicker
        barberId={barberId}
        schedule={schedule}
      />
    </div>
  );
}
