import React from "react";
import ReactDOM from "react-dom";
import Demo2 from "./Demo2";

ReactDOM.render(
  <React.StrictMode>
    <Demo2 virtualNodesCount={1} initialNodes={["node-11", "node-13", "node-21"]} />
  </React.StrictMode>,
  document.getElementById("root")
);
