# CHANGELOG
-----------

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

### Added
- Expose `applyProps` from `ReactPixiFiber` ([#95])
- Added example of "native" Animated target for `react-pixi-fiber` ([#95])

### Fixed
- Fixed `customDidAttach` of example `<DraggableContainer />` component ([#91])


## [0.7.0] - 2018-12-27

### Added
- Added unstable_batchedUpdates API ([#89])


## [0.6.2] - 2018-11-14

### Fixed
- Fixed PixiJS event props not being passed to `<Stage />` component ([#85])


## [0.6.1] - 2018-11-10

### Fixed
- Fixed context not passed through from primary renderer (`react-dom`) into `react-pixi-fiber` ([#84])


## [0.6.0] - 2018-11-10

### Fixed
- Fixed React 16.6.0 compatibility ([#83])


## [0.5.1] - 2018-11-02

### Added
- Added AppContext to type definition ([#81])

### Fixed
- Fix render function type definition ([#76])


## [0.5.0] - 2018-10-10

### Added
- Added support for New Context API ([#72])

### Fixed
- Fixed React 16.5.0 compatibility ([#71])


## [0.4.9] - 2018-07-09

### Changed
- Changed `defaultApplyProps` to wrap console warnings in dev flag ([#67]) 


## [0.4.8] - 2018-06-25

### Changed
- Updated `react-reconciler` to `0.12.0` ([#65])

### Fixed
- Removed namespace from Typescript definition ([#64])


## [0.4.7] - 2018-06-10

### Changed
- Changed `<Stage />` to support `width` and `height` passed in `options` prop ([#60])

### Fixed
- Fixed TypeScript definitions to support TypeScript 2.9 ([#58])
- Fixed memory leak when mounting/unmounting `<Stage />` ([#61])


## [0.4.6] - 2018-05-22

### Fixed
- Fixed TypeScript definitions ([#54])


## [0.4.5] - 2018-05-18

### Changed
- Updated `react-reconciler` to `0.10.0` ([#53])


## [0.4.4] - 2018-05-09

### Fixed
- Fixed cjs build of react-pixi-alias


## [0.4.3] - 2018-03-28

### Fixed
- Fixed entry point to load module by env 
- Fixed `commitUpdate` for `CustomPIXIComponents` ([#44])


## [0.4.2] - 2018-03-27

### Fixed
- Fixed cjs build


## [0.4.1] - 2018-03-27 [YANKED]

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


[Unreleased]: https://github.com/michalochman/react-pixi-fiber/compare/v0.7.0...HEAD
[0.7.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.6.2...v0.7.0
[0.6.2]: https://github.com/michalochman/react-pixi-fiber/compare/v0.6.1...v0.6.2
[0.6.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.9...v0.5.0
[0.4.9]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.8...v0.4.9
[0.4.8]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.7...v0.4.8
[0.4.7]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.6...v0.4.7
[0.4.6]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.5...v0.4.6
[0.4.5]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.4...v0.4.5
[0.4.4]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.3...v0.4.4
[0.4.3]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.2...v0.4.3
[0.4.2]: https://github.com/michalochman/react-pixi-fiber/compare/v0.4.1...v0.4.2
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

[#91]: https://github.com/michalochman/react-pixi-fiber/issues/91
[#89]: https://github.com/michalochman/react-pixi-fiber/pull/89
[#85]: https://github.com/michalochman/react-pixi-fiber/issues/85
[#84]: https://github.com/michalochman/react-pixi-fiber/pull/84
[#83]: https://github.com/michalochman/react-pixi-fiber/pull/83
[#81]: https://github.com/michalochman/react-pixi-fiber/issues/81
[#76]: https://github.com/michalochman/react-pixi-fiber/pull/76
[#72]: https://github.com/michalochman/react-pixi-fiber/pull/72
[#71]: https://github.com/michalochman/react-pixi-fiber/issues/71
[#67]: https://github.com/michalochman/react-pixi-fiber/pull/67
[#65]: https://github.com/michalochman/react-pixi-fiber/pull/65
[#64]: https://github.com/michalochman/react-pixi-fiber/pull/64
[#61]: https://github.com/michalochman/react-pixi-fiber/pull/61
[#60]: https://github.com/michalochman/react-pixi-fiber/pull/60
[#58]: https://github.com/michalochman/react-pixi-fiber/issues/58
[#54]: https://github.com/michalochman/react-pixi-fiber/issues/54
[#53]: https://github.com/michalochman/react-pixi-fiber/pull/53
[#44]: https://github.com/michalochman/react-pixi-fiber/issues/44
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
