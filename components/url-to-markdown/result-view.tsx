import ReactMarkdown from "react-markdown";

import { Card } from "@/components/ui/card";
import { ExportCard } from "@/components/url-to-markdown/export-card";
import {
  buildExportMarkdown,
  formatPublished,
  type ConvertedPage,
} from "@/lib/export-markdown";

export function ResultView({ page }: { page: ConvertedPage }) {
  const markdown = buildExportMarkdown(page);
  const meta = [
    page.author.trim(),
    formatPublished(page.published),
    page.wordCount > 0 ? `약 ${page.wordCount.toLocaleString("ko-KR")}단어` : "",
  ].filter(Boolean);
  const site = [page.site, page.domain].filter(Boolean);
  const siteLabel = site.length === 2 && site[0] === site[1] ? [site[0]] : site;

  return (
    <div className="flex flex-col gap-4">
      <ExportCard page={page} markdown={markdown} />
      <Card className="px-4 py-[18px] sm:px-7 sm:py-6">
        <header className="flex flex-col gap-2 border-b pb-[18px]">
          <div className="text-[13px] text-muted-foreground">
            {siteLabel.join(" · ")}
          </div>
          <h2 className="text-2xl leading-tight font-bold tracking-tight">
            {page.title || page.domain}
          </h2>
          {meta.length > 0 && (
            <div className="flex flex-wrap gap-2 text-[13px] text-muted-foreground">
              {meta.map((m, i) => (
                <span key={m} className="flex gap-2">
                  {i > 0 && <span aria-hidden>·</span>}
                  {m}
                </span>
              ))}
            </div>
          )}
        </header>
        <div className="markdown-body text-[15px] leading-relaxed break-words">
          <ReactMarkdown>{page.content}</ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}
