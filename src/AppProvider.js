import React from "react";
import PropTypes from "prop-types";

const propTypes = {
  app: PropTypes.object.isRequired,
  children: PropTypes.node,
};
const childContextTypes = {
  app: PropTypes.object,
};

let AppContext = null;

function createAppProvider() {
  if (typeof React.createContext === "function") {
    // New Context API
    if (AppContext === null) {
      AppContext = React.createContext(null);
    }

    class AppProvider extends React.Component {
      render() {
        const { app, children } = this.props;
        return <AppContext.Provider value={app}>{children}</AppContext.Provider>;
      }
    }

    AppProvider.propTypes = propTypes;

    const withApp = WrappedComponent => {
      function WithApp(props) {
        return <AppContext.Consumer>{app => <WrappedComponent {...props} app={app} />}</AppContext.Consumer>;
      }
      WithApp.displayName = `withApp(${WrappedComponent})`;

      return WithApp;
    };

    return { AppProvider, withApp };
  } else {
    // Legacy Context API
    class AppProvider extends React.Component {
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

    const withApp = WrappedComponent => {
      function WithApp(props, context) {
        return <WrappedComponent {...props} app={context.app} />;
      }
      WithApp.displayName = `withApp(${WrappedComponent})`;
      WithApp.contextTypes = childContextTypes;

      return WithApp;
    };

    return { AppProvider, withApp };
  }
}

const { AppProvider, withApp } = createAppProvider();

export { AppContext, AppProvider, withApp };
