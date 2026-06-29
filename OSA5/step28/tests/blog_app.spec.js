const { test, expect, describe, beforeEach } = require("@playwright/test");
const { loginWith, createBlog, openBlog } = require("./helper");

describe("Blog app (router-based UI, 5.28)", () => {
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

  test("the login link in the nav bar shows the login form", async ({
    page,
  }) => {
    await page.getByRole("link", { name: "login" }).click();
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
      // After login the nav shows the logged-in user.
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
      // And the blogs page is shown.
      await expect(page.getByRole("heading", { name: "blogs" })).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");
      await expect(page.locator(".notification.error")).toContainText(
        "wrong username or password",
      );
      await expect(
        page.getByText("Matti Luukkainen logged in"),
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created from the /create page", async ({
      page,
    }) => {
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

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: "Likeable blog",
          author: "Tester",
          url: "https://example.com/likeable",
        });
      });

      test("a blog can be liked from its single-blog view", async ({
        page,
      }) => {
        await openBlog(page, { title: "Likeable blog", author: "Tester" });

        await expect(
          page.getByRole("heading", { name: "Likeable blog Tester" }),
        ).toBeVisible();
        await expect(page.getByText("likes 0")).toBeVisible();

        await page.getByRole("button", { name: "like" }).click();
        await expect(page.getByText("likes 1")).toBeVisible();
      });

      test("the creator can delete the blog and is redirected to /", async ({
        page,
      }) => {
        page.on("dialog", (dialog) => dialog.accept());

        await openBlog(page, { title: "Likeable blog", author: "Tester" });
        await page.getByRole("button", { name: "remove" }).click();

        // After delete the app navigates back to the all-blogs view.
        await expect(
          page.getByRole("heading", { name: "blogs" }),
        ).toBeVisible();
        await expect(
          page.locator(".blog").filter({ hasText: "Likeable blog Tester" }),
        ).toHaveCount(0);
      });
    });
  });
});
