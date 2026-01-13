"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";

export default function CancelClient({ token }: { token: string }) {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const isDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  useEffect(() => {
    const check = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("status, cancel_token_expires")
        .eq("cancel_token", token)
        .single();

      if (error || !data) {
        setMessage("Link invalid");
        setLoading(false);
        return;
      }

      if (data.status !== "active") {
        setMessage("Programarea a fost deja anulată");
        setLoading(false);
        return;
      }

      if (
        data.cancel_token_expires &&
        new Date(data.cancel_token_expires) < new Date()
      ) {
        setMessage("Link-ul de anulare a expirat");
        setLoading(false);
        return;
      }

      setLoading(false);
    };

    check();
  }, [token]);

  const cancel = async () => {
    setLoading(true);

    const { error } = await supabase.rpc("cancel_booking", {
      p_token: token,
    });

    if (error) {
      setMessage("Nu se poate anula programarea");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setMessage("Programarea a fost anulată cu succes");
    setLoading(false);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: isDark ? "#0b0b0b" : "#f4f6f8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          maxWidth: 420,
          width: "100%",
          background: isDark ? "#111" : "#fff",
          borderRadius: 16,
          padding: 24,
          textAlign: "center",
          color: isDark ? "#fff" : "#111",
          boxShadow: "0 10px 30px rgba(0,0,0,.1)",
        }}
      >
        <h1 style={{ fontSize: 22, marginBottom: 12 }}>
          Anulare programare
        </h1>

        {loading && (
          <div
            style={{
              height: 40,
              background: isDark ? "#222" : "#eee",
              borderRadius: 10,
              animation: "pulse 1.5s infinite",
            }}
          />
        )}

        {!loading && (
          <>
            <p
              style={{
                color: success ? "#16a34a" : "#dc2626",
                marginBottom: 16,
              }}
            >
              {message}
            </p>

            {!success && (
              <button
                onClick={cancel}
                style={{
                  width: "100%",
                  padding: 14,
                  borderRadius: 14,
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                Anulează programarea
              </button>
            )}
          </>
        )}
      </div>
    </main>
  );
}
