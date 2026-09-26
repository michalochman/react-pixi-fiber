# react-pixi-fiber examples

Examples for [react-pixi-fiber](../../packages/react-pixi-fiber), built with [Vite](https://vite.dev). They use the
library from this workspace, so build it first. From the repository root:

```sh
pnpm install
pnpm build
pnpm start
```

`pnpm --filter examples build` writes a production build to `dist/`.

Vite pre-bundles react-pixi-fiber when the dev server starts. After rebuilding the library, restart it with
`pnpm --filter examples start --force` to pick up the new build.
