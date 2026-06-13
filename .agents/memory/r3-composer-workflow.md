---
name: R3 Composer workflow startup
description: The artifact-managed workflow for r3-composer fails restart_workflow health check; workaround is a standalone configureWorkflow without waitForPort.
---

The `restart_workflow` native tool consistently fails for the `artifacts/r3-composer: web` artifact-managed workflow with `DIDNT_OPEN_A_PORT` for port 5173, even though Vite starts successfully and serves HTTP 200.

**Why:** The Replit health check for this artifact times out before detecting the port as open, even though Vite binds in <400ms. Root cause unknown — possibly related to `[[integratedSkills]]` or `previewPath = "/"` triggering additional platform validation. The mockup-sandbox (kind="design", previewPath="/__mockup") does not have this issue.

**How to apply:** When restarting the r3-composer frontend after code changes, do NOT use `restart_workflow`. Instead:

```javascript
// Kill the old workflow if running
await removeWorkflow({ name: "R3 Dev Server" });

// Recreate it — no waitForPort avoids the broken health check
await configureWorkflow({
  name: "R3 Dev Server",
  command: "PORT=5173 BASE_PATH=/ pnpm --filter @workspace/r3-composer run dev",
  outputType: "webview",
  autoStart: true
});
```

The artifact.toml routing (paths=["/"] → localPort=5173) still works regardless of which workflow started Vite. The `artifacts/r3-composer: web` managed workflow will stay in "failed" state — that's expected and harmless.
