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
      rotation: state.rotation + this.props.step * delta,
    }));
  };

  render() {
    // we don't want to pass app prop further down, it will trigger dev warning
    const { app, step, ...passedProps } = this.props;

    return <Bunny {...passedProps} rotation={this.state.rotation} />;
  }
}
RotatingBunny.propTypes = {
  app: PropTypes.object.isRequired,
  step: PropTypes.number,
};
RotatingBunny.defaultProps = {
  step: 0.1,
};

export default withApp(RotatingBunny);
