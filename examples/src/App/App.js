import React from "react";
import logo from "../logo.svg";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import ExampleList from "../ExampleList";
import AnimatedExample from "../AnimatedExample";
import BunnyExample from "../BunnyExample";
import BunnymarkExample from "../BunnymarkExample";
import CanvasPropsExample from "../CanvasPropsExample";
import ClickExample from "../ClickExample";
import CustomApplicationExample from "../CustomApplicationExample";
import CustomBunnymarkExample from "../CustomBunnymarkExample";
import CustomPIXIComponentExample from "../CustomPIXIComponentExample";
import CustomPIXIPropertyExample from "../CustomPIXIPropertyExample";
import HooksExample from "../HooksExample";
import LayersExample from "../LayersExample";
import PointsExample from "../PointsExample/PointsExample";
import SmokeTest from "../SmokeTest";
import SuspenseExample from "../SuspenseExample";
import Stats from "../Stats";

const examples = [
  {
    name: "Animated",
    slug: "animated",
    component: AnimatedExample,
  },
  {
    name: "Bunny",
    slug: "bunny",
    component: BunnyExample,
  },
  {
    name: "Bunnymark",
    slug: "bunnymark",
    component: BunnymarkExample,
  },
  {
    name: "Bunnymark (using custom components)",
    slug: "custombunnymark",
    component: CustomBunnymarkExample,
  },
  {
    name: "Canvas Props",
    slug: "canvasprops",
    component: CanvasPropsExample,
  },
  {
    name: "Click",
    slug: "click",
    component: ClickExample,
  },
  {
    name: "CustomApplication",
    slug: "customapplication",
    component: CustomApplicationExample,
  },
  {
    name: "CustomPIXIComponent",
    slug: "custompixicomponent",
    component: CustomPIXIComponentExample,
  },
  {
    name: "CustomPIXIProperty",
    slug: "custompixiproperty",
    component: CustomPIXIPropertyExample,
  },
  {
    name: "Hooks",
    slug: "hooks",
    component: HooksExample,
  },
  {
    name: "Layers",
    slug: "layers",
    component: LayersExample,
  },
  {
    name: "Point-like props",
    slug: "points",
    component: PointsExample,
  },
  {
    name: "Suspense",
    slug: "suspense",
    component: SuspenseExample,
  },
  {
    name: "Smoke Test",
    slug: "smoketest",
    component: SmokeTest,
  },
];

function App() {
  return (
    <div className="App">
      <Stats />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">react-pixi-fiber Examples</h1>
      </header>
      <div className="App-intro">
        <Switch>
          <Route exact path="/" render={props => <ExampleList {...props} examples={examples} />} />
          {examples.map(example => (
            <Route key={example.slug} exact path={`/${example.slug}`} component={example.component} />
          ))}
        </Switch>
      </div>
    </div>
  );
}

export default App;
