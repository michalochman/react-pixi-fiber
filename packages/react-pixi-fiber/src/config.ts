import type { PixiAdapter } from "./types";
import builtins from "./builtins";
import { registerAdapterComponents } from "./registry";

// Phase 1 shim: the in-core PixiJS 6 adapter. Task 11 replaces this with the configured adapter.
registerAdapterComponents(builtins.components);
export function getPixiAdapter(): PixiAdapter {
  return builtins;
}

// Phase 1 shim for React 18. Task 11 reads it from the configured React adapter.
export function getStrictModeBit(): number {
  return 8;
}
