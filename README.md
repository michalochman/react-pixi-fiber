<div align="center">
  <img alt="ReactPixiFiber" src="./packages/react-pixi-fiber/react-pixi.svg" width="500" />
</div>

# react-pixi-fiber repository

This repository holds [`react-pixi-fiber`](./packages/react-pixi-fiber), a React Fiber renderer for [PixiJS](https://pixijs.com/), its React and PixiJS adapters, and the examples. Package documentation lives in the [package README](./packages/react-pixi-fiber/README.md).

## Layout

| Path | Contents |
| --- | --- |
| [`packages/pixi-6`](./packages/pixi-6) | `@react-pixi-fiber/pixi-6`, the PixiJS 6 adapter |
| [`packages/pixi-7`](./packages/pixi-7) | `@react-pixi-fiber/pixi-7`, the PixiJS 7 adapter |
| [`packages/pixi-8`](./packages/pixi-8) | `@react-pixi-fiber/pixi-8`, the PixiJS 8 adapter |
| [`packages/react-17`](./packages/react-17) | `@react-pixi-fiber/react-17`, the React 17 adapter |
| [`packages/react-18`](./packages/react-18) | `@react-pixi-fiber/react-18`, the React 18 adapter |
| [`packages/react-19`](./packages/react-19) | `@react-pixi-fiber/react-19`, the React 19 adapter |
| [`packages/react-pixi-fiber`](./packages/react-pixi-fiber) | `react-pixi-fiber`, the core with the components, `Stage` and `configure` |
| [`apps/examples`](./apps/examples) | Examples built with Vite that use the local packages |

The repository is a [pnpm](https://pnpm.io) workspace. The pnpm version is pinned in the `packageManager` field of `package.json`, and Node comes from `.nvmrc`.

## Development

Run these in the repository root:

```sh
pnpm install        # install every workspace package
pnpm build          # build every package, the examples load the built files
pnpm test           # run the tests of every package
pnpm lint           # check formatting and lint with Biome
pnpm format         # apply Biome formatting and safe fixes
pnpm check-types    # typecheck every package, the TypeScript fixture, the examples and the scripts (after pnpm build)
pnpm check-package  # pack every package and check what Node and esbuild resolve (after pnpm build)
pnpm start          # start the examples dev server
```

Rebuild the packages after changing their source before running or typechecking the examples.

## Hosted examples

[Cloudflare Pages](https://pages.cloudflare.com) builds the examples from this repository with `pnpm build && pnpm --filter examples build` and serves `apps/examples/dist`. Pushes to `master` deploy to https://react-pixi-fiber.pages.dev, and every pull request gets a preview URL, posted as a comment on the pull request.

## Contributing

See the [Contributing Guide](./CONTRIBUTING.md), the [Code of Conduct](./CODE_OF_CONDUCT.md) and the [changelog](./packages/react-pixi-fiber/CHANGELOG.md).

## License

[MIT](./LICENSE)
