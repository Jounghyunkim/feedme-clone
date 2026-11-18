import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";

import Home from "@/app/page";

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light", setTheme: vi.fn() }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// UserMenu is an async Server Component backed by Supabase; not part of this test.
vi.mock("@/components/auth/user-menu", () => ({ UserMenu: () => null }));

afterEach(() => vi.unstubAllGlobals());

const page = {
  url: "https://a.dev/x",
  title: "테스트 글",
  author: "",
  site: "A",
  domain: "a.dev",
  published: "",
  wordCount: 3,
  content: "## 소제목\n\n본문",
};

function stubFetch(body: unknown, ok = true) {
  const fn = vi.fn().mockResolvedValue({ ok, json: async () => body });
  vi.stubGlobal("fetch", fn);
  return fn;
}

test("웹 주소가 아니면 가져오지 않고 형식 오류를 보여 주며, 입력을 고치면 사라진다", async () => {
  const fetchFn = stubFetch({ page });
  const user = userEvent.setup();
  render(<Home />);

  await user.type(screen.getByLabelText("웹 페이지 URL"), "example");
  await user.click(screen.getByRole("button", { name: "변환" }));
  expect(screen.getByText(/올바른 URL을 입력해 주세요/)).toBeInTheDocument();
  expect(fetchFn).not.toHaveBeenCalled();

  await user.type(screen.getByLabelText("웹 페이지 URL"), "x");
  expect(screen.queryByText(/올바른 URL을 입력해 주세요/)).not.toBeInTheDocument();
});

test("변환하면 제목과 본문이 보이고 지우기로 처음 상태로 돌아간다", async () => {
  stubFetch({ page });
  const user = userEvent.setup();
  render(<Home />);

  await user.type(screen.getByLabelText("웹 페이지 URL"), "https://a.dev/x");
  await user.click(screen.getByRole("button", { name: "변환" }));
  expect(await screen.findByRole("heading", { name: "테스트 글" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "소제목" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "ChatGPT로 열기" })).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "지우기" }));
  expect(screen.getByLabelText("웹 페이지 URL")).toHaveValue("");
  expect(screen.getByLabelText("웹 페이지 URL")).toHaveFocus();
  expect(screen.getByText("변환할 페이지 주소를 붙여넣으세요")).toBeInTheDocument();
});

test("본문이 비면 안내만 보이고 내보내기 버튼은 없다", async () => {
  stubFetch({ page: { ...page, content: "" } });
  const user = userEvent.setup();
  render(<Home />);

  await user.type(screen.getByLabelText("웹 페이지 URL"), "https://x.com");
  await user.click(screen.getByRole("button", { name: "변환" }));
  expect(await screen.findByText("본문을 찾지 못했어요")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "복사하기" })).not.toBeInTheDocument();
});

test("가져오기에 실패하면 오류 알림을 보여 준다", async () => {
  stubFetch({ error: "fetch", detail: "404 Not Found" }, false);
  const user = userEvent.setup();
  render(<Home />);

  await user.type(screen.getByLabelText("웹 페이지 URL"), "https://a.dev/none");
  await user.click(screen.getByRole("button", { name: "변환" }));
  await waitFor(() =>
    expect(screen.getByText("페이지를 불러오지 못했어요")).toBeInTheDocument(),
  );
  expect(screen.getByText(/404 Not Found/)).toBeInTheDocument();
});

test("직접 입력을 고르면 입력칸이 나타나고 다른 항목을 고르면 숨는다", async () => {
  stubFetch({ page });
  const user = userEvent.setup();
  render(<Home />);
  await user.type(screen.getByLabelText("웹 페이지 URL"), "https://a.dev/x");
  await user.click(screen.getByRole("button", { name: "변환" }));
  await screen.findByRole("heading", { name: "테스트 글" });

  await user.click(screen.getByRole("button", { name: "직접 입력" }));
  expect(screen.getByLabelText("직접 입력 프롬프트")).toHaveFocus();
  await user.click(screen.getByRole("button", { name: "요약해줘" }));
  expect(screen.queryByLabelText("직접 입력 프롬프트")).not.toBeInTheDocument();
});
