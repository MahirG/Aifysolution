import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) redirect("/login");

  await supabase.from("profiles").upsert(
    {
      id: data.user.id,
      email: data.user.email ?? "",
      full_name: data.user.user_metadata?.full_name ?? null,
      updated_at: new Date().toISOString()
    },
    { onConflict: "id" }
  );

  return data.user;
}
