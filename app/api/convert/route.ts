import { FetchFailedError, convertUrl } from "@/lib/convert";
import { isWebUrl } from "@/lib/export-markdown";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { url?: unknown } | null;
  const url = typeof body?.url === "string" ? body.url.trim() : "";
  if (!isWebUrl(url)) {
    return Response.json({ error: "invalid" }, { status: 400 });
  }
  try {
    return Response.json({ page: await convertUrl(url) });
  } catch (error) {
    const detail = error instanceof FetchFailedError ? error.detail : "";
    return Response.json({ error: "fetch", detail }, { status: 502 });
  }
}
