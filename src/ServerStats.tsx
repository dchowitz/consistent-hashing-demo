import * as React from "react";
import { hash, ServerKeyMap } from "./ConsistentHashing";
import { format } from "./Shared";

export default function ServerStats(props: {
  server: string;
  serverKeyMap: ServerKeyMap;
}) {
  const { server, serverKeyMap } = props;
  const keys = serverKeyMap[server];
  const servers = Object.keys(serverKeyMap).map((k) => k);
  const serverIndex = servers.indexOf(server);
  const previousServerIndex = serverIndex === 0 ? servers.length - 1 : serverIndex - 1;
  const previousServer = servers[previousServerIndex];
  const startHash = hash(previousServer);
  const endHash = hash(server) - 1;

  return (
    <div style={{ textAlign: "center" }}>
      server <strong>{server}</strong>
      <br />
      <br />
      hash range
      <br />
      <strong>
        {(startHash > endHash && (
          <>
            [{format(startHash)} ... 0]
            <br />
            [0 ... {format(endHash)}]
          </>
        )) || (
          <>
            [{format(startHash)} ... {format(endHash)}]
          </>
        )}
      </strong>
      <br />
      <br />
      <strong>{keys.length}</strong> key{keys.length !== 1 && "s"}
    </div>
  );
}
