import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { env } from "@/lib/env";

const requestSchema = z.object({ plan: z.enum(["starter", "pro", "agency"]) });

function variantFor(plan: "starter" | "pro" | "agency") {
  const key = {
    starter: "LEMONSQUEEZY_VARIANT_STARTER",
    pro: "LEMONSQUEEZY_VARIANT_PRO",
    agency: "LEMONSQUEEZY_VARIANT_AGENCY"
  }[plan];

  const value = process.env[key];
  if (!value) throw new Error(`Missing ${key}`);
  return value;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });

  const parsed = requestSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid plan." }, { status: 400 });

  const variantId = variantFor(parsed.data.plan);

  const response = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.lemonApiKey()}`,
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json"
    },
    body: JSON.stringify({
      data: {
        type: "checkouts",
        attributes: {
          product_options: {
            redirect_url: `${env.appUrl()}/dashboard?checkout=success`,
            enabled_variants: [Number(variantId)]
          },
          checkout_data: {
            email: data.user.email,
            custom: { user_id: data.user.id, plan: parsed.data.plan }
          }
        },
        relationships: {
          store: { data: { type: "stores", id: env.lemonStoreId() } },
          variant: { data: { type: "variants", id: variantId } }
        }
      }
    })
  });

  const payload = await response.json();
  if (!response.ok) return NextResponse.json({ error: "Checkout creation failed.", details: payload }, { status: 502 });

  return NextResponse.json({ url: payload.data.attributes.url });
}
