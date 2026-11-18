import { redirect } from "next/navigation";

import { UserMenu } from "@/components/auth/user-menu";
import { ProfileForm } from "@/components/settings/profile-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/url-to-markdown/app-header";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  // Authorize from server-verified claims, not from client state.
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login?next=/settings");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", data.claims.sub)
    .single();

  return (
    <div className="mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-6 px-4 py-4 sm:px-6">
      <AppHeader actions={<UserMenu />} />
      <main>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">설정</CardTitle>
            <CardDescription>{data.claims.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm displayName={profile?.display_name ?? ""} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
