import React from "react";
import ReactDOM from "react-dom";
import Demo2 from "./Demo2";
import Demo3 from "./Demo3";
import Demo4 from "./Demo4";

ReactDOM.render(
  <React.StrictMode>
    <Demo2 initialNodes={["node-11", "node-13", "node-21"]} />
    <Demo3 initialNodes={["node-11", "node-13", "node-21"]} />
    <Demo4
      initialNodes={[
        "node-11",
        "node-13",
        "node-21",
        "node-42",
        "node-92",
        "node-15",
        "node-16",
        "node-77",
        "node-46",
      ]}
    />
  </React.StrictMode>,
  document.getElementById("root")
);
