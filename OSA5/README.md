# OSA5 — Bloglist Frontend

Frontend for the bloglist backend built in [OSA4](../OSA4). Built with Vite + React 19.

Each exercise has its own self-contained folder, mirroring the per-step convention used in OSA3/OSA4.

| Exercise | Folder       | Adds                                                                 |
| -------- | ------------ | -------------------------------------------------------------------- |
| 5.1      | `step1/`     | Login form, conditional rendering (login vs. blog list)              |
| 5.2      | `step2/`     | Persist login in `localStorage`, logout button                        |
| 5.3      | `step3/`     | Form for creating new blogs (token sent in `Authorization` header)    |
| 5.4      | `step4/`     | Notifications for success / failure messages                          |
| 5.5      | `step5/`     | `Togglable` component, hide blog form by default, hide after create   |
| 5.6      | `step6/`     | Extract `LoginForm` into its own component (BlogForm already lifted)  |
| 5.7      | `step7/`     | Per-blog view/hide details toggle (state inside `Blog`)               |
| 5.8      | `step8/`     | Like button → `PUT /api/blogs/:id`                                    |
| 5.9      | `step9/`     | Preserve populated `user` field after liking                          |
| 5.10     | `step10/`    | Sort blogs by likes (descending)                                      |
| 5.11     | `step11/`    | Delete blog (owner-only button, `window.confirm`)                     |
| 5.12     | `step12/`    | ESLint configuration (`npm run lint`)                                 |
| 5.13     | `step13/`    | Vitest + React Testing Library setup; `Blog` hides url/likes by default |
| 5.14     | `step14/`    | Test that url + likes appear after clicking the `view` button         |
| 5.15     | `step15/`    | Test that two like clicks call the handler twice                      |
| 5.16     | `step16/`    | Test that `BlogForm` calls `createBlog` with the right details        |
| 5.17     | `step17/`    | Initial Playwright project — login form is shown                      |
| 5.18     | `step18/`    | Login success / failure tests; `beforeEach` resets db + seeds a user  |
| 5.19     | `step19/`    | Extract `helper.js` (`loginWith`, `createBlog`); test create blog     |
| 5.20     | `step20/`    | Test that a blog can be liked                                         |
| 5.21     | `step21/`    | Test that the creator can delete a blog (accepts `window.confirm`)    |
| 5.22     | `step22/`    | Test that only the creator sees the remove button                     |
| 5.23     | `step23/`    | Test that blogs are listed in descending order of likes               |
| 5.24     | `step24/`    | React Router — `/`, `/login`, nav bar with logout                     |
| 5.25     | `step25/`    | `/blogs/:id` single-blog view; like gated to logged-in users          |
| 5.26     | `step26/`    | `/create` route; navigate to `/` after create / delete                |
| 5.27     | `step27/`    | Vitest tests rewritten for the single-blog view (3 scenarios)         |
| 5.28     | `step28/`    | Playwright tests rewritten for the router-based UI                    |
| 5.29     | `step29/`    | Style forms with MUI `TextField` / `Button`, wrap in `Container`      |
| 5.30     | `step30/`    | Style nav bar with `AppBar` / `Toolbar`, style notifications as `Alert` |
| 5.31     | `step31/`    | Style single-blog view with `Card` / `CardActions`                    |

> The E2E projects (`step17/`–`step23/`, `step28/`) are standalone Playwright
> projects and depend on the OSA4 backend running with `NODE_ENV=test` so the
> `POST /api/testing/reset` route is mounted. Start it with
> `cd ../OSA4/step23 && npm run start:test`. See each E2E folder's README.

## Running a step

The Vite dev server proxies `/api` to `http://localhost:3003`, so start the
OSA4 bloglist backend first:

```bash
cd ../OSA4/step23
npm install
npm run dev          # starts backend on port 3003
```

Then in another terminal, start a frontend step:

```bash
cd OSA5/step1        # or step2 / step3 / step4
npm install
npm run dev
```

Lint (steps 12+) and tests (steps 13+):

```bash
npm run lint
npm test
```

The starter template is based on
<https://github.com/fullstack-hy2020/bloglist-frontend>.
