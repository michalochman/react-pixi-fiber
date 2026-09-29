import React, { createContext, useContext } from "react";
import type { ComponentType, ReactNode } from "react";
import type * as PIXI from "pixi.js";

export const AppContext = createContext<PIXI.Application | null>(null);

export function AppProvider({ app, children }: { app: PIXI.Application; children?: ReactNode }) {
  return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
}

export function withApp<P extends { app: PIXI.Application }>(WrappedComponent: ComponentType<P>) {
  function WithApp(props: Omit<P, "app">) {
    const app = useContext(AppContext);
    return <WrappedComponent {...(props as P)} app={app} />;
  }
  WithApp.displayName = `withApp(${WrappedComponent.displayName || WrappedComponent.name || "Component"})`;
  return WithApp;
}
