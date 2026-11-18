"use client";

import { useRef, useState } from "react";
import {
  CircleAlertIcon,
  FileTextIcon,
  LinkIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ResultView } from "@/components/url-to-markdown/result-view";
import { isWebUrl, type ConvertedPage } from "@/lib/export-markdown";

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "result"; page: ConvertedPage; id: number }
  | { kind: "empty" }
  | { kind: "error"; detail: string };

export function Converter() {
  const [url, setUrl] = useState("");
  const [formatError, setFormatError] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const requestId = useRef(0);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state.kind === "loading") return;
    const value = url.trim();
    if (!isWebUrl(value)) {
      setFormatError(true);
      return;
    }
    const id = ++requestId.current;
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: value }),
      });
      const data = await res.json().catch(() => null);
      if (id !== requestId.current) return;
      if (!res.ok || !data?.page) {
        setState({ kind: "error", detail: data?.detail ?? "" });
        return;
      }
      const page = data.page as ConvertedPage;
      setState(page.content ? { kind: "result", page, id } : { kind: "empty" });
    } catch {
      if (id === requestId.current) {
        setState({ kind: "error", detail: "연결하지 못했어요" });
      }
    }
  }

  function clear() {
    requestId.current++;
    setUrl("");
    setFormatError(false);
    setState({ kind: "idle" });
    inputRef.current?.focus();
  }

  const loading = state.kind === "loading";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight">
          웹 페이지를 Markdown으로
        </h1>
        <p className="text-muted-foreground">
          URL을 붙여넣으면 본문만 Markdown으로 꺼내서 ChatGPT나 Claude로 바로 넘겨요.
        </p>
      </div>

      <div>
        <form onSubmit={submit} noValidate className="flex gap-2">
          <InputGroup className="h-10 flex-1">
            <InputGroupInput
              ref={inputRef}
              type="url"
              inputMode="url"
              autoComplete="off"
              aria-label="웹 페이지 URL"
              aria-invalid={formatError}
              placeholder="https://example.com/article"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setFormatError(false);
              }}
            />
            {url && (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label="지우기"
                  title="지우기"
                  onClick={clear}
                >
                  <XIcon />
                </InputGroupButton>
              </InputGroupAddon>
            )}
          </InputGroup>
          <Button type="submit" className="h-10 px-4" disabled={loading}>
            {loading ? (
              <>
                <Loader2Icon className="animate-spin" data-icon="inline-start" />
                변환 중
              </>
            ) : (
              "변환"
            )}
          </Button>
        </form>
        {formatError && (
          <p className="mt-1.5 text-[13px] text-destructive" role="alert">
            올바른 URL을 입력해 주세요. 예: https://example.com/article
          </p>
        )}
      </div>

      {state.kind === "idle" && (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <LinkIcon />
            </EmptyMedia>
            <EmptyTitle className="break-keep">변환할 페이지 주소를 붙여넣으세요</EmptyTitle>
            <EmptyDescription className="break-keep">
              블로그 글, 뉴스 기사, 문서 페이지에서 본문만 깔끔하게 추출해요.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {loading && (
        <Card className="px-4 py-[18px] sm:px-7 sm:py-6" aria-busy="true">
          <div className="flex flex-col gap-2.5 border-b pb-[18px]">
            <Skeleton className="h-3.5 w-[30%]" />
            <Skeleton className="h-7 w-[80%]" />
            <Skeleton className="h-3.5 w-[45%]" />
          </div>
          <div className="flex flex-col gap-2.5">
            <Skeleton className="h-3.5" />
            <Skeleton className="h-3.5 w-[94%]" />
            <Skeleton className="h-3.5 w-[88%]" />
            <Skeleton className="h-3.5 w-[60%]" />
          </div>
        </Card>
      )}

      {state.kind === "error" && (
        <Alert variant="destructive">
          <CircleAlertIcon />
          <AlertTitle>페이지를 불러오지 못했어요</AlertTitle>
          <AlertDescription>
            주소가 맞는지 확인하거나 잠시 후 다시 시도해 주세요.
            {state.detail && ` (응답: ${state.detail})`}
          </AlertDescription>
        </Alert>
      )}

      {state.kind === "empty" && (
        <Alert>
          <FileTextIcon />
          <AlertTitle>본문을 찾지 못했어요</AlertTitle>
          <AlertDescription>
            로그인이 필요하거나 브라우저에서 스크립트로 그리는 페이지는 본문을 추출할 수
            없어요. 다른 주소로 시도해 주세요.
          </AlertDescription>
        </Alert>
      )}

      {state.kind === "result" && <ResultView key={state.id} page={state.page} />}
    </div>
  );
}
