import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export const metadata = { title: "Workspace" };

export default async function DashboardPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("source_assets")
    .select("id,title,source_type,status,created_at,content_packs(id,status,created_at)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <main className="container" style={{ padding: "42px 0 84px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 24, flexWrap: "wrap" }}>
        <div>
          <span className="eyebrow">Authority workspace</span>
          <h1 style={{ fontSize: "clamp(38px, 6vw, 64px)", letterSpacing: "-.05em", margin: "18px 0 8px" }}>Your source library</h1>
          <p className="muted" style={{ fontSize: 18 }}>Every campaign begins with a real idea, story, lesson, or piece of evidence.</p>
        </div>
        <Link href="/dashboard/new" className="button button-blue">Add source material</Link>
      </div>

      {!projects?.length ? (
        <section className="card grid-lines" style={{ padding: "clamp(34px, 8vw, 80px)", textAlign: "center", marginTop: 34 }}>
          <div style={{ width: 64, height: 64, borderRadius: 22, margin: "0 auto 20px", background: "#07111f", color: "white", display: "grid", placeItems: "center", fontSize: 28 }}>✦</div>
          <h2 style={{ fontSize: 30, margin: "0 0 10px" }}>Create your first authority pack</h2>
          <p className="muted" style={{ maxWidth: 600, margin: "0 auto 24px", lineHeight: 1.6 }}>
            Paste a founder memo, article, transcript, case study, or client lesson. Qabeza will extract the thesis and create a source-grounded content pack.
          </p>
          <Link href="/dashboard/new" className="button button-blue">Start with one source</Link>
        </section>
      ) : (
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 34 }}>
          {projects.map((project) => (
            <article key={project.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <span className="eyebrow">{project.source_type}</span>
                <span className="muted" style={{ fontSize: 13 }}>{new Date(project.created_at).toLocaleDateString()}</span>
              </div>
              <h2 style={{ fontSize: 24, margin: "18px 0 10px" }}>{project.title}</h2>
              <p className="muted">{project.content_packs?.length ? "Authority pack generated" : "Source saved"}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
