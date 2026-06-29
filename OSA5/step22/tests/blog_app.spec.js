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
    // a second user, so we can verify visibility rules across owners
    await request.post("/api/users", {
      data: {
        name: "Arto Hellas",
        username: "hellas",
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
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
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

    describe("and a blog exists", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: "Likeable blog",
          author: "Tester",
          url: "https://example.com/likeable",
        });
      });

      test("a blog can be liked", async ({ page }) => {
        const blog = page
          .locator(".blog")
          .filter({ hasText: "Likeable blog Tester" });

        await blog.getByRole("button", { name: "view" }).click();
        await expect(blog.getByText("likes 0")).toBeVisible();

        await blog.getByRole("button", { name: "like" }).click();
        await expect(blog.getByText("likes 1")).toBeVisible();
      });

      test("the user who added the blog can delete it", async ({ page }) => {
        page.on("dialog", (dialog) => dialog.accept());

        const blog = page
          .locator(".blog")
          .filter({ hasText: "Likeable blog Tester" });

        await blog.getByRole("button", { name: "view" }).click();
        await blog.getByRole("button", { name: "remove" }).click();

        await expect(
          page.locator(".blog").filter({ hasText: "Likeable blog Tester" }),
        ).toHaveCount(0);
      });

      test("only the creator sees the remove button", async ({ page }) => {
        // log out, then log in as a different user
        await page.getByRole("button", { name: "logout" }).click();
        await loginWith(page, "hellas", "salainen");
        await expect(page.getByText("Arto Hellas logged in")).toBeVisible();

        const blog = page
          .locator(".blog")
          .filter({ hasText: "Likeable blog Tester" });

        await blog.getByRole("button", { name: "view" }).click();
        await expect(blog.getByRole("button", { name: "remove" })).toHaveCount(
          0,
        );
      });
    });
  });
});
