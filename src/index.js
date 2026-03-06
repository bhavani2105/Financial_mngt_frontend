import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
console.log("Hello, FinWise v2!");
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Button variant="contained" color="primary">
      Hello World
    </Button>
  </React.StrictMode>,
);
