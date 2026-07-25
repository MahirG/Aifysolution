import Link from "next/link";
import { Logo } from "@/components/logo";
import { AuthForm } from "@/app/login/auth-form";

export const metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <main className="container" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "36px 0" }}>
      <section style={{ width: "min(460px, 100%)" }}>
        <Logo />
        <h1 style={{ fontSize: 42, letterSpacing: "-.045em", margin: "34px 0 10px" }}>Build your authority system.</h1>
        <p className="muted" style={{ lineHeight: 1.6 }}>Create your workspace, define your voice, and turn one source into a coherent B2B campaign.</p>
        <div style={{ marginTop: 24 }}><AuthForm mode="signup" /></div>
        <p className="muted" style={{ textAlign: "center" }}>Already registered? <Link href="/login" style={{ color: "#2943d6", fontWeight: 800 }}>Sign in</Link></p>
      </section>
    </main>
  );
}
