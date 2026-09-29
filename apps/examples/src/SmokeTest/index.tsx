import { Fragment, useCallback, useState } from "react";
import { Stage } from "react-pixi-fiber";
import RotatingBunny from "../RotatingBunny";

const COLORS = [0x1099bb, 0x10bb99];
const SIZES = [
  { width: 400, height: 300 },
  { width: 300, height: 400 },
];

function SmokeTestExample() {
  const [color, setColor] = useState(0);
  const [count, setCount] = useState(0);
  const [mount, setMount] = useState(false);
  const [size, setSize] = useState(0);

  const addBunny = useCallback(() => {
    setCount(count => Math.min(5, count + 1));
  }, []);

  const removeBunny = useCallback(() => {
    setCount(count => Math.min(5, count - 1));
  }, []);

  const toggleBackground = useCallback(() => {
    setColor(color => (color ? 0 : 1));
  }, []);

  const toggleSize = useCallback(() => {
    setSize(size => (size ? 0 : 1));
  }, []);

  const toggleStage = useCallback(() => {
    setMount(mount => !mount);
  }, []);

  const backgroundColor = COLORS[color];
  const { width, height } = SIZES[size];

  return (
    <Fragment>
      <table style={{ margin: "0 auto 1.5em", textAlign: "left" }}>
        <tbody>
          <tr>
            <td>Stage mounted: {mount ? "yes" : "no"}</td>
            <td>
              <button onClick={toggleStage}>toggle Stage</button>
            </td>
          </tr>
          <tr>
            <td>
              Size: {SIZES[size].width}x{SIZES[size].height}
            </td>
            <td>
              <button onClick={toggleSize}>toggle size</button>
            </td>
          </tr>
          <tr>
            <td>Background: #{COLORS[color].toString(16)}</td>
            <td>
              <button onClick={toggleBackground}>toggle background</button>
            </td>
          </tr>
          <tr>
            <td>Bunnies: {count}</td>
            <td>
              <button disabled={count === 5} onClick={addBunny}>
                add bunny
              </button>
              <button disabled={count === 0} onClick={removeBunny}>
                remove bunny
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {mount && (
        <Stage options={{ backgroundColor, height, width }}>
          {count > 0 && <RotatingBunny x={width / 2} y={height / 2} texture={0} step={0.1} />}
          {count > 1 && <RotatingBunny x={width / 4} y={height / 4} texture={1} step={0.2} />}
          {count > 2 && <RotatingBunny x={width / 4} y={(3 * height) / 4} texture={2} step={-0.25} />}
          {count > 3 && <RotatingBunny x={(3 * width) / 4} y={height / 4} texture={3} step={-0.1} />}
          {count > 4 && <RotatingBunny x={(3 * width) / 4} y={(3 * height) / 4} texture={4} step={-0.02} />}
        </Stage>
      )}
    </Fragment>
  );
}

export default SmokeTestExample;
