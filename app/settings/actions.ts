"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export type ProfileFormState = { ok: boolean; message: string } | null;

export async function updateDisplayName(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) return { ok: false, message: "다시 로그인해 주세요." };

  const displayName = String(formData.get("display_name") ?? "").trim();
  if (displayName.length > 50) {
    return { ok: false, message: "표시 이름은 50자까지 쓸 수 있어요." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ display_name: displayName || null, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/settings");
  return { ok: true, message: "저장했어요." };
}
