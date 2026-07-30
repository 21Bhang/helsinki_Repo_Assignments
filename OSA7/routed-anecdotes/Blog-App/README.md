# BlogList — Full Stack Open Part 7 (Exercises 7.7–7.20)

A full-stack blog application built with React + Vite on the frontend and
Express + MongoDB (Mongoose) on the backend. The UI follows a clean white &
blue design: a solid blue header reading "Blog App" with uppercase navigation
links (BLOGS / USERS / NEW BLOG / LOGOUT), a simple blog list, a single-blog
view with a comments section, and a users table.

This repository completes exercises **7.7 through 7.20** of the University of
Helsinki's [Full Stack Open](https://fullstackopen.com/en/) course (part 7),
building on the part-5 BlogList foundation (exercises 5.24–5.28).

---

## Project structure

```
bloglist/
├── backend/                 # Express + Mongoose REST API (Exercise 7.7)
│   ├── package.json         #   separate package.json, build/start scripts
│   ├── .env                 #   MONGODB_URI, SECRET, PORT  (not committed)
│   └── src/
│       ├── index.js         #   server entry: CORS, JSON, token extractor,
│       │                    #   API routes, static frontend, SPA fallback,
│       │                    #   centralized error handler
│       ├── auth.js          #   JWT helpers: tokenFor, tokenExtractor, requireAuth
│       ├── controllers/
│       │   ├── blogs.js     #   /api/blogs CRUD + comments
│       │   ├── users.js     #   /api/users
│       │   └── login.js     #   /api/login (JWT)
│       ├── models/
│       │   ├── blog.js      #   Blog schema (with comments sub-documents)
│       │   └── user.js      #   User schema (unique username, bcrypt hash)
│       ├── utils/
│       │   ├── db.js        #   MongoDB connection helper
│       │   └── seed.js      #   demo data seeding script
│       └── .eslintrc.json
├── frontend/                # React 18 + Vite SPA
│   ├── package.json         #   dev/build/lint/format scripts
│   ├── vite.config.js       #   dev proxy → backend on port 3001
│   ├── .prettierrc.json     #   Exercise 7.10
│   ├── .editorconfig        #   Exercise 7.10
│   ├── .prettierignore
│   ├── .eslintrc.json
│   ├── index.html
│   └── src/
│       ├── main.jsx         #   BrowserRouter + StrictMode
│       ├── App.jsx          #   routes + ErrorBoundary (7.8) + splat 404 (7.9)
│       ├── index.css        #   white & blue design system
│       ├── components/
│       │   ├── Navbar.jsx           #  blue header, uppercase nav (OUTSIDE boundary)
│       │   ├── ErrorBoundary.jsx    #  Exercise 7.8
│       │   └── Notification.jsx     #  reads Zustand notification store (7.11)
│       ├── hooks/
│       │   └── useField.js          #  reusable controlled-input hook (7.15)
│       ├── pages/
│       │   ├── BlogsPage.jsx        #  blog list (reads blog store)
│       │   ├── BlogViewPage.jsx     #  single blog + comments (7.18/7.19)
│       │   ├── NewBlogPage.jsx      #  create blog form
│       │   ├── UsersPage.jsx        #  users table (7.16)
│       │   ├── UserDetailPage.jsx   #  single user + their blogs (7.17)
│       │   ├── LoginPage.jsx        #  login form
│       │   └── NotFound.jsx         #  Exercise 7.9 (404)
│       ├── store/
│       │   ├── notificationStore.js #  Exercise 7.11 (Zustand)
│       │   ├── blogStore.js         #  Exercises 7.12 & 7.13 (Zustand)
│       │   └── userStore.js         #  Exercise 7.14 (Zustand)
│       └── services/
│           ├── blogs.js             #  /api/blogs HTTP client
│           ├── users.js             #  /api/users HTTP client
│           ├── login.js             #  /api/login HTTP client
│           └── persistentUser.js    #  localStorage user persistence (7.15)
└── .gitignore
```

---

## Environment

The backend reads its configuration from `backend/.env`:

