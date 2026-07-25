import "server-only";
import { createAdminSupabaseClient } from "@/lib/supabase/server";
import { ASSETS_PER_AUTHORITY_PACK, normalizePlan, PLAN_LIMITS, type PlanKey } from "@/lib/plans";

type SubscriptionRow = {
  plan: string | null;
  status: string | null;
  ends_at: string | null;
};

export type UsageSnapshot = {
  plan: PlanKey;
  planLabel: string;
  periodStart: string;
  sourceProjectsUsed: number;
  sourceProjectsLimit: number;
  generatedAssetsUsed: number;
  generatedAssetsLimit: number;
};

function currentPeriodStart() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString().slice(0, 10);
}

function hasAccess(subscription: SubscriptionRow) {
  const status = subscription.status?.toLowerCase();
  if (status === "active" || status === "on_trial") return true;
  if (status === "cancelled" && subscription.ends_at) {
    return new Date(subscription.ends_at).getTime() > Date.now();
  }
  return false;
}

async function resolvePlan(userId: string): Promise<PlanKey> {
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin
    .from("subscriptions")
    .select("plan,status,ends_at,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(10);

  if (error) throw new Error("Unable to verify subscription access.");

  for (const subscription of data ?? []) {
    const plan = normalizePlan(subscription.plan);
    if (plan && hasAccess(subscription)) return plan;
  }

  return "trial";
}

export async function getUsageSnapshot(userId: string): Promise<UsageSnapshot> {
  const admin = createAdminSupabaseClient();
  const plan = await resolvePlan(userId);
  const limits = PLAN_LIMITS[plan];
  const periodStart = currentPeriodStart();

  const { data, error } = await admin
    .from("usage_months")
    .select("source_projects_used,generated_assets_used")
    .eq("user_id", userId)
    .eq("period_start", periodStart)
    .maybeSingle();

  if (error) throw new Error("Unable to load usage information.");

  return {
    plan,
    planLabel: limits.label,
    periodStart,
    sourceProjectsUsed: data?.source_projects_used ?? 0,
    sourceProjectsLimit: limits.sourceProjects,
    generatedAssetsUsed: data?.generated_assets_used ?? 0,
    generatedAssetsLimit: limits.generatedAssets
  };
}

export async function reserveGeneration(userId: string) {
  const snapshot = await getUsageSnapshot(userId);
  const admin = createAdminSupabaseClient();
  const { data, error } = await admin.rpc("reserve_monthly_usage", {
    p_user_id: userId,
    p_period_start: snapshot.periodStart,
    p_source_limit: snapshot.sourceProjectsLimit,
    p_asset_limit: snapshot.generatedAssetsLimit,
    p_asset_reservation: ASSETS_PER_AUTHORITY_PACK
  });

  if (error) throw new Error("Unable to reserve monthly usage.");

  const row = Array.isArray(data) ? data[0] : data;
  return {
    allowed: Boolean(row?.allowed),
    usage: {
      ...snapshot,
      sourceProjectsUsed: row?.source_projects_used ?? snapshot.sourceProjectsUsed,
      generatedAssetsUsed: row?.generated_assets_used ?? snapshot.generatedAssetsUsed
    }
  };
}

export async function releaseGeneration(userId: string, periodStart: string) {
  const admin = createAdminSupabaseClient();
  const { error } = await admin.rpc("release_monthly_usage", {
    p_user_id: userId,
    p_period_start: periodStart,
    p_asset_reservation: ASSETS_PER_AUTHORITY_PACK
  });

  if (error) console.error("Unable to release failed generation usage", error);
}
