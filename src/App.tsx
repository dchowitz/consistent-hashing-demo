import React from "react";
import ConsistentHashingDemo from "./ConsistentHashingDemo";

export default function App() {
  return (
    <div>
      <h1>Consistent Hashing Demo</h1>
      <ul>
        <li>✅ show hash ring with servers and keys</li>
        <li>✅ add server</li>
        <li>on add server: show keys reassigned (names, number, percent)</li>
        <li>show stats: #servers, #keys, average keys/server</li>
        <li>✅ remove server</li>
        <li>on remove server: show keys reassigned (names, number, percent)</li>
        <li>✅ add key</li>
        <li>✅ remove key</li>
        <li>✅ reset, remove all servers and keys</li>
        <li>
          ✅ on hovering a key the corresponding position on the hash ring highlighted
        </li>
        <li>provide toggle for having virtual server nodes (or not)</li>
        <li>✅ populate a big set of random keys</li>
        <li>
          on adding removing a server, highlight the keys assigned to another server
        </li>
      </ul>
      <ConsistentHashingDemo />
    </div>
  );
}
