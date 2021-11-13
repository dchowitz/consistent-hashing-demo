import * as React from "react";
import {
  ConsistentHashingState,
  hash,
  MAX_HASH,
  virtualServerHashes,
} from "../ConsistentHashing";
import HighlightHashRange from "./HighlightHashRange";
import KeyNode from "./KeyNodeCircle";
import KeyRing from "./KeyRing";
import { getCirclePoint } from "./math";
import ServerNodeTick from "./ServerNodeTick";

const MAX_KEY_HASHES_BEFORE_SIMPLIFICATION = 1000;

export default function CircularHashSpace2(props: {
  state: ConsistentHashingState;
  highlightServer?: string;
  highlightKey?: string;
}) {
  const { state, highlightServer, highlightKey } = props;
  const width = 400;
  const height = 400;
  const circle = {
    x: width / 2,
    y: height / 2,
    radius: width / 2 - 10,
  };

  const highlightKeyHash = (highlightKey && hash(highlightKey)) || undefined;
  const highlightServerHashes = new Set(
    (highlightServer && state.serverHashMap[highlightServer]) || []
  );

  let hashRanges: HashRange[] = [];
  let movedRanges: HashRange[] = [];

  if (highlightServer && state.serverHashMap[highlightServer] !== undefined) {
    // server nodes exists, show corresponding hash ranges
    hashRanges = [...highlightServerHashes.values()].map((h) =>
      getHashRange(h, state.sortedServerHashes)
    );
  } else if (highlightServer !== undefined) {
    // server was deleted, show ranges formerly belonging to deleted server
    // along with the ranges they were moved to
    const deletedServerHashes = virtualServerHashes(highlightServer);
    const sortedServerHashes = [...state.sortedServerHashes, ...deletedServerHashes].sort(
      (a, b) => a - b
    );

    deletedServerHashes.forEach((d) => {
      movedRanges.push(getHashRange(d, sortedServerHashes));
      const successor = getSuccessorWrapping(d, sortedServerHashes);
      if (successor !== undefined) {
        hashRanges.push(getHashRange(successor, sortedServerHashes));
      }
    });
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

      {hashRanges
        .filter((r) => !!r)
        .map((r) => (
          <HighlightHashRange key={r!.end} circle={circle} range={r} color="lightblue" />
        ))}

      {movedRanges
        .filter((r) => !!r)
        .map((r) => (
          <HighlightHashRange
            key={r!.end}
            circle={circle}
            range={r}
            color="lightsalmon"
          />
        ))}

      {(state.keyHashes.length <= MAX_KEY_HASHES_BEFORE_SIMPLIFICATION &&
        state.keyHashes.map((h) => (
          <KeyNode key={h} {...getCirclePoint(circle, h)} />
        ))) || <KeyRing circle={circle} />}

      {highlightKeyHash !== undefined && (
        <KeyNode {...getCirclePoint(circle, highlightKeyHash)} highlight />
      )}

      {state.sortedServerHashes.map((h) => (
        <ServerNodeTick
          key={h}
          circle={circle}
          hash={h}
          highlight={highlightServerHashes.has(h)}
        />
      ))}
    </svg>
  );
}

export function CircularHashSpace(props: {
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
        keyHashes.map((h) => <KeyNode key={h} {...getCirclePoint(circle, h)} />)) || (
        <KeyRing circle={circle} />
      )}

      {highlightKeyHash !== undefined && (
        <KeyNode {...getCirclePoint(circle, highlightKeyHash)} highlight />
      )}

      {sortedServerHashes.map((h) => (
        <ServerNodeTick
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

function getSuccessorWrapping(hash: number, sortedHashes: number[]) {
  if (sortedHashes.length < 2) {
    return undefined;
  }

  const idx = sortedHashes.indexOf(hash);
  if (idx === -1) {
    return undefined;
  }

  const inc = idx + 1;
  return sortedHashes[inc < sortedHashes.length ? inc : 0];
}
