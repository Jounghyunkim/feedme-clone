export const LINK_LIMIT = 30000;

export type ConvertedPage = {
  url: string;
  title: string;
  author: string;
  site: string;
  domain: string;
  published: string;
  wordCount: number;
  content: string;
};

export type LlmService = "chatgpt" | "claude";

const LLM_BASE: Record<LlmService, string> = {
  chatgpt: "https://chatgpt.com/",
  claude: "https://claude.ai/new",
};

export function isWebUrl(value: string): boolean {
  if (!/^https?:\/\//i.test(value.trim())) return false;
  try {
    new URL(value.trim());
    return true;
  } catch {
    return false;
  }
}

export function buildExportMarkdown(page: ConvertedPage): string {
  const title = page.title.trim() || page.domain;
  const lines = [`# ${title}`, ""];
  if (page.author.trim()) lines.push(`저자: ${page.author.trim()}`);
  lines.push(`원문: ${page.url}`, "", page.content.trim());
  return lines.join("\n");
}

export function buildFileName(title: string, domain: string): string {
  const cleaned = title
    .replace(/[\/:*?"<>|\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 100)
    .trim();
  return `${cleaned || domain || "page"}.md`;
}

export type LlmHandoff = {
  /** 새 탭으로 열 주소 */
  url: string;
  /** 길이 한도를 넘어 클립보드로 복사해야 하는 전체 내용. 한도 안이면 null. */
  clipboardText: string | null;
};

export function buildLlmHandoff(
  service: LlmService,
  prompt: string,
  markdown: string,
): LlmHandoff {
  const base = LLM_BASE[service];
  const trimmed = prompt.trim();
  const full = trimmed ? `${trimmed}\n\n${markdown}` : markdown;
  const fullUrl = `${base}?q=${encodeURIComponent(full)}`;
  if (fullUrl.length <= LINK_LIMIT) return { url: fullUrl, clipboardText: null };
  return {
    url: trimmed ? `${base}?q=${encodeURIComponent(trimmed)}` : base,
    clipboardText: full,
  };
}

export function formatPublished(value: string): string {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "";
  return `${date.getUTCFullYear()}년 ${date.getUTCMonth() + 1}월 ${date.getUTCDate()}일`;
}
