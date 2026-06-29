// 5.28: helper functions updated for the router-based UI introduced in 5.24–5.26.
const loginWith = async (page, username, password) => {
  // Open the /login route (linked from the nav bar when logged out).
  await page.getByRole("link", { name: "login" }).click();

  await page.getByLabel("username").fill(username);
  await page.getByLabel("password").fill(password);
  await page.getByRole("button", { name: "login" }).click();
};

const createBlog = async (page, { title, author, url }) => {
  // Navigate to /create via the nav bar link instead of toggling a form.
  await page.getByRole("link", { name: "create new blog" }).click();

  await page.getByLabel("title").fill(title);
  await page.getByLabel("author").fill(author);
  await page.getByLabel("url").fill(url);
  await page.getByRole("button", { name: "create" }).click();

  // After create the app navigates back to "/"; wait for the entry to appear.
  await page
    .locator(".blog")
    .filter({ hasText: `${title} ${author}` })
    .waitFor();
};

const openBlog = async (page, { title, author }) => {
  await page
    .locator(".blog")
    .filter({ hasText: `${title} ${author}` })
    .getByRole("link")
    .click();
};

module.exports = { loginWith, createBlog, openBlog };
