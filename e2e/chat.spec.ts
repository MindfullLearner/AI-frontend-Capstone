import { test, expect } from "@playwright/test";

test.describe("ThinkLens chat", () => {
  test("sends a user message", async ({ page }) => {
    await page.route("**/api/chat", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/event-stream",
        body: "",
      });
    });
    
    await page.goto("/chat");

    await expect(
    page.getByRole("heading", { name: "ThinkLens Chat" })
    ).toBeVisible();
    const messageInput = page.getByRole("textbox", { name: "Message" });

    await messageInput.fill("Help me decide between two job offers");

    await expect(
      page.getByRole("button", { name: "Send" })
    ).toBeEnabled();
    await page.getByRole("button", { name: "Send" }).click();

    await expect(
      page.getByText("Help me decide between two job offers")
    ).toBeVisible();
    });
    
    
});