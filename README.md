<div align="center">
  <img alt="ReactPixiFiber" src="./packages/react-pixi-fiber/react-pixi.svg" width="500" />
</div>

# react-pixi-fiber repository

This repository holds [`react-pixi-fiber`](./packages/react-pixi-fiber), a React Fiber renderer for [PixiJS](https://pixijs.com/), and its examples. Package documentation lives in the [package README](./packages/react-pixi-fiber/README.md).

## Layout

| Path | Contents |
| --- | --- |
| [`packages/react-pixi-fiber`](./packages/react-pixi-fiber) | The library published to npm |
| [`apps/examples`](./apps/examples) | Examples built with Vite that use the local package |

The repository is a [pnpm](https://pnpm.io) workspace. The pnpm version is pinned in the `packageManager` field of `package.json`, and Node comes from `.nvmrc`.

## Development

Run these in the repository root:

```sh
pnpm install        # install every workspace package
pnpm build          # build the library, the examples load the built files
pnpm test           # run the library tests
pnpm eslint         # lint the library source
pnpm check-types    # typecheck the TypeScript fixture and the examples against index.d.ts
pnpm check-package  # pack the library and check what Node and esbuild resolve (after pnpm build)
pnpm start          # start the examples dev server
```

Rebuild the library after changing its source before running or typechecking the examples.

## Contributing

See the [Contributing Guide](./CONTRIBUTING.md), the [Code of Conduct](./CODE_OF_CONDUCT.md) and the [changelog](./CHANGELOG.md).

## License

[MIT](./LICENSE)
