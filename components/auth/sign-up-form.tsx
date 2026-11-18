"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== repeatPassword) {
      setError("비밀번호가 서로 달라요.");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      // Email confirmation is disabled, so sign-up returns an active session.
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      router.push("/settings");
      router.refresh();
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "회원가입 중 문제가 생겼어요.");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">회원가입</CardTitle>
        <CardDescription>새 계정을 만드세요.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">비밀번호</Label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="repeat-password">비밀번호 확인</Label>
            <Input
              id="repeat-password"
              type="password"
              required
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "계정 만드는 중..." : "회원가입"}
          </Button>
          <p className="text-center text-sm">
            이미 계정이 있나요?{" "}
            <Link href="/auth/login" className="underline underline-offset-4">
              로그인
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
