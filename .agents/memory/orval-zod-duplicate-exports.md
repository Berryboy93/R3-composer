---
name: Orval zod split-mode duplicate exports
description: How to prevent TS2308 duplicate export errors when using orval with zod client in split mode
---

## The Rule
Do NOT include `schemas: { path: "generated/types", type: "typescript" }` in the `zod` orval output config when `mode: "split"` is also set.

## Why
Orval's split mode generates all schemas inline in `api.ts` (as Zod objects). When `schemas` is also set, it generates separate TypeScript interfaces in `types/` with the same names, and rewrites `lib/api-zod/src/index.ts` to re-export BOTH. This causes `TS2308: Module has already exported a member` errors on every `typecheck:libs` run.

## How to Apply
In `lib/api-spec/orval.config.ts`, the zod output block should look like:
```ts
output: {
  workspace: apiZodSrc,
  client: "zod",
  target: "generated",
  mode: "split",   // NO schemas: { ... } here
  clean: true,
  ...
}
```
The Zod schemas in `api.ts` are sufficient for server-side validation. TypeScript types can be inferred from Zod with `z.infer<typeof Schema>`.
