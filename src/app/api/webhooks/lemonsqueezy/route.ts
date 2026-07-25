import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

function validSignature(rawBody: string, received: string) {
  const expected = crypto.createHmac("sha256", env.lemonWebhookSecret()).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("X-Signature") ?? "";

  if (!validSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta?.event_name ?? "unknown";
  const eventId = `${eventName}:${payload.data?.id ?? crypto.randomUUID()}`;
  const custom = payload.meta?.custom_data ?? {};
  const attributes = payload.data?.attributes ?? {};
  const supabase = createAdminSupabaseClient();

  const { data: existing } = await supabase.from("webhook_events").select("id").eq("event_id", eventId).maybeSingle();
  if (existing) return NextResponse.json({ ok: true, duplicate: true });

  await supabase.from("webhook_events").insert({
    event_id: eventId,
    provider: "lemonsqueezy",
    event_name: eventName,
    payload
  });

  if (custom.user_id && eventName.startsWith("subscription_")) {
    await supabase.from("subscriptions").upsert(
      {
        user_id: custom.user_id,
        provider: "lemonsqueezy",
        provider_subscription_id: String(payload.data.id),
        provider_customer_id: String(attributes.customer_id ?? ""),
        product_id: String(attributes.product_id ?? ""),
        variant_id: String(attributes.variant_id ?? ""),
        plan: custom.plan ?? "unknown",
        status: attributes.status ?? "unknown",
        renews_at: attributes.renews_at ?? null,
        ends_at: attributes.ends_at ?? null,
        updated_at: new Date().toISOString()
      },
      { onConflict: "provider,provider_subscription_id" }
    );
  }

  return NextResponse.json({ ok: true });
}
