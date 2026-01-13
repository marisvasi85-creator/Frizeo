import EventEditor from "./components/EventEditor";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <main style={{ padding: 40 }}>
      <EventEditor eventId={eventId} />
    </main>
  );
}
