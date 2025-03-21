# Contributing

## Open Development

All work on React Pixi Fiber happens directly on [GitHub](https://github.com/michalochman/react-pixi-fiber). Both core team members and external contributors send pull requests which go through the same review process.


## Branch Organization

We will do our best to keep the [`master` branch](https://github.com/michalochman/react-pixi-fiber/tree/master) in good shape, with tests passing at all times. But in order to move fast, we will make API changes that your application might not be compatible with. We recommend that you use [the latest stable version of React](https://reactjs.org/downloads.html).

If you send a pull request, please do it against the `master` branch.


## Semantic Versioning

React Pixi Fiber follows [semantic versioning](http://semver.org/). We release patch versions for bugfixes, minor versions for new features, and major versions for any breaking changes. When we make breaking changes, we also introduce deprecation warnings in a minor version so that our users learn about the upcoming changes and migrate their code in advance.


## Changelog

Every significant change is documented in the [changelog file](https://github.com/michalochman/react-pixi-fiber/blob/master/CHANGELOG.md).


## Bugs

We are using [GitHub Issues](https://github.com/michalochman/react-pixi-fiber/issues) for our public bugs. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn't already exist.


## Proposing a Change

If you intend to change the public API, or make any non-trivial changes to the implementation, we recommend [filing an issue](https://github.com/michalochman/react-pixi-fiber/issues/new). This lets us reach an agreement on your proposal before you put significant effort into it.

If you're only fixing a bug, it's fine to submit a pull request right away but we still recommend to file an issue detailing what you're fixing. This is helpful in case we don't accept that specific fix but want to keep track of the issue.


## Sending a Pull Request

The core team is monitoring for pull requests. We will review your pull request and either merge it, request changes to it, or close it with an explanation.

**Before submitting a pull request**, please make sure the following is done:

1. Fork [the repository](https://github.com/michalochman/react-pixi-fiber) and create your branch from `master`.
2. Run `npm install` in the repository root.
3. If you've fixed a bug or added code that should be tested, add tests!
4. Ensure the test suite passes (`npm run test`). Tip: `npm run test --watch TestName` is helpful in development.
5. Format your code with [prettier](https://github.com/prettier/prettier) (`npm run prettier`).
6. Make sure your code lints (`npm run eslint`).

## Style Guide

We use an automatic code formatter called [Prettier](https://prettier.io/). Run `npm run prettier` after making any changes to the code.

Then, our linter will catch most issues that may exist in your code. You can check the status of your code styling by simply running `npm run eslint`.

However, there are still some styles that the linter cannot pick up. If you are unsure about something, looking at [Airbnb's Style Guide](https://github.com/airbnb/javascript) will guide you in the right direction.


## License

By contributing to React Pixi Fiber, you agree that your contributions will be licensed under its MIT license.
