import Link from "next/link";
import { Logo } from "@/components/logo";
import { AuthForm } from "./auth-form";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "36px 0" }}>
      <section style={{ width: "min(460px, 100%)" }}>
        <Logo />
        <h1 style={{ fontSize: 42, letterSpacing: "-.045em", margin: "34px 0 10px" }}>Welcome back.</h1>
        <p className="muted" style={{ lineHeight: 1.6 }}>Open your content workspace and continue building authority from original source material.</p>
        <div style={{ marginTop: 24 }}><AuthForm mode="login" /></div>
        <p className="muted" style={{ textAlign: "center" }}>New to Qabeza? <Link href="/signup" style={{ color: "#2943d6", fontWeight: 800 }}>Create an account</Link></p>
      </section>
    </main>
  );
}
