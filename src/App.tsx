import React from "react";
import ConsistentHashingDemo from "./ConsistentHashingDemo";

export default function App() {
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h1>Consistent Hashing Demo</h1>
      <p>
        Description ...
        <br />
        the problem
        <br />
        the general idea
      </p>
      <ConsistentHashingDemo />
      <h2>TODOs</h2>
      <ul>
        <li>prevent unnecessary re-renders</li>
        <li>
          introduce key threshhold to prevent rendering of lots of keys which could anyway
          not be distinguished from each other
        </li>
        <li>provide toggle for having virtual server nodes (or not)</li>
        <li>visualize start/end of the hash space</li>
        <li>try population of several million keys (being more realistic)</li>
        <li>
          make mobile usable: double click instead of click to remove key/server; single
          click selects item so that we can highlight
        </li>
        <li>improve layout: server and key lists should scroll vertically on overflow</li>
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
