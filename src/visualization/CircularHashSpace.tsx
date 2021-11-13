import * as React from "react";
import {
  ConsistentHashingState,
  hash,
  virtualServerHashes,
  HashRange,
  getHashRange,
  getSuccessorWrapping,
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
