import { Component } from "react";
import StatsJS from "stats.js/src/Stats";

class Stats extends Component {
  componentDidMount() {
    this.stats = new StatsJS();
    document.body.appendChild(this.stats.domElement);

    const update = () => {
      this.stats.update();
      this.rafId = window.requestAnimationFrame(update);
    };
    update();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafId);
    document.body.removeChild(this.stats.domElement);
  }

  render() {
    return null;
  }
}

export default Stats;
