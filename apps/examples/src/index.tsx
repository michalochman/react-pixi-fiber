import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { configure } from "react-pixi-fiber";
import react18 from "@react-pixi-fiber/react-18";
import pixi6 from "@react-pixi-fiber/pixi-6";
import App from "./App/App";
import "./index.css";

configure({ react: react18(), pixi: pixi6() });

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
