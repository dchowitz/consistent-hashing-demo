import * as React from "react";
import { MAX_HASH } from "../ConsistentHashing";
import HighlightHashRange from "./HighlightHashRange";
import KeyNode from "./KeyNode";
import KeyRing from "./KeyRing";
import ServerNode from "./ServerNode";

const MAX_KEY_HASHES_BEFORE_SIMPLIFICATION = 1000;

export default function CircularHashSpace(props: {
  sortedServerHashes: number[];
  keyHashes: number[];
  highlightServerHash?: number;
  highlightKeyHash?: number;
}) {
  const { sortedServerHashes, keyHashes, highlightServerHash, highlightKeyHash } = props;
  const width = 400;
  const height = 400;
  const circle = {
    x: width / 2,
    y: height / 2,
    radius: width / 2 - 10,
  };

  let currentRange: HashRange;
  let movedRange: HashRange;

  const serverDeleted =
    highlightServerHash !== undefined &&
    sortedServerHashes.indexOf(highlightServerHash) === -1;
  if (serverDeleted) {
    let successorServerHash = sortedServerHashes.find((h) => h > highlightServerHash);
    if (successorServerHash === undefined) {
      successorServerHash = sortedServerHashes[0];
    }
    currentRange = {
      type: "partial",
      start: highlightServerHash,
      end: successorServerHash - 1,
    };
    movedRange = getHashRange(highlightServerHash, sortedServerHashes);
  } else if (highlightServerHash !== undefined) {
    currentRange = getHashRange(highlightServerHash, sortedServerHashes);
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

      <HighlightHashRange circle={circle} range={currentRange} color="lightblue" />
      <HighlightHashRange circle={circle} range={movedRange} color="lightsalmon" />

      {(keyHashes.length <= MAX_KEY_HASHES_BEFORE_SIMPLIFICATION &&
        keyHashes.map((h) => <KeyNode key={h} circle={circle} hash={h} />)) || (
        <KeyRing circle={circle} />
      )}

      {highlightKeyHash !== undefined && (
        <KeyNode hash={highlightKeyHash} circle={circle} highlight />
      )}

      {sortedServerHashes.map((h) => (
        <ServerNode
          key={h}
          circle={circle}
          hash={h}
          highlight={highlightServerHash === h}
        />
      ))}
    </svg>
  );
}

export type HashRange =
  | { type: "partial"; start: number; end: number }
  | { type: "all"; end: number }
  | undefined;

function getHashRange(serverHash: number, sortedServerHashes: number[]): HashRange {
  if (sortedServerHashes.length === 1) {
    return { type: "all", end: serverHash };
  }

  const endIdx = sortedServerHashes.findIndex((h) => h >= serverHash);
  let startIdx = endIdx - 1;
  if (startIdx < 0) {
    startIdx = sortedServerHashes.length - 1;
  }

  const start = sortedServerHashes[startIdx];
  const end = serverHash > 0 ? serverHash - 1 : MAX_HASH; // a key hash is mapped to it's nearest server node with a greater hash value

  if (start === end) {
    return undefined;
  }

  return { type: "partial", start, end };
}
