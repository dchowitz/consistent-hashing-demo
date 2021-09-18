import React from "react";
import ConsistentHashingDemo from "./ConsistentHashingDemo";

export default function App() {
  return (
    <div>
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
        <li>on add/remove server: show keys reassigned (names, number, percent)</li>
        <li>provide toggle for having virtual server nodes (or not)</li>
        <li>visualize start/end of the hash space</li>
        <li>hover key: visualize arrow to mapped server</li>
      </ul>
      <h2>Done</h2>
      <p>
        ✅ show hash ring with servers and keys
        <br />✅ add server
        <br />✅ remove server
        <br />✅ add key
        <br />✅ remove key
        <br />✅ reset, remove all servers and keys
        <br />✅ populate a big set of random keys
        <br />✅ on hovering a key the highlight the corresponding hash ring position
        <br />✅ on hovering a server highlight the belonging hash space
        <br />✅ show stats: #servers, #keys, average keys/server
      </p>
    </div>
  );
}
