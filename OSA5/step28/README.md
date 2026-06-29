# OSA5 E2E tests

End-to-end tests for the bloglist frontend, written with Playwright. The tests
do **not** start the system under test — both the backend and frontend must be
running first.

## Prerequisites

In two separate terminals:

```bash
# 1. Backend in TEST mode (port 3003).
#    NODE_ENV=test mounts POST /api/testing/reset for db cleanup.
cd OSA4/step23
npm install
npm run start:test
```

```bash
# 2. Frontend dev server (port 5173, proxies /api → 3003).
#    Any of the step12+ frontends work; step16 has the full feature set.
cd OSA5/step16
npm install
npm run dev
```

## Running

```bash
cd OSA5/step17        # or step18 / step19 / ...
npm install
npx playwright install chromium    # one-time browser download
npm test
```

Reports: `npm run test:report` (after a run) or `npm test -- --ui` to run in UI mode.
