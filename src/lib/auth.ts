import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { hasSupabase } from "./config";
/** Every admin page and server action calls this. Authorization is enforced here AND by RLS in the database. */
export async function requireAdmin() {
  if (!hasSupabase) redirect("/admin/login");
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/admin/login?error=forbidden");
  return { supabase, user };
}
