import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { Fragment, StrictMode, ViewTransition, startTransition } from "react";
import react19, { strictModeBit } from "../src/index";
import type { HostOps } from "react-pixi-fiber";

// Wraps the real reconciler so a test can see what reaches updateContainerSync.
const { startViewTransitionSpies, updateContainerSync } = vi.hoisted(() => ({
  startViewTransitionSpies: [] as { mockRestore(): void; mock: { calls: unknown[][] } }[],
  updateContainerSync: vi.fn(),
}));
vi.mock("react-reconciler", async importOriginal => {
  const Reconciler = ((await importOriginal()) as any).default;
  return {
    default: (config: any) => {
      startViewTransitionSpies.push(vi.spyOn(config, "startViewTransition"));
      const reconciler = Reconciler(config);
      updateContainerSync.mockImplementation(reconciler.updateContainerSync);
      return { ...reconciler, updateContainerSync };
    },
  };
});

// A host tree of plain objects; enough to prove the reconciler is wired to hostOps.
function createFakeHostOps() {
  const validate = vi.fn();
  const ops: HostOps = {
    createInstance: (type, props) => ({
      type,
      props,
      children: [] as any[],
      visible: true,
    }),
    appendChild: (parent, child) => {
      parent.children.push(child);
    },
    insertBefore: (parent, child, before) => {
      parent.children.splice(parent.children.indexOf(before), 0, child);
    },
    removeChild: (parent, child) => {
      parent.children.splice(parent.children.indexOf(child), 1);
    },
    clearContainer: container => {
      container.children.length = 0;
    },
    hideInstance: instance => {
      instance.visible = false;
    },
    unhideInstance: instance => {
      instance.visible = true;
    },
    setInitialProperties: (type, instance, props) => {
      instance.props = props;
    },
    diffProperties: (type, instance, prev, next) => (prev.x === next.x ? null : ["x", next.x]),
    updateProperties: (type, instance, payload, prev, next) => {
      instance.props = next;
    },
    validateProperties: validate,
  };
  return { ops, validate };
}

// JSX host tags the fake host tree understands.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      node: any;
      leaf: any;
    }
  }
}

