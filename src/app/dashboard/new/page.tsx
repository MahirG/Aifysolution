import { Composer } from "./composer";

export const metadata = { title: "New source" };

export default function NewSourcePage() {
  return (
    <main className="container" style={{ padding: "42px 0 84px" }}>
      <span className="eyebrow">Source → authority campaign</span>
      <h1 style={{ fontSize: "clamp(38px, 6vw, 62px)", letterSpacing: "-.05em", margin: "18px 0 8px" }}>Start with something worth saying.</h1>
      <p className="muted" style={{ fontSize: 18, lineHeight: 1.6, maxWidth: 760, marginBottom: 30 }}>
        The strongest output begins with original evidence, a real experience, or a clearly argued point of view. Qabeza does not invent credibility.
      </p>
      <Composer />
    </main>
  );
}
