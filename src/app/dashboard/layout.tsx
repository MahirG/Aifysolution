import Link from "next/link";
import { Logo } from "@/components/logo";
import { requireUser } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ borderBottom: "1px solid #dce3eb", background: "rgba(246,248,251,.88)", backdropFilter: "blur(14px)", position: "sticky", top: 0, zIndex: 10 }}>
        <div className="container" style={{ minHeight: 70, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18 }}>
          <Logo />
          <nav aria-label="Dashboard" className="dashboard-nav">
            <Link className="button button-secondary" href="/dashboard">Workspace</Link>
            <Link className="button button-blue" href="/dashboard/new">New source</Link>
            <span className="muted" style={{ fontSize: 13 }}>{user.email}</span>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
