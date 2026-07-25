import Link from "next/link";
import { Logo } from "./logo";

export function PublicNav() {
  return (
    <header style={{ padding: "18px 0" }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <Logo />
        <nav aria-label="Main navigation" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/#product" className="button button-secondary">Product</Link>
          <Link href="/pricing" className="button button-secondary">Pricing</Link>
          <Link href="/login" className="button button-primary">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}
