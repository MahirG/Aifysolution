import { z } from "zod";

export const sourceInputSchema = z.object({
  title: z.string().min(3).max(140),
  sourceType: z.enum(["article", "transcript", "voice_note", "client_lesson", "case_study", "memo"]),
  audience: z.string().min(3).max(180),
  goal: z.enum(["build_trust", "generate_leads", "launch_offer", "educate_market", "nurture_buyers"]),
  callToAction: z.string().min(2).max(220),
  sourceText: z.string().min(200).max(30000)
});

const outputType = z.enum([
  "linkedin_post",
  "newsletter",
  "carousel_brief",
  "short_video_script",
  "lead_magnet_outline"
]);

export const contentPackSchema = z.object({
  sourceSummary: z.string(),
  coreThesis: z.string(),
  audienceTension: z.string(),
  claimLedger: z.array(
    z.object({
      claim: z.string(),
      support: z.string(),
      confidence: z.enum(["direct", "inferred"])
    })
  ).min(3).max(12),
  outputs: z.array(
    z.object({
      type: outputType,
      title: z.string(),
      content: z.string(),
      rationale: z.string(),
      callToAction: z.string()
    })
  ).min(6).max(14)
});

export type SourceInput = z.infer<typeof sourceInputSchema>;
export type ContentPack = z.infer<typeof contentPackSchema>;
