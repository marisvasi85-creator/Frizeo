import BookingCalendar from "@/app/components/BookingCalendar";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ barberId: string }>;
}) {
  const { barberId } = await params;

  return (
    <main style={{ padding: 40 }}>
      <h1>Programare</h1>

      <BookingCalendar barberId={barberId} />
    </main>
  );
}
