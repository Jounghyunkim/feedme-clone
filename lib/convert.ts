import { parseHTML } from "linkedom";
import { Defuddle } from "defuddle/node";

import type { ConvertedPage } from "@/lib/export-markdown";

export class FetchFailedError extends Error {
  constructor(public detail: string) {
    super(detail);
  }
}

export async function convertUrl(url: string): Promise<ConvertedPage> {
  let response: Response;
  try {
    response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; FeedmeBot/1.0; +https://example.com/bot)",
        accept: "text/html,application/xhtml+xml",
      },
    });
  } catch {
    throw new FetchFailedError("연결하지 못했어요");
  }
  if (!response.ok) {
    throw new FetchFailedError(`${response.status} ${response.statusText}`.trim());
  }
  const html = await response.text();
  const { document } = parseHTML(html);
  const result = await Defuddle(document as unknown as Document, response.url || url, {
    markdown: true,
  });
  return {
    url,
    title: result.title ?? "",
    author: result.author ?? "",
    site: result.site ?? "",
    domain: result.domain || new URL(url).hostname,
    published: result.published ?? "",
    wordCount: result.wordCount ?? 0,
    content: (result.content ?? "").trim(),
  };
}
