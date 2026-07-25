import Link from "next/link";
import { PublicNav } from "@/components/public-nav";
import { Logo } from "@/components/logo";

const outputs = [
  ["LinkedIn posts", "Five point-of-view posts adapted to professional buyer intent."],
  ["Newsletter", "A structured email issue with a strong thesis and useful examples."],
  ["Carousel brief", "Slide-by-slide copy for a visual educational post."],
  ["Short-video scripts", "Three concise scripts with hooks, beats, and calls to action."],
  ["Lead magnet", "A practical asset that converts attention into qualified email leads."],
  ["Claim ledger", "A traceable list showing which claims came from your source material."]
];

export default function HomePage() {
  return (
    <main>
      <PublicNav />
      <section className="container grid-lines card" style={{ padding: "clamp(32px, 7vw, 88px)", marginTop: 18, overflow: "hidden" }}>
        <div style={{ maxWidth: 810 }}>
          <span className="eyebrow">Human-first AI for B2B authority</span>
          <h1 style={{ fontSize: "clamp(46px, 8vw, 92px)", lineHeight: .94, letterSpacing: "-.065em", margin: "24px 0" }}>
            Turn expertise into demand.
          </h1>
          <p style={{ fontSize: "clamp(18px, 2.4vw, 24px)", lineHeight: 1.55, maxWidth: 760, color: "#445469", margin: 0 }}>
            Qabeza turns one source—an article, transcript, voice note, or client lesson—into credible LinkedIn content,
            newsletters, carousel briefs, short-video scripts, and lead-generation assets without flattening your voice.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 32 }}>
            <Link href="/signup" className="button button-blue">Start creating</Link>
            <Link href="/#product" className="button button-secondary">Explore the workflow</Link>
          </div>
        </div>

        <div
          aria-label="Product preview"
          style={{
            marginTop: 56,
            padding: 18,
            borderRadius: 24,
            background: "#07111f",
            color: "white",
            boxShadow: "var(--shadow)"
          }}
        >
          <div style={{ display: "flex", gap: 7, marginBottom: 18 }}>
            <span style={{ width: 10, height: 10, borderRadius: 99, background: "#ff6b6b" }} />
            <span style={{ width: 10, height: 10, borderRadius: 99, background: "#f4a62a" }} />
            <span style={{ width: 10, height: 10, borderRadius: 99, background: "#20c7a5" }} />
          </div>
          <div className="preview-grid">
            <div style={{ background: "#111e2e", borderRadius: 18, padding: 20 }}>
              <div className="muted" style={{ color: "#91a0b4", fontSize: 13, fontWeight: 800 }}>SOURCE</div>
              <h3 style={{ fontSize: 25, marginBottom: 12 }}>Why most agency positioning sounds identical</h3>
              <p style={{ color: "#b9c4d3", lineHeight: 1.6 }}>
                A founder memo containing a client story, an original framework, and four evidence-backed observations.
              </p>
            </div>
            <div style={{ background: "#fff", color: "#07111f", borderRadius: 18, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 14 }}>
                <span className="eyebrow">Authority Pack</span>
                <strong style={{ color: "#20a987" }}>92% grounded</strong>
              </div>
              <h3 style={{ fontSize: 25, marginBottom: 10 }}>A month of credible content, built from your thinking</h3>
              <p className="muted" style={{ lineHeight: 1.55 }}>
                5 LinkedIn posts · 1 newsletter · 1 carousel · 3 video scripts · 1 lead magnet
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="product" className="container" style={{ padding: "88px 0" }}>
        <span className="eyebrow">One source. One coherent campaign.</span>
        <h2 style={{ fontSize: "clamp(34px, 5vw, 58px)", letterSpacing: "-.045em", maxWidth: 760, margin: "20px 0 14px" }}>
          Built for experts who need trust, not content volume.
        </h2>
        <p className="muted" style={{ fontSize: 19, lineHeight: 1.6, maxWidth: 740 }}>
          AuthorityOS extracts your original thesis, records a source-backed claim ledger, then adapts the idea to each format.
          Every output stays editable and requires human approval.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginTop: 36 }}>
          {outputs.map(([title, description], index) => (
            <article key={title} className="card" style={{ padding: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: "#3d5afe" }}>0{index + 1}</div>
              <h3 style={{ fontSize: 22, margin: "16px 0 8px" }}>{title}</h3>
              <p className="muted" style={{ lineHeight: 1.55, margin: 0 }}>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container card" style={{ padding: "clamp(28px, 6vw, 70px)", marginBottom: 82, background: "#07111f", color: "white" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", alignItems: "center", gap: 30 }}>
          <div>
            <span className="eyebrow" style={{ background: "rgba(255,255,255,.08)", color: "white", borderColor: "rgba(255,255,255,.16)" }}>
              Founding release
            </span>
            <h2 style={{ fontSize: "clamp(34px, 5vw, 58px)", letterSpacing: "-.045em", margin: "18px 0 12px" }}>
              Your point of view is the product.
            </h2>
            <p style={{ color: "#b9c4d3", fontSize: 18, lineHeight: 1.6 }}>
              Capture it once. Turn it into useful, platform-native assets. Keep every claim grounded and every final edit under your control.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap: 12 }}>
            <Link href="/signup" className="button button-blue">Create an account</Link>
            <Link href="/pricing" className="button button-secondary">See pricing</Link>
          </div>
        </div>
      </section>

      <footer className="container" style={{ padding: "26px 0 44px", display: "flex", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
        <Logo />
        <span className="muted">© {new Date().getFullYear()} Qabeza. Built for credible B2B authority.</span>
      </footer>
    </main>
  );
}
