import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import { LogoutButton } from "./logout-button";

export async function UserMenu() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return (
      <Link href="/auth/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        로그인
      </Link>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", data.claims.sub)
    .maybeSingle();
  const name = profile?.display_name || data.claims.email;

  return (
    <>
      {name && (
        <span className="max-w-24 truncate px-2 sm:max-w-40 text-sm text-muted-foreground" title={name}>
          {name}
        </span>
      )}
      <Link href="/settings" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        설정
      </Link>
      <LogoutButton />
    </>
  );
}
