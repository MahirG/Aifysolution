import Link from "next/link";
import { PublicNav } from "@/components/public-nav";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "For one consultant building a consistent point of view.",
    features: ["4 source projects / month", "Up to 44 generated assets", "LinkedIn + newsletter outputs", "Claim ledger", "Export and copy"],
    key: "starter"
  },
  {
    name: "Pro",
    price: "$79",
    description: "For founders and experts publishing every week.",
    features: ["15 source projects / month", "Up to 180 generated assets", "Carousel and video briefs", "Lead-magnet builder", "Brand voice profiles"],
    key: "pro",
    featured: true
  },
  {
    name: "Agency",
    price: "$199",
    description: "For teams producing authority content for several brands.",
    features: ["60 source projects / month", "Up to 660 generated assets", "Multiple brand workspaces", "Approval workflow", "Priority support"],
    key: "agency"
  }
];

export default function PricingPage() {
  return (
    <main>
      <PublicNav />
      <section className="container" style={{ padding: "62px 0 90px" }}>
        <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <span className="eyebrow">Simple USD pricing</span>
          <h1 style={{ fontSize: "clamp(42px, 7vw, 74px)", letterSpacing: "-.055em", margin: "22px 0 14px" }}>
            Pay for a system, not another blank document.
          </h1>
          <p className="muted" style={{ fontSize: 19, lineHeight: 1.6 }}>
            Start with one source project, review the outputs, and upgrade only when the workflow proves useful.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 18, marginTop: 44 }}>
          {plans.map((plan) => (
            <article key={plan.key} className="card" style={{ padding: 28, borderColor: plan.featured ? "#3d5afe" : undefined, boxShadow: plan.featured ? "0 24px 70px rgba(61,90,254,.14)" : undefined }}>
              {plan.featured && <span className="eyebrow">Most popular</span>}
              <h2 style={{ fontSize: 30, margin: "18px 0 6px" }}>{plan.name}</h2>
              <div style={{ display: "flex", alignItems: "end", gap: 8 }}>
                <strong style={{ fontSize: 48, letterSpacing: "-.05em" }}>{plan.price}</strong>
                <span className="muted" style={{ paddingBottom: 8 }}>/month</span>
              </div>
              <p className="muted" style={{ lineHeight: 1.55 }}>{plan.description}</p>
              <ul style={{ paddingLeft: 20, lineHeight: 1.9, margin: "24px 0" }}>
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <Link href={`/signup?plan=${plan.key}`} className={`button ${plan.featured ? "button-blue" : "button-primary"}`} style={{ width: "100%" }}>
                Start with {plan.name}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
