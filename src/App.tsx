import React, { useState } from "react";

export default function App() {
  return (
    <div>
      <h1>Consistent Hashing Demo</h1>
      <ul>
        <li>show hash ring with servers and keys</li>
        <li>add server</li>
        <li>remove server</li>
        <li>add key</li>
        <li>remove key</li>
        <li>reset, remove all servers and keys</li>
        <li>on hovering/selecting a key the corresponding server node is shown</li>
        <li>provide toggle for having virtual server nodes (or not)</li>
        <li>populate a big set of random keys</li>
        <li>on adding removing a server, highlight the keys assigned to another server</li>
      </ul>
    </div>
  );
}
