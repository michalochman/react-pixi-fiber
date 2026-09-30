---
"@react-pixi-fiber/react-19": major
---

Initial release. The React 19 adapter for React 19.3 or a later 19.x. It bundles `react-reconciler` 0.34.0 and renders on a concurrent root, as `createRoot` does; 2.x rendered on a legacy root. It logs uncaught, caught and recoverable render errors with `console.error`, gives a `<Fragment ref>` inside `Stage` a `PixiFragmentInstance`, and renders a `<ViewTransition>` inside `Stage` without animating.
