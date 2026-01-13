export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#0b0b0b",
        color: "#fff",
      }}
    >
      {/* Sidebar – temporar simplu */}
      <aside
        style={{
          width: 220,
          background: "#111",
          padding: 20,
          borderRight: "1px solid #222",
        }}
      >
        <h2 style={{ marginBottom: 24 }}>✂️ Frizeo</h2>

        <nav style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <a href="/dashboard" style={{ color: "#fff" }}>
            Dashboard
          </a>
        </nav>
      </aside>

      {/* Conținut */}
      <main style={{ flex: 1, padding: 32 }}>{children}</main>
    </div>
  );
}
