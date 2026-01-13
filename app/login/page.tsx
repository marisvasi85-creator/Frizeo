"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const signIn = async () => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    alert("📩 Verifică email-ul pentru login");
    setLoading(false);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0b0b0b",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#111",
        padding: 32,
        borderRadius: 16,
        width: 360,
        color: "#fff"
      }}>
        <h1>Login Frizer</h1>

        <input
          placeholder="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={{ width: "100%", padding: 12, marginTop: 16 }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          onClick={signIn}
          disabled={loading}
          style={{ marginTop: 16, width: "100%" }}
        >
          {loading ? "..." : "Trimite link"}
        </button>
      </div>
    </main>
  );
}
