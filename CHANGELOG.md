# CHANGELOG
-----------

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Changed
- Changed `<Stage />` to pass not consumed props to rendered canvas


## [0.2.5] - 2018-02-11

### Added
- Added back removed `useSyncScheduling` option

### Fixed
- Added `index.d.ts` file to distributed package `files` list


## [0.2.4] - 2018-02-07 [YANKED]

### Removed
- Removed deprecated `useSyncScheduling` option


## [0.2.3] - 2018-02-06

### Added
- Added an alias for "easy" migration from [`react-pixi`](https://github.com/Izzimach/react-pixi)
- Added TypeScript definitions


## [0.2.2] - 2018-01-17

### Fixed
- Fixed distributed cjs files by using `transform-es2015-modules-commonjs` with `babel`


## [0.2.1] - 2018-01-17

### Added
- Added `<ParticleContainer />` component
- Added development build script
- Added `files` to `package.json`


## [0.2.0] - 2018-01-05

### Added
- Added standalone `render` function


## [0.1.1] - 2018-01-05

### Fixed
- Added missing `performance-now` dependency


## 0.1.0 - 2018-01-05

### Added
- Added `ReactPixiFiber` renderer
- Added `<Stage />` component
- Added `<BitmapText />` component
- Added `<Container />` component
- Added `<Graphics />` component
- Added `<Sprite />` component
- Added `<Text />` component
- Added `<TilingSprite />` component

[Unreleased]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.5...HEAD
[0.2.5]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.1.0...v0.1.1
