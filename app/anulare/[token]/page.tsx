import CancelClient from "./CancelClient";

export default function CancelBookingPage({
  params,
}: {
  params: { token: string };
}) {
  const { token } = params;

  return (
    <main
      style={{
        padding: 40,
        maxWidth: 520,
        margin: "0 auto",
      }}
    >
      <h1>Anulare programare</h1>
      <p style={{ opacity: 0.7 }}>
        Confirmă dacă dorești să anulezi această programare.
      </p>

      <CancelClient token={token} />
    </main>
  );
}
