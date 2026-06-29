const { test, expect, describe, beforeEach } = require("@playwright/test");

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    // reset db and seed a user via the test-only backend endpoint
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
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("salainen");
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByLabel("username").fill("mluukkai");
      await page.getByLabel("password").fill("wrong");
      await page.getByRole("button", { name: "login" }).click();

      const errorDiv = page.locator(".notification.error");
      await expect(errorDiv).toContainText("wrong username or password");

      await expect(
        page.getByText("Matti Luukkainen logged in"),
      ).not.toBeVisible();
    });
  });
});
