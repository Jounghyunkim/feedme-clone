import { describe, expect, test } from "vitest";

import {
  LINK_LIMIT,
  buildExportMarkdown,
  buildFileName,
  buildLlmHandoff,
  formatPublished,
  isWebUrl,
  type ConvertedPage,
} from "@/lib/export-markdown";

const page: ConvertedPage = {
  url: "https://a.dev/x",
  title: "제목",
  author: "김하늘",
  site: "A",
  domain: "a.dev",
  published: "2026-10-02T00:00:00Z",
  wordCount: 10,
  content: "본문입니다.",
};

describe("isWebUrl", () => {
  test("http(s)로 시작하는 주소만 통과한다", () => {
    expect(isWebUrl("https://a.dev/x")).toBe(true);
    expect(isWebUrl("")).toBe(false);
    expect(isWebUrl("a.dev")).toBe(false);
    expect(isWebUrl("ftp://a.dev")).toBe(false);
  });
});

describe("buildExportMarkdown", () => {
  test("제목, 저자, 원문 URL, 본문 순서로 만든다", () => {
    expect(buildExportMarkdown(page)).toBe(
      "# 제목\n\n저자: 김하늘\n원문: https://a.dev/x\n\n본문입니다.",
    );
  });
  test("저자가 없으면 저자 줄을 뺀다", () => {
    expect(buildExportMarkdown({ ...page, author: "" })).toBe(
      "# 제목\n\n원문: https://a.dev/x\n\n본문입니다.",
    );
  });
  test("제목이 없으면 도메인을 쓴다", () => {
    expect(buildExportMarkdown({ ...page, title: "" }).startsWith("# a.dev")).toBe(true);
  });
});

describe("buildFileName", () => {
  test("쓸 수 없는 문자를 제거한다", () => {
    expect(buildFileName('a/b:c*d?"e<f>g|h', "x.dev")).toBe("abcdefgh.md");
  });
  test("제목이 비면 도메인을 쓴다", () => {
    expect(buildFileName("  ", "x.dev")).toBe("x.dev.md");
  });
});

describe("buildLlmHandoff", () => {
  test("한도 안이면 프롬프트, 빈 줄, Markdown 순으로 주소에 담는다", () => {
    const h = buildLlmHandoff("chatgpt", "요약해줘", "# 본문");
    expect(h.clipboardText).toBeNull();
    expect(h.url).toBe(`https://chatgpt.com/?q=${encodeURIComponent("요약해줘\n\n# 본문")}`);
  });
  test("프롬프트가 비면 Markdown만 담는다", () => {
    const h = buildLlmHandoff("claude", "  ", "# 본문");
    expect(h.url).toBe(`https://claude.ai/new?q=${encodeURIComponent("# 본문")}`);
  });
  test("한도를 넘으면 전체를 클립보드로 보내고 주소에는 프롬프트만 담는다", () => {
    const md = "가".repeat(LINK_LIMIT);
    const h = buildLlmHandoff("claude", "요약해줘", md);
    expect(h.clipboardText).toBe(`요약해줘\n\n${md}`);
    expect(h.url).toBe(`https://claude.ai/new?q=${encodeURIComponent("요약해줘")}`);
  });
  test("한도를 넘고 프롬프트도 없으면 빈 새 대화 주소다", () => {
    const h = buildLlmHandoff("chatgpt", "", "가".repeat(LINK_LIMIT));
    expect(h.url).toBe("https://chatgpt.com/");
  });
});

test("formatPublished는 한국어 날짜로 바꾸고 잘못된 값은 빈 문자열이다", () => {
  expect(formatPublished("2026-10-02T00:00:00Z")).toBe("2026년 10월 2일");
  expect(formatPublished("")).toBe("");
  expect(formatPublished("nope")).toBe("");
});
