import ReactDOM from "react-dom/client";
import App from "./App/App";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
