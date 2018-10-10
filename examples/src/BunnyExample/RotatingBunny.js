import React, { Component } from "react";
import PropTypes from "prop-types";
import { withApp } from "react-pixi-fiber";
import Bunny from "../Bunny";

// http://pixijs.io/examples/#/basics/basic.js
class RotatingBunny extends Component {
  state = {
    rotation: 0,
  };

  componentDidMount() {
    this.props.app.ticker.add(this.animate);
  }

  componentWillUnmount() {
    this.props.app.ticker.remove(this.animate);
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
RotatingBunny.propTypes = {
  app: PropTypes.object.isRequired,
};

export default withApp(RotatingBunny);
