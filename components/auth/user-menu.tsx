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

  return (
    <>
      <Link href="/settings" className={buttonVariants({ variant: "ghost", size: "sm" })}>
        설정
      </Link>
      <LogoutButton />
    </>
  );
}
