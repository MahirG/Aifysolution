function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  appUrl: () => process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  supabaseUrl: () => required("NEXT_PUBLIC_SUPABASE_URL"),
  supabasePublishableKey: () => required("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY"),
  lemonApiKey: () => required("LEMONSQUEEZY_API_KEY"),
  lemonStoreId: () => required("LEMONSQUEEZY_STORE_ID"),
  lemonWebhookSecret: () => required("LEMONSQUEEZY_WEBHOOK_SECRET"),
  aiModel: () => process.env.AI_MODEL ?? "openai/gpt-5.4"
};
