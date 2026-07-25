"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    const supabase = createClient();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        const redirectTo = `${window.location.origin}/auth/callback`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo, data: { full_name: fullName } }
        });
        if (error) throw error;
        setMessage(data.session ? "Account created. Redirecting…" : "Check your email to confirm your account.");
        if (data.session) {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="card" style={{ padding: 28, display: "grid", gap: 18 }}>
      {mode === "signup" && (
        <div className="field">
          <label htmlFor="fullName">Full name</label>
          <input id="fullName" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          className="input"
          type="password"
          minLength={10}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {mode === "signup" && <span className="muted" style={{ fontSize: 13 }}>Use at least 10 characters.</span>}
      </div>
      <button className="button button-blue" disabled={pending}>
        {pending ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
      </button>
      {message && <p role="status" style={{ margin: 0, color: message.toLowerCase().includes("failed") ? "#dc3545" : "#445469" }}>{message}</p>}
    </form>
  );
}
