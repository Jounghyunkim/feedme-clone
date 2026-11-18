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
      {/* 넓은 화면에서 고정될 때 위쪽 틈으로 본문이 비치지 않도록 배경으로 덮는다. */}
      <div className="lg:sticky lg:top-0 lg:z-10 lg:-mt-4 lg:bg-background lg:pt-4">
        <ExportCard page={page} markdown={markdown} />
      </div>
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
          <ReactMarkdown
            components={{
              // 링크를 같은 탭에서 열면 변환 결과가 사라지므로 새 탭으로 연다.
              a: ({ node, ...props }) => {
                void node; // hast 노드는 DOM 속성이 아니므로 넘기지 않는다.
                return <a {...props} target="_blank" rel="noopener noreferrer" />;
              },
            }}
          >
            {page.content}
          </ReactMarkdown>
        </div>
      </Card>
    </div>
  );
}
