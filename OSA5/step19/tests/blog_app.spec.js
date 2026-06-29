const { test, expect, describe, beforeEach } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post("/api/testing/reset");
    await request.post("/api/users", {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Log in to application" }),
    ).toBeVisible();
    await expect(page.getByLabel("username")).toBeVisible();
    await expect(page.getByLabel("password")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await expect(
        page.getByText("Matti Luukkainen logged in"),
      ).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");
      const errorDiv = page.locator(".notification.error");
      await expect(errorDiv).toContainText("wrong username or password");
      await expect(
        page.getByText("Matti Luukkainen logged in"),
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, {
        title: "End-to-end testing with Playwright",
        author: "Microsoft",
        url: "https://playwright.dev",
      });

      await expect(
        page.locator(".blog").filter({
          hasText: "End-to-end testing with Playwright Microsoft",
        }),
      ).toBeVisible();
    });
  });
});
