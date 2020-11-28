# CHANGELOG
-----------

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]


## [0.14.2] - 2020-11-28

### Fixed
- Fixed compatibility with React 17 and React.Suspense ([#196])


## [0.14.1] - 2020-07-13

### Fixed
- Fixed type compatibility with PixiJS v5.3.0 ([#185])


## [0.14.0] - 2020-04-04

### Added
- Added <NineSlicePlane /> component ([#176])

### Fixed
- Fixed applyProps type definition ([#176])
- Fixed `StagePropsWithOptions` type definition to work with both PixiJS v4 and v5 ([#180])
- Fixed `StageProps` type definition to include `Container` props and exclude width and height ([#182])


## [0.13.2] - 2020-02-17

### Fixed
- Fixed `Stage` not to resize renderer if app is provided in props ([#174])


## [0.13.1] - 2020-02-13

### Added
- Added exports for type of props for built-in components ([#170]) 


## [0.13.0] - 2020-02-03

### Added
- Added `style` prop to `BitmapText` type ([#166])

### Fixed
- Fixed type definitions to work with both PixiJS v4 and v5 ([#166])
- Fixed type definitions for properties of type `any` being replaced with `PointLike` ([#166])
- Fixed type definitions for built-in components to be able to use `ref`s ([#166])
- Fixed type definitions for `AppContext` which was exported as type, not as value ([#166])


## [0.12.3] - 2020-01-28

### Added
- Added missing type definitions ([#163])

### Fixed
- Fixed type definitions for `CustomPIXIComponents` ([#163])
- Fixed type definitions for `Stage` to be able to use `ref`s ([#165])


## [0.12.2] - 2020-01-20

### Added
- Added support for point like props ([#162])

### Changed
- Rewrote types definition


## [0.12.1] - 2019-12-26

### Fixed
- Fixed `ReactPixiFiber` to destroy child components when parent is removed from tree ([#157])


## [0.12.0] - 2019-11-23

### Added
- Added `app` prop to `Stage` ([#154])

### Deprecated
- Deprecated `width` and `height` props of `Stage` ([#153])


## [0.11.1] - 2019-10-25

- Fixed usage of Point copy/copyFrom in PixiJS v5 ([#149])


## [0.11.0] - 2019-10-22

- Expose `createStageClass` from `Stage` ([#147])
- Changed dev tools version reported to be `React` version instead of `ReactPixiFiber` version ([#148])


## [0.10.0] - 2019-10-18

- Improved hooks support ([#127])


## [0.9.3] - 2019-08-29

### Changed
- Changed `console.warn` calls into `fbjs/lib/warning` calls.

### Fixed
- Fixed setting default prop value when removing prop from instance ([#141])


## [0.9.2] - 2019-08-01

### Fixed
- Fixed type definition to include `withApp` ([#125])


## [0.9.1] - 2019-07-31

### Fixed
- Fixed renderer to be secondary when using `<Stage />` component


## [0.9.0] - 2019-07-01

### Added
- Added `scheduler`

### Changed
- Updated `react-reconciler` to `0.20.4` ([#122])

### Fixed
- Fixed PixiJS v5 compatibility issues ([#118])


## [0.8.2] - 2019-07-01

### Changed
- Changed `render` to inject into dev tools once per `containerTag`

### Fixed
- Fixed `setPixiValue` for Point values when using PixiJS v5 ([#120])


## [0.8.1] - 2019-05-29

### Fixed
- Fixed interactive elements type definition ([#109])

### Removed
- Removed `package.json` references from bundled code ([#112])


## [0.8.0] - 2019-02-24

### Added
- Expose `applyProps` from `ReactPixiFiber` ([#95])
- Added example of "native" Animated target for `react-pixi-fiber` ([#95])
- Added custom test environment for `jest` ([#97])

### Changed
- Replaced deprecated canvas-prebuilt development dependency by canvas ([#97])

### Fixed
- Fixed `customDidAttach` of example `<DraggableContainer />` component ([#91])
- Fixed `insertBefore` method of `ReactPixiFiber` ([#98])


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
- Fixed render function type definition ([#76])


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


[Unreleased]: https://github.com/michalochman/react-pixi-fiber/compare/v0.14.2...HEAD
[0.14.2]: https://github.com/michalochman/react-pixi-fiber/compare/v0.14.1...v0.14.2
[0.14.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.14.0...v0.14.1
[0.14.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.13.2...v0.14.0
[0.13.2]: https://github.com/michalochman/react-pixi-fiber/compare/v0.13.1...v0.13.2
[0.13.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.13.0...v0.13.1
[0.13.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.12.3...v0.13.0
[0.12.3]: https://github.com/michalochman/react-pixi-fiber/compare/v0.12.2...v0.12.3
[0.12.2]: https://github.com/michalochman/react-pixi-fiber/compare/v0.12.1...v0.12.2
[0.12.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.12.0...v0.12.1
[0.12.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.11.1...v0.12.0
[0.11.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.9.3...v0.10.0
[0.9.3]: https://github.com/michalochman/react-pixi-fiber/compare/v0.9.2...v0.9.3
[0.9.2]: https://github.com/michalochman/react-pixi-fiber/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.8.2...v0.9.0
[0.8.2]: https://github.com/michalochman/react-pixi-fiber/compare/v0.8.1...v0.8.2
[0.8.1]: https://github.com/michalochman/react-pixi-fiber/compare/v0.8.0...v0.8.1
[0.8.0]: https://github.com/michalochman/react-pixi-fiber/compare/v0.7.0...v0.8.0
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

[#196]: https://github.com/michalochman/react-pixi-fiber/issues/196
[#185]: https://github.com/michalochman/react-pixi-fiber/issues/185
[#182]: https://github.com/michalochman/react-pixi-fiber/pull/182
[#180]: https://github.com/michalochman/react-pixi-fiber/pull/180
[#174]: https://github.com/michalochman/react-pixi-fiber/pull/174
[#170]: https://github.com/michalochman/react-pixi-fiber/pull/170
[#166]: https://github.com/michalochman/react-pixi-fiber/pull/166
[#165]: https://github.com/michalochman/react-pixi-fiber/pull/165
[#163]: https://github.com/michalochman/react-pixi-fiber/pull/163
[#162]: https://github.com/michalochman/react-pixi-fiber/pull/162
[#157]: https://github.com/michalochman/react-pixi-fiber/pull/157
[#154]: https://github.com/michalochman/react-pixi-fiber/pull/154
[#153]: https://github.com/michalochman/react-pixi-fiber/pull/153
[#149]: https://github.com/michalochman/react-pixi-fiber/issues/149
[#148]: https://github.com/michalochman/react-pixi-fiber/pull/148
[#147]: https://github.com/michalochman/react-pixi-fiber/pull/147
[#141]: https://github.com/michalochman/react-pixi-fiber/pull/141
[#127]: https://github.com/michalochman/react-pixi-fiber/pull/127
[#125]: https://github.com/michalochman/react-pixi-fiber/issues/125
[#122]: https://github.com/michalochman/react-pixi-fiber/issues/122
[#120]: https://github.com/michalochman/react-pixi-fiber/issues/120
[#118]: https://github.com/michalochman/react-pixi-fiber/issues/118
[#112]: https://github.com/michalochman/react-pixi-fiber/pull/112
[#109]: https://github.com/michalochman/react-pixi-fiber/pull/109
[#98]: https://github.com/michalochman/react-pixi-fiber/pull/98
[#97]: https://github.com/michalochman/react-pixi-fiber/pull/97
[#95]: https://github.com/michalochman/react-pixi-fiber/pull/95
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
