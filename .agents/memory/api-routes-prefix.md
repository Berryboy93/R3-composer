---
name: API routes double-prefix pitfall
description: New Express route files must not add /api prefix — the app.ts already mounts the router at /api
---

## The Rule
Route files registered in `artifacts/api-server/src/routes/index.ts` must NOT include `/api` in their `router.use(...)` path.

## Why
`artifacts/api-server/src/app.ts` mounts the main router with `app.use("/api", router)`. Adding `/api` again in `routes/index.ts` produces double-prefixed paths like `/api/api/projects`.

## How to Apply
In `routes/index.ts`:
```ts
// CORRECT
router.use(generateRouter);
router.use(projectsRouter);

// WRONG — produces /api/api/projects
router.use("/api", projectsRouter);
```

Individual route handlers inside each file should use paths like `/composer/generate`, `/projects`, `/exports/midi` etc. (no `/api` prefix).
