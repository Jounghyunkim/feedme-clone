"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowUpRightIcon, CopyIcon, DownloadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  buildFileName,
  buildLlmHandoff,
  type ConvertedPage,
  type LlmService,
} from "@/lib/export-markdown";

const PRESETS = [
  { value: "none", label: "없음", prompt: "" },
  { value: "summary", label: "요약해줘", prompt: "요약해줘" },
  { value: "translate", label: "한국어로 번역해줘", prompt: "한국어로 번역해줘" },
  { value: "explain", label: "쉽게 설명해줘", prompt: "쉽게 설명해줘" },
  { value: "custom", label: "직접 입력", prompt: "" },
] as const;

async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function ExportCard({
  page,
  markdown,
}: {
  page: ConvertedPage;
  markdown: string;
}) {
  const [preset, setPreset] = useState("none");
  const [custom, setCustom] = useState("");
  const customRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preset === "custom") customRef.current?.focus();
  }, [preset]);

  const prompt =
    preset === "custom"
      ? custom
      : (PRESETS.find((p) => p.value === preset)?.prompt ?? "");

  async function copy() {
    if (await writeClipboard(markdown)) {
      toast.success("Markdown을 복사했어요");
    } else {
      toast.error("복사하지 못했어요", {
        description: ".md 다운로드를 이용해 주세요.",
      });
    }
  }

  function download() {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = buildFileName(page.title, page.domain);
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(href);
  }

  function openIn(service: LlmService) {
    const handoff = buildLlmHandoff(service, prompt, markdown);
    // 클립보드 쓰기는 이 탭이 포커스를 가진 동안 시작해야 하므로 탭을 열기 전에 호출한다.
    const copied =
      handoff.clipboardText === null
        ? null
        : writeClipboard(handoff.clipboardText);
    window.open(handoff.url, "_blank", "noopener,noreferrer");
    if (copied === null) {
      toast.success("새 탭에서 열었어요");
      return;
    }
    void copied.then((ok) => {
      if (ok) {
        toast.success("본문이 길어서 클립보드에 복사했어요. 붙여넣기 하세요", {
          duration: 10000,
        });
      } else {
        toast.error("클립보드에 복사하지 못했어요", {
          description: ".md 다운로드를 이용해 주세요.",
        });
      }
    });
  }

  return (
    <Card className="gap-3.5 p-4 lg:sticky lg:top-4 lg:z-10">
      <div className="flex flex-wrap items-center gap-2">
        <span className="basis-full text-[13px] font-medium text-muted-foreground sm:basis-auto sm:flex-1">
          내보내기
        </span>
        <Button variant="outline" className="flex-1 sm:flex-none" onClick={copy}>
          <CopyIcon data-icon="inline-start" />
          복사하기
        </Button>
        <Button variant="outline" className="flex-1 sm:flex-none" onClick={download}>
          <DownloadIcon data-icon="inline-start" />
          .md 다운로드
        </Button>
      </div>
      <Separator />
      <div className="flex flex-col gap-2">
        <span className="text-[13px] font-medium text-muted-foreground">
          프롬프트{" "}
          <span className="text-xs font-normal">· LLM에 보낼 때 본문 앞에 붙여요</span>
        </span>
        <ToggleGroup
          variant="outline"
          className="flex-wrap"
          aria-label="프롬프트"
          value={[preset]}
          onValueChange={(v) => {
            if (v.length > 0) setPreset(v[0]);
          }}
        >
          {PRESETS.map((p) => (
            <ToggleGroupItem
              key={p.value}
              value={p.value}
              className="aria-pressed:bg-primary aria-pressed:text-primary-foreground aria-pressed:hover:bg-primary/90"
            >
              {p.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {preset === "custom" && (
          <Input
            ref={customRef}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            aria-label="직접 입력 프롬프트"
            placeholder="예: 이 글의 핵심 주장 3가지를 표로 정리해줘"
          />
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Button className="min-w-0" onClick={() => openIn("chatgpt")}>
          ChatGPT로 열기
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
        <Button className="min-w-0" onClick={() => openIn("claude")}>
          Claude로 열기
          <ArrowUpRightIcon data-icon="inline-end" />
        </Button>
      </div>
    </Card>
  );
}
