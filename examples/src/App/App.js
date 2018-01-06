import React, { Component } from "react";
import logo from "../logo.svg";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import ExampleList from "../ExampleList/ExampleList";
import BunnyExample from "../BunnyExample/BunnyExample";
import BunnymarkExample from "../BunnymarkExample/BunnymarkExample";
import ClickExample from "../ClickExample/ClickExample";

const examples = [
  {
    name: "Bunny",
    slug: "bunny",
    component: BunnyExample
  },
  {
    name: "Bunnymark",
    slug: "bunnymark",
    component: BunnymarkExample
  },
  {
    name: "Click",
    slug: "click",
    component: ClickExample
  }
];

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">react-pixi-fiber Examples</h1>
        </header>
        <div className="App-intro">
          <Switch>
            <Route
              exact
              path="/"
              render={props => <ExampleList {...props} examples={examples} />}
            />
            {examples.map(example => (
              <Route
                key={example.slug}
                exact
                path={`/${example.slug}`}
                component={example.component}
              />
            ))}
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
