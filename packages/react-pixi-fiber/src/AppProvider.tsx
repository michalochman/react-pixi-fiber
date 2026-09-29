import type * as PIXI from "pixi.js";
import React from "react";
import PropTypes from "prop-types";
import { isNewContextAvailable } from "./compat";
import type { PixiAppProperties } from "./types";

const propTypes = {
  app: PropTypes.object.isRequired,
  children: PropTypes.node,
};
const childContextTypes = {
  app: PropTypes.object,
};

type AppProviderProps = PixiAppProperties & { children?: React.ReactNode };

// `withApp` higher-order component that injects `app` property of `PIXI.Application` type to your component.
type WithApp = <P extends PixiAppProperties>(
  Component: React.ComponentType<P>
) => React.ComponentType<Omit<P, keyof PixiAppProperties>>;

let AppContext = null as unknown as React.Context<PIXI.Application>;

function createAppProvider() {
  if (isNewContextAvailable()) {
    // New Context API
    if (AppContext === null) {
      AppContext = React.createContext(null) as unknown as React.Context<PIXI.Application>;
    }

    class AppProvider extends React.Component<AppProviderProps> {
      declare static propTypes: typeof propTypes;

      render() {
        const { app, children } = this.props;
        return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
      }
    }

    AppProvider.propTypes = propTypes;

    const withApp: WithApp = WrappedComponent => {
      function WithApp(props: object) {
        return <AppContext.Consumer>{app => <WrappedComponent {...(props as any)} app={app} />}</AppContext.Consumer>;
      }
      WithApp.displayName = `withApp(${WrappedComponent})`;

      return WithApp;
    };

    return { AppProvider, withApp };
  } else {
    // Legacy Context API
    class AppProvider extends React.Component<AppProviderProps> {
      declare static propTypes: typeof propTypes;
      declare static childContextTypes: typeof childContextTypes;

      getChildContext() {
        return {
          app: this.props.app,
        };
      }

      render() {
        return this.props.children;
      }
    }

    AppProvider.propTypes = propTypes;
    AppProvider.childContextTypes = childContextTypes;

    const withApp: WithApp = WrappedComponent => {
      function WithApp(props: object, context: PixiAppProperties) {
        return <WrappedComponent {...(props as any)} app={context.app} />;
      }
      WithApp.displayName = `withApp(${WrappedComponent})`;
      WithApp.contextTypes = childContextTypes;

      return WithApp;
    };

    return { AppProvider, withApp };
  }
}

const { AppProvider, withApp } = createAppProvider() as unknown as {
  AppProvider: React.FunctionComponent<AppProviderProps>;
  withApp: WithApp;
};

export { AppContext, AppProvider, withApp };
