export const ASSETS_PER_AUTHORITY_PACK = 11;

export const PLAN_LIMITS = {
  trial: { label: "Trial", sourceProjects: 1, generatedAssets: 11 },
  starter: { label: "Starter", sourceProjects: 4, generatedAssets: 44 },
  pro: { label: "Pro", sourceProjects: 15, generatedAssets: 180 },
  agency: { label: "Agency", sourceProjects: 60, generatedAssets: 660 }
} as const;

export type PlanKey = keyof typeof PLAN_LIMITS;

export function normalizePlan(value?: string | null): PlanKey | null {
  if (!value) return null;
  const normalized = value.toLowerCase();
  return normalized in PLAN_LIMITS ? (normalized as PlanKey) : null;
}
