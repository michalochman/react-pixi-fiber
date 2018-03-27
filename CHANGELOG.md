# CHANGELOG
-----------

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]


## [0.4.1] - 2018-03-27

### Added
- Added unit tests ([#6])

### Changed
- Changed bundler from babel-cli to Rollup

### Fixed
- Fixed `prepareUpdate` to return diff of props ([#43])


## [0.4.0] - 2018-02-28

### Fixed
- Fixed DisplayObject members passed to Stage as props not being applied to root Container ([#38])


## [0.3.1] - 2018-02-25

### Fixed
- Fixed PropTypes warning in Stage ([#34])
- Added `react-pixi-alias.js` file to distributed package `files` list ([#37])


## [0.3.0] - 2018-02-15

### Added
- Added parser for PIXI.Point-like props - Point-like DisplayObject members can now be assigned using string, number, array and Point/ObservablePoint ([#19])
- Added support for custom components using `react-pixi` API ([#19])

### Changed
- Changed `<Stage />` to pass `options` prop to `PIXI.Application` ([#28])
- Changed `<Stage />` to pass not consumed props to rendered canvas ([#29])
- Changed `<Stage />` to resize renderer when dimensions are changed ([#30])
- Changed inconsistent usage of reconciler config functions to use regular functions instead of anonymous arrow functions
- Changed `PIXI.DisplayObject` members handling when passed as props - `undefined` values will now be replaced with default values if default defined

### Fixed
- Fixed deprecated usage of `PIXI.BitmapText` to `PIXI.extras.BitmapText`

### Removed
- Removed `backgroundColor` prop from `<Stage />` ([#28])


## [0.2.5] - 2018-02-11

### Added
- Added back removed `useSyncScheduling` option ([#15])

### Fixed
- Added `index.d.ts` file to distributed package `files` list ([#4], [#8])


## [0.2.4] - 2018-02-07 [YANKED]

### Removed
- Removed deprecated `useSyncScheduling` option ([#15])


## [0.2.3] - 2018-02-06

### Added
- Added an alias for "easy" migration from [`react-pixi`](https://github.com/Izzimach/react-pixi) ([#9])
- Added TypeScript definitions ([#8])


## [0.2.2] - 2018-01-17

### Fixed
- Fixed distributed cjs files by using `transform-es2015-modules-commonjs` with `babel` ([#4])


## [0.2.1] - 2018-01-17

### Added
- Added `<ParticleContainer />` component
- Added development build script
- Added `files` to `package.json`


## [0.2.0] - 2018-01-05

### Added
- Added standalone `render` function ([#2])


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

[Unreleased]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.3.1...v0.4.0
[0.3.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.5...v0.3.0
[0.2.5]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.1.0...v0.1.1

[#43]: https://github.com/michalochman/react-pixi-fiber/issues/43
[#38]: https://github.com/michalochman/react-pixi-fiber/issues/38
[#37]: https://github.com/michalochman/react-pixi-fiber/pull/37
[#34]: https://github.com/michalochman/react-pixi-fiber/pull/34
[#30]: https://github.com/michalochman/react-pixi-fiber/pull/31
[#29]: https://github.com/michalochman/react-pixi-fiber/issues/29
[#28]: https://github.com/michalochman/react-pixi-fiber/issues/28
[#19]: https://github.com/michalochman/react-pixi-fiber/issues/19
[#15]: https://github.com/michalochman/react-pixi-fiber/issues/15
[#9]: https://github.com/michalochman/react-pixi-fiber/issues/9
[#8]: https://github.com/michalochman/react-pixi-fiber/issues/8
[#6]: https://github.com/michalochman/react-pixi-fiber/issues/6
[#4]: https://github.com/michalochman/react-pixi-fiber/issues/4
[#2]: https://github.com/michalochman/react-pixi-fiber/issues/2
