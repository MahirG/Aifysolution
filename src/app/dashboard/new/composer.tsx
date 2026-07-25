"use client";

import { FormEvent, useState } from "react";
import type { ContentPack } from "@/lib/ai/schema";

export function Composer() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [pack, setPack] = useState<ContentPack | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setPack(null);

    const form = new FormData(event.currentTarget);
    const body = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Generation failed.");
      setPack(data.pack);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="responsive-two-col" style={{ alignItems: "start" }}>
      <form onSubmit={submit} className="card" style={{ padding: 26, display: "grid", gap: 18 }}>
        <div className="field">
          <label htmlFor="title">Source title</label>
          <input className="input" id="title" name="title" placeholder="Why most agency positioning sounds identical" required minLength={3} maxLength={140} />
        </div>
        <div className="field">
          <label htmlFor="sourceType">Source type</label>
          <select className="select" id="sourceType" name="sourceType" defaultValue="memo">
            <option value="memo">Founder memo</option>
            <option value="article">Article</option>
            <option value="transcript">Transcript</option>
            <option value="client_lesson">Client lesson</option>
            <option value="case_study">Case study</option>
            <option value="voice_note">Voice-note transcript</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="audience">Target audience</label>
          <input className="input" id="audience" name="audience" placeholder="Owners of 2–20 person digital agencies" required />
        </div>
        <div className="field">
          <label htmlFor="goal">Campaign goal</label>
          <select className="select" id="goal" name="goal" defaultValue="generate_leads">
            <option value="build_trust">Build trust</option>
            <option value="generate_leads">Generate leads</option>
            <option value="launch_offer">Launch an offer</option>
            <option value="educate_market">Educate the market</option>
            <option value="nurture_buyers">Nurture buyers</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="callToAction">Call to action</label>
          <input className="input" id="callToAction" name="callToAction" placeholder="Download the Agency Positioning Scorecard" required />
        </div>
        <div className="field">
          <label htmlFor="sourceText">Source material</label>
          <textarea
            className="textarea"
            id="sourceText"
            name="sourceText"
            minLength={200}
            maxLength={30000}
            placeholder="Paste original notes, an article, a transcript, a case study, or a detailed client lesson…"
            required
          />
          <span className="muted" style={{ fontSize: 13 }}>Minimum 200 characters. Avoid confidential customer data.</span>
        </div>
        <button className="button button-blue" disabled={pending}>{pending ? "Building your authority pack…" : "Generate authority pack"}</button>
        {error && <p role="alert" style={{ color: "#dc3545", margin: 0 }}>{error}</p>}
      </form>

      <section className="card" style={{ padding: 26, minHeight: 620 }}>
        {!pack ? (
          <div style={{ minHeight: 560, display: "grid", placeItems: "center", textAlign: "center" }}>
            <div>
              <div style={{ width: 64, height: 64, borderRadius: 22, background: "#07111f", color: "white", display: "grid", placeItems: "center", fontSize: 28, margin: "0 auto 18px" }}>✦</div>
              <h2 style={{ fontSize: 28, margin: "0 0 8px" }}>Your generated pack appears here</h2>
              <p className="muted" style={{ lineHeight: 1.6, maxWidth: 520 }}>
                Qabeza will summarize your source, identify the thesis and buyer tension, create a claim ledger, and draft platform-native content assets.
              </p>
            </div>
          </div>
        ) : (
          <div>
            <span className="eyebrow">Generated authority pack</span>
            <h2 style={{ fontSize: 34, letterSpacing: "-.035em", margin: "18px 0 8px" }}>{pack.coreThesis}</h2>
            <p className="muted" style={{ lineHeight: 1.6 }}>{pack.sourceSummary}</p>
            <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
              {pack.outputs.map((item, index) => (
                <article key={`${item.type}-${index}`} style={{ border: "1px solid #dce3eb", borderRadius: 16, padding: 18, background: "#fff" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong style={{ color: "#2943d6" }}>{item.type.replaceAll("_", " ")}</strong>
                    <span className="muted">Draft {index + 1}</span>
                  </div>
                  <h3 style={{ margin: "12px 0 8px" }}>{item.title}</h3>
                  <p style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{item.content}</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
