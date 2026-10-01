---
"@react-pixi-fiber/react-18": major
---

Initial release. The React 18 adapter for React 18.3.1 or a later 18.x; 2.x accepted React 18.2. It bundles `react-reconciler` 0.29.2 and renders on a legacy root, as 2.x did; `react18({ root: "concurrent" })` renders on a concurrent root instead. Errors React recovers from are logged with `console.error`.
