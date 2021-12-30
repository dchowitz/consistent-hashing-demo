import * as React from "react";
import {
  ConsistentHashingState,
  hash,
  HashRange,
  getHashRange,
  getSuccessorWrapping,
} from "../ConsistentHashing";
import Arc from "./Arc";
import HighlightHashRange from "./HighlightHashRange";
import KeyNode from "./KeyNodeCircle";
import KeyRing from "./KeyRing";
import { Circle, getCartesianPoint, getCirclePoint, getHash, getTheta } from "./math";
import ServerNodeTick from "./ServerNodeTick";

const MAX_KEY_HASHES_BEFORE_SIMPLIFICATION = 1000;

export default function CircularHashSpace2(props: {
  state: ConsistentHashingState;
  highlightServer?: string;
  highlightKey?: string;
  showLabels?: boolean;
  showArrow?: boolean;
  showStartEnd?: boolean;
}) {
  const { state, highlightServer, highlightKey } = props;
  const showLabels = !!props.showLabels;
  const showArrow = !!props.showArrow;
  const showStartEnd = !!props.showStartEnd;
  const dim = 400;
  const circle = {
    x: dim / 2,
    y: dim / 2,
    radius: dim / 2 - 10,
  };

  const highlightKeyHash = (highlightKey && hash(highlightKey)) || undefined;
  const targetServer = highlightKey && state.instance?.lookupVirtualServer(highlightKey);
  const targetServerHash = targetServer && hash(targetServer);

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
    const deletedServerHashes = state.virtualServerHashes(highlightServer);
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
    <svg
      version="1.1"
      height="100%"
      width="100%"
      viewBox={`0 0 ${dim} ${dim}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={circle.x}
        cy={circle.y}
        r={circle.radius}
        stroke="lightblue"
        strokeWidth="2"
        fill="transparent"
      />

      {/* {showStartEnd && <StartEnd circle={circle}/>} */}

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

      {showArrow && highlightKeyHash && targetServerHash && (
        <Arrow circle={circle} fromHash={highlightKeyHash} toHash={targetServerHash} />
      )}

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

      {showLabels && highlightKeyHash && (
        <HashLabel circle={circle} hash={highlightKeyHash} label={props.highlightKey!} />
      )}

      {showLabels &&
        state.sortedServerHashes.map((h) => (
          <HashLabel key={h} circle={circle} hash={h} label={state.serversByHash[h]} />
        ))}

      {/* 
      <HashLabel circle={circle} hash={getHash(0)} label="0 grad" />
      <HashLabel circle={circle} hash={getHash(30)} label="30 grad" />
      <HashLabel circle={circle} hash={getHash(70)} label="70 grad" />
      <HashLabel circle={circle} hash={getHash(95)} label="95 grad" />
      <HashLabel circle={circle} hash={getHash(160)} label="160 grad" />
      <HashLabel circle={circle} hash={getHash(180)} label="180 grad" />
      <HashLabel circle={circle} hash={getHash(230)} label="230 grad" />
      <HashLabel circle={circle} hash={getHash(270)} label="270 grad" />
      <HashLabel circle={circle} hash={getHash(320)} label="320 grad" /> */}
    </svg>
  );
}

function HashLabel(props: { circle: Circle; hash: number; label: string }) {
  const { circle, hash, label } = props;
  const theta = getTheta(hash);
  const p = getCartesianPoint({ ...circle, radius: circle.radius - 19 }, theta);

  // convert angle from rad to degree, and normalize it to [0,360[
  // note: here 0° is on the positive x-axis
  let deg = (180 / Math.PI) * theta;
  deg = deg < 0 ? 360 + deg : deg;

  // different text rotation and anchor point for right and left halfes of circle
  const anchor = deg >= 270 || deg < 90 ? "end" : "start";
  const deg2 = anchor === "start" ? deg - 180 : deg;

  return (
    <text textAnchor={anchor} transform={`translate(${p.x},${p.y}) rotate(${deg2})`}>
      {label}
    </text>
  );
}

function Arrow(props: { circle: Circle; fromHash: number; toHash: number }) {
  const { circle, fromHash, toHash } = props;
  const p = getCirclePoint(circle, toHash);
  const head = ["M", 0, 0, "l", -20, -5, "l", 0, 10, "Z"].join(" ");
  const deg = (180 / Math.PI) * getTheta(toHash) + 90;

  return (
    <>
      <Arc
        circle={circle}
        startAngle={getTheta(fromHash)}
        endAngle={getTheta(toHash)}
        stroke="red"
        strokeWidth={3}
        fill="transparent"
      />
      <path d={head} fill="red" transform={`translate(${p.x},${p.y}) rotate(${deg})`} />
    </>
  );
}
