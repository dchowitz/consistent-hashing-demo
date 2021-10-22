import * as React from "react";
import HighlightHashRange from "./HighlightHashRange";
import KeyNode from "./KeyNode";
import KeyRing from "./KeyRing";
import ServerNode from "./ServerNode";

const MAX_KEY_HASHES = 1000;

export default function CircularHashSpace(props: {
  serverHashes: number[];
  keyHashes: number[];
  highlightServerHash?: number;
  highlightKeyHash?: number;
}) {
  const { keyHashes, highlightServerHash, highlightKeyHash } = props;
  const serverHashes = [...props.serverHashes];
  const width = 400;
  const height = 400;
  const circle = {
    x: width / 2,
    y: height / 2,
    radius: width / 2 - 10,
  };

  const highlightServer = highlightServerHash !== undefined;
  const serverIdx = highlightServer && serverHashes.indexOf(highlightServerHash);
  const serverDeleted = highlightServer && serverIdx === -1;
  let successorServerHash: number | undefined;

  if (serverDeleted) {
    let successorServerIdx = serverHashes.findIndex((h) => h > highlightServerHash);
    if (successorServerIdx === -1) {
      successorServerIdx = 0;
    }
    successorServerHash = serverHashes[successorServerIdx];
    serverHashes.splice(successorServerIdx, 0, highlightServerHash);
  }

  return (
    <svg version="1.1" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" stroke="gray" strokeWidth="2" fill="transparent" />
      <circle
        cx={circle.x}
        cy={circle.y}
        r={circle.radius}
        stroke="lightblue"
        strokeWidth="2"
        fill="transparent"
      />

      {(highlightServer && successorServerHash !== undefined && (
        <>
          <HighlightHashRange
            circle={circle}
            hash={successorServerHash!}
            sortedHashes={serverHashes}
            color="lightblue"
          />
          <HighlightHashRange
            circle={circle}
            hash={highlightServerHash}
            sortedHashes={serverHashes}
            color="lightsalmon"
          />
        </>
      )) ||
        (highlightServer && (
          <HighlightHashRange
            circle={circle}
            hash={highlightServerHash}
            sortedHashes={serverHashes}
            color="lightblue"
          />
        ))}

      {(keyHashes.length <= MAX_KEY_HASHES &&
        keyHashes.map((h) => <KeyNode key={h} circle={circle} hash={h} />)) || (
        <KeyRing circle={circle} />
      )}

      {highlightKeyHash !== undefined && (
        <KeyNode hash={highlightKeyHash} circle={circle} highlight />
      )}

      {serverHashes.map((h) => (
        <ServerNode
          key={h}
          circle={circle}
          hash={h}
          highlight={highlightServerHash === h}
        />
      ))}

      {successorServerHash !== undefined && (
        <ServerNode circle={circle} hash={successorServerHash} highlight />
      )}
    </svg>
  );
}
