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

    describe("and several blogs with different likes exist", () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, {
          title: "The first blog",
          author: "A",
          url: "https://example.com/1",
        });
        await createBlog(page, {
          title: "The second blog",
          author: "B",
          url: "https://example.com/2",
        });
        await createBlog(page, {
          title: "The third blog",
          author: "C",
          url: "https://example.com/3",
        });
      });

      test("blogs are ordered by likes, descending", async ({ page }) => {
        // expand each card so "likes N" is visible and like buttons clickable
        const cards = page.locator(".blog");
        await expect(cards).toHaveCount(3);

        for (let i = 0; i < 3; i++) {
          await cards.nth(i).getByRole("button", { name: "view" }).click();
        }

        // helper: click "like" n times on the card identified by title, waiting
        // for the displayed count to update so we don't race the next click.
        const likeNTimes = async (title, n) => {
          const card = page.locator(".blog").filter({ hasText: `${title} ` });
          for (let i = 0; i < n; i++) {
            await card.getByRole("button", { name: "like" }).click();
            await expect(card.getByText(`likes ${i + 1}`)).toBeVisible();
          }
        };

        // give blog #2 the most likes, blog #3 the second-most, blog #1 the least
        await likeNTimes("The first blog", 1);
        await likeNTimes("The second blog", 3);
        await likeNTimes("The third blog", 2);

        // after sorting, expected order is: second (3) > third (2) > first (1)
        const sortedCards = page.locator(".blog");
        await expect(sortedCards.nth(0)).toContainText("The second blog");
        await expect(sortedCards.nth(1)).toContainText("The third blog");
        await expect(sortedCards.nth(2)).toContainText("The first blog");
      });
    });
  });
});
