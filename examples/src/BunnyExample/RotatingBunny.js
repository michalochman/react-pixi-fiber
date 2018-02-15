import React, { Component } from "react";
import PropTypes from "prop-types";
import Bunny from "../Bunny";

// http://pixijs.io/examples/#/basics/basic.js
class RotatingBunny extends Component {
  state = {
    rotation: 0,
  };

  componentDidMount() {
    this.context.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.context.app.ticker.remove(this.animate);
  }

  animate = delta => {
    // just for fun, let's rotate mr rabbit a little
    // delta is 1 if running at 100% performance
    // creates frame-independent tranformation
    this.setState(state => ({
      ...state,
      rotation: state.rotation + 0.1 * delta,
    }));
  };

  render() {
    return <Bunny {...this.props} rotation={this.state.rotation} />;
  }
}
RotatingBunny.contextTypes = {
  app: PropTypes.object,
};

export default RotatingBunny;
