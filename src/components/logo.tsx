import Link from "next/link";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" aria-label="Qabeza AuthorityOS home" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
      <span
        aria-hidden="true"
        style={{
          width: 34,
          height: 34,
          borderRadius: 12,
          display: "grid",
          placeItems: "center",
          background: "#07111f",
          color: "#fff",
          fontWeight: 900,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,.15)"
        }}
      >
        Q
      </span>
      {!compact && (
        <span style={{ display: "grid", lineHeight: 1.05 }}>
          <strong style={{ letterSpacing: "-.03em" }}>Qabeza</strong>
          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 800, letterSpacing: ".08em" }}>
            AUTHORITY OS
          </span>
        </span>
      )}
    </Link>
  );
}
