import { expect, test } from "@playwright/test";

test("홈 화면이 열리고 URL 입력과 빈 상태 안내가 보인다", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "웹 페이지를 Markdown으로"
  );
  await expect(page.getByLabel("웹 페이지 URL")).toBeVisible();
  await expect(page.getByText("변환할 페이지 주소를 붙여넣으세요")).toBeVisible();
});
