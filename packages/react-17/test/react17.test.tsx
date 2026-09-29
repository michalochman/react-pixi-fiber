import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { StrictMode } from "react";
import react17, { strictModeBit } from "../src/index";
import type { HostOps } from "react-pixi-fiber";

// Wraps the real reconciler so a test can see what reaches updateContainer.
const { createContainer, updateContainer } = vi.hoisted(() => ({ createContainer: vi.fn(), updateContainer: vi.fn() }));
vi.mock("react-reconciler", async importOriginal => {
  const Reconciler = ((await importOriginal()) as any).default;
  return {
    default: (config: unknown) => {
      const reconciler = Reconciler(config);
      updateContainer.mockImplementation(reconciler.updateContainer);
      createContainer.mockImplementation(reconciler.createContainer);
      return { ...reconciler, createContainer, updateContainer };
    },
  };
});

// A host tree of plain objects; enough to prove the reconciler is wired to hostOps.
function createFakeHostOps() {
  const validate = vi.fn();
  const ops: HostOps = {
    createInstance: (type, props) => ({ type, props, children: [] as any[], visible: true }),
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
    commitNewChildToFragmentInstance: () => {},
    createFragmentInstance: () => ({ children: [], getBounds: () => [], off: () => {}, on: () => {} }),
    deleteChildFromFragmentInstance: () => {},
  };
  return { ops, validate };
}

// JSX host tags the fake host tree understands.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      node: any;
      leaf: any;
    }
  }
}

describe("react17", () => {
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
    createContainer.mockClear();
    updateContainer.mockClear();
  });

  it("exports the StrictMode bit for React 17", () => {
    expect(strictModeBit).toBe(1);
    expect(react17().strictModeBit).toBe(1);
  });

  it("renders synchronously into the container through hostOps", () => {
    const { ops } = createFakeHostOps();
    const renderer = react17().createRenderer(ops, { isPrimaryRenderer: true });
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

  it("creates a legacy root", () => {
    const { ops } = createFakeHostOps();
    const container = { children: [] as any[] };
    react17()
      .createRenderer(ops, { isPrimaryRenderer: true })
      .render(<node />, container);
    expect(createContainer).toHaveBeenCalledWith(container, 0, false, null);
  });

  it("passes the callback and parentComponent to updateContainer", () => {
    const { ops } = createFakeHostOps();
    const renderer = react17().createRenderer(ops, { isPrimaryRenderer: true });
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
    expect(updateContainer).toHaveBeenCalledWith(element, expect.anything(), parentComponent, callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("forgets the root on unmount, so a second unmount throws and a new render starts a new root", () => {
    const { ops } = createFakeHostOps();
    const renderer = react17().createRenderer(ops, { isPrimaryRenderer: true });
    const container = { children: [] as any[] };
    renderer.render(<node />, container);
    renderer.unmount(container);
    expect(() => renderer.unmount(container)).toThrow("ReactPixiFiber did not render into container provided");
    renderer.render(<node x={3} />, container);
    expect(container.children).toHaveLength(1);
    expect(container.children[0].props.x).toBe(3);
  });

  it("throws when unmounting a container it never rendered into", () => {
    const { ops } = createFakeHostOps();
    const renderer = react17().createRenderer(ops, { isPrimaryRenderer: true });
    expect(() => renderer.unmount({ children: [] })).toThrow("ReactPixiFiber did not render into container provided");
    expect(updateContainer).not.toHaveBeenCalled();
  });

  it("injects into DevTools once per root container", () => {
    const { ops } = createFakeHostOps();
    const renderer = react17().createRenderer(ops, { isPrimaryRenderer: false });
    const container = { children: [] as any[] };
    renderer.render(<node />, container);
    renderer.render(<node />, container);
    expect(hook.inject).toHaveBeenCalledTimes(1);
    expect(hook.inject.mock.calls[0][0]).toMatchObject({
      rendererPackageName: "react-pixi-fiber",
      version: React.version,
    });
  });

  it("validates props with the fiber so the core can find <StrictMode>", () => {
    const { ops, validate } = createFakeHostOps();
    const renderer = react17().createRenderer(ops, { isPrimaryRenderer: true });
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

  it("throws on text children", () => {
    const { ops } = createFakeHostOps();
    const renderer = react17().createRenderer(ops, { isPrimaryRenderer: true });
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderer.render(<node>text</node>, { children: [] })).toThrow(/text instances/);
    error.mockRestore();
  });
});
