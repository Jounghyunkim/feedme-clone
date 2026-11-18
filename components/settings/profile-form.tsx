"use client";

import { useActionState } from "react";

import { updateDisplayName, type ProfileFormState } from "@/app/settings/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({ displayName }: { displayName: string }) {
  const [state, formAction, isPending] = useActionState<ProfileFormState, FormData>(
    updateDisplayName,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="display_name">표시 이름</Label>
        <Input
          id="display_name"
          name="display_name"
          defaultValue={displayName}
          maxLength={50}
          placeholder="이름을 입력하세요"
        />
      </div>
      {state && (
        <Alert variant={state.ok ? "default" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" className="self-start" disabled={isPending}>
        {isPending ? "저장 중..." : "저장"}
      </Button>
    </form>
  );
}
