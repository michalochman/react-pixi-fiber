# 0017. Keep a Shared Canvas Context When an Application Is Destroyed

**Status:** accepted
**Date:** 2026-09-29

## Context

A `Stage` can destroy a PixiJS application and create the next one on the same canvas. This happens in three cases:

- the development double mount of `<StrictMode>`
- a change of `options` that recreates the application on an external canvas (`options.view` or `options.canvas`)
- a `Stage` that `<Suspense>` or `<Activity>` hides and then shows again

A canvas has one WebGL context, so both applications use it. When PixiJS destroys a WebGL renderer, every supported PixiJS major forces the loss of that context. Some PixiJS majors never restore a lost context for an application that is still running. Some majors also do not restore it for a new application that starts on a canvas with a lost context. In these cases the surviving application draws nothing for the rest of the session.

## Decision Drivers

- A `Stage` must keep drawing after the development double mount, a recreate, and a hide and show
- A real unmount must still release the context, so the browser can reuse it
- The fix must not change the adapter contract of the core (see [0012](0012-describe-each-pixijs-major-as-adapter-data.md))
- The fix must work on every supported PixiJS major, each with its own destroy code

## Decision

The `destroyApplication` function of each PixiJS adapter checks `canvas.isConnected`. When the canvas is still in the document, the adapter keeps the WebGL context. It then lets PixiJS destroy everything else as usual. When the canvas is no longer in the document, the adapter lets PixiJS lose the context.

How the adapter keeps the context depends on the PixiJS major. On majors that read the lose-context extension from the renderer, the adapter removes that extension from the renderer before the destroy. Other majors read the extension from the shared context. There, the adapter hides the extension from that one destroy call, and then restores the original lookup.

The core destroys an application that became outdated during its initialization only after React removed the old canvas. So the adapter reads the true `isConnected` value.

A `Stage` creates its next application only after the destroy of the previous one is complete. A destroy resets state of the shared context, for example the current shader program. A renderer keeps a copy of that state and does not set it again. When the destroy comes after the next application starts, that application draws with no shader program on every frame.

On a real unmount of a `Stage` with its own canvas, React removes the canvas first, so the adapter releases the context. An external canvas that stays in the document keeps its context after the unmount.

## Considered Alternatives

### A `keepContext` flag from the core

The core would track the live applications for each canvas and tell the adapter whether to keep the context. This is exact for the double mount and the recreate. But the core cannot know, at destroy time, whether a hidden `Stage` will show again on the same canvas. The flag would also change the adapter contract.

### Restore the context after the destroy

The adapter would call `restoreContext()` after PixiJS lost the context. But the restore is asynchronous. The surviving application would upload all its resources again, and the canvas would flicker on every development mount.

### Keep the context only in the adapters that need it most

Only the PixiJS majors that never restore a lost context would get the guard. But every supported major loses the context of a running application on destroy. The majors that do restore it still flicker.

## Consequences

- A `Stage` keeps drawing after the development double mount, a recreate, and a hide and show, on every supported PixiJS major. But each adapter has its own copy of the guard, written for its PixiJS major.
- A real unmount of a `Stage` with its own canvas still releases the context. But an external canvas that stays in the document keeps its context until the consumer removes the canvas. Version 2.x lost the context in this case.
- The next application starts one task later, after the destroy of the previous one. This applies to the development double mount, a recreate, and a hide and show.
- An external canvas that was never in the document still loses its context on a recreate. Covering that case needs a change of the adapter contract.
- jsdom has no WebGL context loss, so only a manual browser check proves this behavior (see [0004](0004-test-each-package-with-its-own-react-and-pixijs.md))
