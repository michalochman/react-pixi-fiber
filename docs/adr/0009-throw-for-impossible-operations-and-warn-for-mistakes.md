# 0009. Throw for Impossible Operations and Warn for Mistakes

**Status:** accepted
**Date:** 2026-09-26

## Context

The library reports two kinds of problems. Some problems make the requested operation impossible, for example a missing `configure` call or a component without a `create` function. Other problems do not stop the operation but are probably mistakes, for example a miscased prop name or a deprecated tag. React has the same split: it throws for impossible operations and prints development warnings for probable mistakes. Consumers expect the same behavior from a React renderer. Development warnings must not run in production (see [0002](0002-build-every-package-with-tsdown.md)).

## Decision Drivers

- An impossible operation must stop at the call that caused it, with a message that says how to fix it
- A probable mistake must not break a running application
- A warning must not repeat on every render, or consumers stop reading it
- Production builds must not print warnings or run their checks
- Teardown must complete, because a throw inside a React cleanup stops the rest of that cleanup

## Decision

The core has two helpers:

- `invariant(condition, message, ...args)` throws an `Error` with the name `Invariant Violation` when the condition is false. The message can contain `%s` placeholders.
- `warning(condition, message, ...args)` prints `Warning: <message>` with `console.error` when the condition is false.

The rules:

1. **Throw** with `invariant` when the operation cannot continue. The message names the wrong value and the expected usage. An example is the message for a missing `configure` call, which prints the three lines of setup code.
2. **Warn** with `warning` when the operation can continue. A warning runs only in development: inside an `if (__DEV__)` block, or behind a value that only development code sets. The production build removes most warning code, and never runs the rest.
3. **Warn once** for each key: once for each deprecated name, once for each prop name, or once for each `Stage`. A `Set` or a flag records which keys already printed.
4. **Check props only in development**, and only inside `<StrictMode>`, as React does for its own development checks.
5. **Never throw during teardown.** `unmount` returns `true` after it unmounts a container, also when the container is already unmounted. It returns `false` for a container that it never rendered into. In development, it also prints a warning. This is the behavior of `unmountComponentAtNode` in react-dom.
6. **Report asynchronous failures to React.** The application of a `Stage` can fail to initialize. `Stage` then throws the error during its next render, so the nearest error boundary receives it.

## Considered Alternatives

### Throw for every problem

A throw is impossible to miss. But one miscased prop or one deprecated name would then break a running application. React does not throw for these problems, so consumers would not expect it.

### Warn in production too

Production users would see the same warnings as developers. But the messages would make every production bundle larger. The checks would also run on every prop write.

### A logging interface that consumers configure

Consumers could send warnings to their own logger. But this adds public API and configuration for a small benefit. `console.error` is where React prints its own warnings, and test tools already capture it.

## Consequences

- An impossible operation fails at the source, with a message that shows the fix. But the consumer sees the error only when the code path runs.
- Warnings never run in production, but a consumer who tests only production builds never sees them
- Each warning prints once, so the console stays readable, but a second mistake with the same key prints nothing more
- `unmount` never throws, so teardown always completes, but an `unmount` of the wrong container fails quietly in production
- Each new check needs a decision between `invariant` and `warning`, based on the rules above