```
MONGODB_URI=<your MongoDB connection string>
SECRET=<a long random string used to sign JWTs>
PORT=3001
```

The `.env` file is git-ignored. Create it in `backend/` before running.

---

## Running the application

### Production (single server — Exercise 7.7)

The backend serves the built frontend, so the whole app runs from one server:

```bash
cd bloglist/backend
npm install
npm run start:full
```

`npm run start:full` builds the frontend (`vite build` → `frontend/dist`) and
then starts the Express server, which:

1. serves the REST API under `/api/*`,
2. serves the static frontend bundle from `frontend/dist`,
3. falls back to `index.html` for any non-API GET request (SPA client-side
   routing works on refresh / deep links).

Open `http://localhost:3001/`.

### Development (two servers, hot reload)

```bash
# terminal 1 — backend with auto-restart
cd bloglist/backend
npm install
npm run dev

# terminal 2 — frontend with Vite HMR
cd bloglist/frontend
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies `/api`
requests to the backend on port 3001 (see `vite.config.js`).

### Seeding demo data

```bash
cd bloglist/backend
node src/utils/seed.js
```

This wipes and re-populates MongoDB with demo users and blogs that match the
reference design:

| name                | username  | password  | blogs |
|---------------------|-----------|-----------|-------|
| Matti Luukkainen    | mluukkai  | salainen  | 3     |
| Outi Savolainen     | ousavola  | (hashed)  | 2     |
| Arto Hellas         | hellas    | (hashed)  | 1     |
| Superuser           | root      | sekret    | 0     |

The blog "The Single Responsibility Principle" is seeded with three comments
("a must read", "a true classic", "has this still meaning in the LLM era?").

**Log in with `mluukkai` / `salainen` (or `root` / `sekret`).**

---

## Code formatting (Exercise 7.10)

Prettier is configured in `frontend/.prettierrc.json` (2-space indent, no
semicolons, single quotes, trailing commas, print width 80) with a matching
`.editorconfig`.

```bash
cd bloglist/frontend
npm run format         # write formatted files
npm run format:check   # CI-style check (fails on unformatted files)
```

---

## REST API

| Method | Path                        | Auth | Description                          |
|--------|-----------------------------|------|--------------------------------------|
| GET    | `/api/blogs`                | –    | list all blogs (with creator info)   |
| POST   | `/api/blogs`                | JWT  | create a blog                        |
| GET    | `/api/blogs/:id`            | –    | fetch a single blog (with comments)  |
| PUT    | `/api/blogs/:id`            | –    | update a blog (used for liking)      |
| POST   | `/api/blogs/:id/comments`   | –    | add a comment to a blog              |
| DELETE | `/api/blogs/:id`            | JWT  | delete a blog (creator only)         |
| GET    | `/api/users`                | –    | list all users (with their blogs)    |
| GET    | `/api/users/:id`            | –    | fetch a single user (with blogs)     |
| POST   | `/api/users`                | –    | register a new user                  |
| POST   | `/api/login`                | –    | authenticate, returns a JWT          |
| GET    | `/api/health`               | –    | health check                         |

Authenticated requests send `Authorization: Bearer <token>`.

---

## Exercises covered

### 7.7 — Frontend and backend in the same repository
The `bloglist/` repo contains `backend/` and `frontend/`, each with its own
`package.json`. After building the frontend, the Express backend serves the
production bundle from `frontend/dist` (static middleware + SPA catch-all
fallback), so `npm run start:full` delivers the entire app from one origin.

### 7.8 — Error boundary
`components/ErrorBoundary.jsx` is a React class component implementing
`getDerivedStateFromError` and `componentDidCatch`. In `App.jsx` the
`<Navbar />` is rendered **outside** the `<ErrorBoundary>`, so a rendering
error anywhere in the routed content still leaves navigation usable. The
fallback UI shows a friendly message, the error detail, and a "Try again"
button. The boundary is keyed on `location.pathname + location.search`, so
navigating away from an errored route automatically recovers.

### 7.9 — Page not found
A splat route `<Route path="*" element={<NotFound />} />` renders the 404
page ("404 / Page not found / Back to blogs") for any path not matched by the
other routes.

### 7.10 — Automatic code formatting
Prettier is configured (`.prettierrc.json`, `.editorconfig`, `.prettierignore`)
with `format` / `format:check` npm scripts. All source files are formatted.

### 7.11 — Notification store (Zustand)
`store/notificationStore.js` holds the notification `message` and `type`.
`notify(message, type, timeout)` sets the message and auto-clears it after a
timeout (cancelling any previous timer). `components/Notification.jsx` reads
from the store and renders a success/error banner.

### 7.12 — Blog store: create + list (Zustand)
`store/blogStore.js` owns the blog collection. `setBlogsFromServer()` fetches
all blogs from the backend into the store; `addBlog(newBlog, user)` creates a
blog via the API and appends it to the store. `BlogsPage` reads `blogs` (and
`sortedBlogs()`) directly from the store instead of holding local state.

### 7.13 — Like and delete via the store (Zustand)
The blog store also provides `likeBlog` / `likeBlogById` (increments likes
through the API and updates the store) and `removeBlog` (deletes via the API
and removes from the store). `NewBlogPage` uses `addBlog`; `BlogViewPage` uses
`likeBlogById`, `addComment`, and `removeBlog`.

### 7.14 — User store (Zustand)
`store/userStore.js` manages the signed-in user. On module load it rehydrates
the user + token from `localStorage` (via the `persistentUser` service) and
primes the blog service's token. `login()` authenticates, persists, and sets
the token; `logout()` clears everything. `Navbar` reads `user` from the store
and shows NEW BLOG / LOGOUT (or LOGIN) accordingly.

### 7.15 — Cleaning the code
All direct `window.localStorage` access is extracted into a dedicated service
module `src/services/persistentUser.js`, which exports `getUser()`,
`saveUser(user)`, and `removeUser()`. The user store calls these instead of
touching `localStorage` directly, so persistence logic lives in exactly one
place.

A reusable `useField` custom hook (`src/hooks/useField.js`) is introduced and
used in every form: the login form (username/password), the new-blog form
(title/author/url), and the comment form. Each field returns `{ value,
onChange, reset, asProps }`; `asProps` is spread onto the `<input>` and
`reset()` clears the field after a successful submit.

### 7.16 — Users view
`pages/UsersPage.jsx` fetches all users from `/api/users` (each with their
populated blogs) and renders them in a table with three columns — **Name**,
**Username**, and **Blogs created** (the count of each user's blogs).

### 7.17 — Individual user view
`pages/UserDetailPage.jsx` (route `/users/:id`) shows the user's name and a
bulleted list of the blogs they have created, each linking to the single-blog
view. It is reached by clicking a user's name in the users table.

### 7.18 — Comments, step 1
Comments are stored as sub-documents on the `Blog` Mongoose model
(`models/blog.js`). The backend exposes `POST /api/blogs/:id/comments`, which
appends an anonymous comment (no user association) and returns the updated
blog. `GET /api/blogs/:id` returns the blog with its comments, and
`BlogViewPage` displays them as a bulleted list.

### 7.19 — Comments, step 2
The single-blog view includes an "add comment" input (managed by `useField`)
and an ADD COMMENT button. Submitting calls the blog store's `addComment`
action, which posts to `/api/blogs/:id/comments` and updates the displayed
blog, so the new comment appears immediately.

### 7.20 — Styling
The visual appearance is polished using the techniques from part 5: a
consistent white & blue design system in `index.css` (CSS variables for
colours, spacing, radius, and shadows), a solid blue header with uppercase
nav links and an active-link underline, the blog view and user-detail view
wrapped in subtle bordered cards with soft shadows, the comments section in a
light-blue card with a comment count, a clean users table with hover
highlighting, and focus states on form inputs.

---

## Tech stack

- **Frontend:** React 18, Vite 5, React Router 6, Zustand 4
- **Backend:** Express 4, Mongoose 8, MongoDB, JSON Web Tokens, bcryptjs,
  express-async-errors, cors, dotenv
- **Tooling:** ESLint, Prettier, EditorConfig