describe("react19", () => {
  let hook: { inject: ReturnType<typeof vi.fn> };
  beforeEach(() => {
    hook = {
      inject: vi.fn(() => 1),
      supportsFiber: true,
      onCommitFiberRoot() {},
      onCommitFiberUnmount() {},
      checkDCE() {},
    } as any;
    (globalThis as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = hook;
  });
  afterEach(() => {
    delete (globalThis as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
    updateContainerSync.mockClear();
  });

  it("exports the StrictMode bit for React 19", () => {
    expect(strictModeBit).toBe(8);
    expect(react19().strictModeBit).toBe(8);
  });

  it("renders synchronously into the container through hostOps", () => {
    const { ops } = createFakeHostOps();
    const renderer = react19().createRenderer(ops, { isPrimaryRenderer: true });
    const container = { children: [] as any[] };
    renderer.render(
      <node x={1}>
        <leaf />
      </node>,
      container
    );
    expect(container.children).toHaveLength(1);
    expect(container.children[0].type).toBe("node");
    expect(container.children[0].children[0].type).toBe("leaf");
    renderer.render(<node x={2} />, container);
    expect(container.children[0].props.x).toBe(2);
    expect(container.children[0].children).toHaveLength(0);
    renderer.unmount(container);
    expect(container.children).toHaveLength(0);
  });

  it("passes the callback and parentComponent to updateContainerSync", () => {
    const { ops } = createFakeHostOps();
    const renderer = react19().createRenderer(ops, { isPrimaryRenderer: true });
    // The reconciler reads legacy context from parentComponent, so it must be a mounted class instance.
    class Parent extends React.Component {
      render() {
        return <node />;
      }
    }
    const parent = React.createRef<Parent>();
    renderer.render(<Parent ref={parent} />, { children: [] });
    const parentComponent = parent.current;
    const element = <node />;
    const callback = vi.fn();
    renderer.render(element, { children: [] }, callback, parentComponent);
    expect(updateContainerSync).toHaveBeenCalledWith(element, expect.anything(), parentComponent, callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("throws when unmounting a container it never rendered into", () => {
    const { ops } = createFakeHostOps();
    const renderer = react19().createRenderer(ops, { isPrimaryRenderer: true });
    expect(() => renderer.unmount({ children: [] })).toThrow("ReactPixiFiber did not render into container provided");
    expect(updateContainerSync).not.toHaveBeenCalled();
  });

  it("injects into DevTools once per root container", () => {
    const { ops } = createFakeHostOps();
    const renderer = react19().createRenderer(ops, {
      isPrimaryRenderer: false,
    });
    const container = { children: [] as any[] };
    renderer.render(<node />, container);
    renderer.render(<node />, container);
    expect(hook.inject).toHaveBeenCalledTimes(1);
    expect(hook.inject.mock.calls[0][0]).toMatchObject({
      rendererPackageName: "react-pixi-fiber",
      version: React.version,
    });
  });

  it("commits synchronously on a concurrent root", () => {
    const { ops } = createFakeHostOps();
    const renderer = react19().createRenderer(ops, { isPrimaryRenderer: true });
    const container = { children: [] as any[] };
    renderer.render(<node />, container);
    // No act(), no await: the child is there when render() returns.
    expect(container.children).toHaveLength(1);
  });

  it("skips updateProperties when the diff finds no change", () => {
    const { ops } = createFakeHostOps();
    const updateProperties = vi.spyOn(ops, "updateProperties");
    const renderer = react19().createRenderer(ops, { isPrimaryRenderer: true });
    const container = { children: [] as any[] };
    renderer.render(<node x={1} />, container);
    renderer.render(<node x={1} />, container);
    expect(updateProperties).not.toHaveBeenCalled();
    renderer.render(<node x={2} />, container);
    expect(updateProperties).toHaveBeenCalledTimes(1);
  });

  it("renders and updates the children of a <ViewTransition> in a transition without animating", async () => {
    const { ops } = createFakeHostOps();
    const renderer = react19().createRenderer(ops, { isPrimaryRenderer: true });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const startViewTransition = startViewTransitionSpies[startViewTransitionSpies.length - 1];
    try {
      const container = { children: [] as any[] };
      let setX: (x: number) => void = () => {};
      const Scene = () => {
        const [x, setState] = React.useState(1);
        setX = setState;
        return (
          <ViewTransition>
            <node x={x} />
          </ViewTransition>
        );
      };
      renderer.render(<Scene />, container);
      expect(container.children[0].props.x).toBe(1);
      startTransition(() => setX(2));
      await vi.waitFor(() => expect(container.children[0].props.x).toBe(2));
      expect(startViewTransition.mock.calls.length).toBeGreaterThan(0);
      expect(error).not.toHaveBeenCalled();
    } finally {
      error.mockRestore();
      startViewTransition.mockRestore();
    }
  });

  it("reports a Fragment ref on the console instead of throwing", () => {
    const { ops } = createFakeHostOps();
    const renderer = react19().createRenderer(ops, { isPrimaryRenderer: true });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      renderer.render(
        <Fragment ref={() => {}}>
          <node x={1} />
        </Fragment>,
        { children: [] }
      );
      expect(error).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringMatching(/does not support Fragment refs/) })
      );
    } finally {
      error.mockRestore();
    }
  });

  it("validates props with the fiber so the core can find <StrictMode>", () => {
    const { ops, validate } = createFakeHostOps();
    const renderer = react19().createRenderer(ops, { isPrimaryRenderer: true });
    renderer.render(
      <StrictMode>
        <node x={1} />
      </StrictMode>,
      { children: [] }
    );
    if (__DEV__) {
      expect(validate).toHaveBeenCalledWith("node", { x: 1 }, expect.objectContaining({ mode: expect.any(Number) }));
      expect(validate.mock.calls[0][2].mode & strictModeBit).toBe(strictModeBit);
    } else {
      expect(validate).not.toHaveBeenCalled();
    }
  });

  it("reports text children on the console", () => {
    const { ops } = createFakeHostOps();
    const renderer = react19().createRenderer(ops, { isPrimaryRenderer: true });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    // An uncaught render error does not reach the caller of render(): the root reports it through onUncaughtError.
    renderer.render(<node>text</node>, { children: [] });
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expect.stringMatching(/text instances/),
      })
    );
    error.mockRestore();
  });
});
