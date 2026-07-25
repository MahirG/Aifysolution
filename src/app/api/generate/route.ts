import { Output, generateText } from "ai";
import { NextResponse } from "next/server";
import { contentPackSchema, sourceInputSchema } from "@/lib/ai/schema";
import { buildAuthorityPrompt } from "@/lib/ai/prompt";
import { createClient } from "@/lib/supabase/server";
import { releaseGeneration, reserveGeneration } from "@/lib/usage";
import { env } from "@/lib/env";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const parsed = sourceInputSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid source input.", details: parsed.error.flatten() }, { status: 400 });
  }

  let reservation;
  try {
    reservation = await reserveGeneration(authData.user.id);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to verify monthly usage." },
      { status: 503 }
    );
  }

  if (!reservation.allowed) {
    return NextResponse.json(
      {
        error: `You have reached the ${reservation.usage.planLabel} plan's monthly generation limit. Upgrade your plan to continue.`,
        code: "PLAN_LIMIT_REACHED",
        usage: reservation.usage,
        upgradeUrl: "/pricing"
      },
      { status: 429 }
    );
  }

  let sourceId: string | null = null;

  try {
    const { data: source, error: sourceError } = await supabase
      .from("source_assets")
      .insert({
        user_id: authData.user.id,
        title: parsed.data.title,
        source_type: parsed.data.sourceType,
        audience: parsed.data.audience,
        goal: parsed.data.goal,
        call_to_action: parsed.data.callToAction,
        source_text: parsed.data.sourceText,
        status: "processing"
      })
      .select("id")
      .single();

    if (sourceError || !source) throw sourceError ?? new Error("Unable to save source material.");
    sourceId = source.id;

    const result = await generateText({
      model: env.aiModel(),
      output: Output.object({ schema: contentPackSchema }),
      prompt: buildAuthorityPrompt(parsed.data)
    });

    const pack = result.output;

    const { data: savedPack, error: packError } = await supabase
      .from("content_packs")
      .insert({
        user_id: authData.user.id,
        source_asset_id: source.id,
        status: "draft",
        source_summary: pack.sourceSummary,
        core_thesis: pack.coreThesis,
        audience_tension: pack.audienceTension,
        claim_ledger: pack.claimLedger,
        model: env.aiModel()
      })
      .select("id")
      .single();

    if (packError || !savedPack) throw packError ?? new Error("Unable to save content pack.");

    const items = pack.outputs.map((item, index) => ({
      user_id: authData.user.id,
      content_pack_id: savedPack.id,
      type: item.type,
      title: item.title,
      body: item.content,
      rationale: item.rationale,
      call_to_action: item.callToAction,
      position: index,
      status: "draft"
    }));

    const { error: itemsError } = await supabase.from("content_items").insert(items);
    if (itemsError) throw itemsError;

    await supabase.from("source_assets").update({ status: "completed" }).eq("id", source.id);

    return NextResponse.json({
      sourceId: source.id,
      contentPackId: savedPack.id,
      pack,
      usage: reservation.usage
    });
  } catch (error) {
    if (sourceId) await supabase.from("source_assets").update({ status: "failed" }).eq("id", sourceId);
    await releaseGeneration(authData.user.id, reservation.usage.periodStart);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed." },
      { status: 500 }
    );
  }
}
