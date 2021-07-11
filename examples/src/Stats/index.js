import { useLayoutEffect } from "react";
import StatsJS from "stats.js/src/Stats";

function Stats() {
  useLayoutEffect(() => {
    const stats = new StatsJS();
    document.body.appendChild(stats.domElement);

    let rafId;
    const update = () => {
      stats.update();
      rafId = window.requestAnimationFrame(update);
    };
    update();

    return function cleanup() {
      window.cancelAnimationFrame(rafId);
      document.body.removeChild(stats.domElement);
    };
  }, []);

  return null;
}

export default Stats;
