import React from "react";
import Demo2 from "./Demo2";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h1>Consistent Hashing Demo</h1>
      <Demo2 virtualNodesCount={1} initialNodes={["node-11", "node-13", "node-21"]} />
      <h2>TODOs</h2>
      <ul>
        <li>
          provide toggle for having virtual server nodes (or not) - or let user choose
          number of virtual server nodes
        </li>
        <li>visualize start/end of the hash space</li>
        <li>try population of several million keys (being more realistic)</li>
        <li>
          make mobile usable: double click instead of click to remove key/server; single
          click selects item so that we can highlight
        </li>
        <li>improve style: better text colors (see tachyons for example)</li>
      </ul>
      <h2>DONE</h2>
      <p>
        ✅ show hash ring with servers and keys
        <br />✅ add server
        <br />✅ remove server
        <br />✅ add key
        <br />✅ remove key
        <br />✅ reset, remove all servers and keys
        <br />✅ populate a big set of random keys
        <br />✅ on hovering a key highlight the corresponding hash ring position
        <br />✅ on hovering a server or key highlight the belonging hash space
        <br />✅ show stats: #servers, #keys, average keys/server
        <br />✅ on add/remove server: show keys reassigned (number, percent, range)
      </p>
    </div>
  );
}
