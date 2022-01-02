import React from "react";
import ReactDOM from "react-dom";
import Demo3 from "./Demo3";

ReactDOM.render(
  <React.StrictMode>
    <Demo3 initialNodes={["node-11", "node-13", "node-21"]} />
  </React.StrictMode>,
  document.getElementById("root")
);
