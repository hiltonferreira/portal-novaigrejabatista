"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { database } from "@/lib/supabase/server";
import { sharedAccessConfigured } from "@/lib/supabase/config";

export async function changeEncounter(form: FormData) {
  if (!sharedAccessConfigured()) redirect("/acesso");
  const client = await database();
  const { data: { user } } = await client.auth.getUser();
  if (!user) redirect("/acesso");
  const encounter = String(form.get("encounter") ?? "");
  const version = Number(form.get("version"));
  const action = form.get("operation");
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(encounter) || !Number.isSafeInteger(version) || version < 0) redirect("/encontros-compartilhados?estado=erro");
  let result;
  if (action === "attendance") {
    const person = form.get("person");
    const state = form.get("attendance_state");
    if (typeof person !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(person)
      || (state !== "present" && state !== "absent" && state !== "unregistered")) redirect("/encontros-compartilhados?estado=erro");
    result = await client.rpc("portal_save_attendance", {
      encounter, person, expected_version: version, new_state: state === "unregistered" ? null : state,
    });
  } else if (action === "encounter") {
    const location = String(form.get("location") ?? "").trim();
    const announcement = String(form.get("announcement") ?? "").trim();
    if (location.length > 300 || announcement.length > 2000) redirect("/encontros-compartilhados?estado=erro");
    result = await client.rpc("portal_update_encounter", { encounter, expected_version: version, new_location: location, new_announcement: announcement });
  } else if (action === "draft" || action === "send") {
    const content = String(form.get("narrative") ?? "").trim();
    if (content.length > 10000 || (action === "send" && !content)) redirect("/encontros-compartilhados?estado=erro");
    result = await client.rpc("portal_save_report", { encounter, expected_version: version, content, send: action === "send" });
  } else if (action === "view") {
    result = await client.rpc("portal_view_report", { encounter });
  } else redirect("/encontros-compartilhados?estado=erro");
  if (result.error) redirect(`/encontros-compartilhados?estado=${result.error.code === "40001" ? "conflito" : "erro"}`);
  revalidatePath("/encontros-compartilhados");
  redirect("/encontros-compartilhados?estado=salvo");
}
