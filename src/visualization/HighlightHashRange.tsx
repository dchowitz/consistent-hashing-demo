import * as React from "react";
import { getTheta, Circle } from "./math";
import Arc from "./Arc";

export default function HighlightHashRange(props: {
  circle: Circle;
  hash: number;
  sortedHashes: number[];
  color: string;
}) {
  const { circle, hash, sortedHashes, color } = props;
  if (sortedHashes.length === 0) return <></>;
  if (sortedHashes.length === 1) {
    return (
      <circle
        cx={circle.x}
        cy={circle.y}
        r={circle.radius}
        stroke={color}
        strokeWidth={20}
        fill="transparent"
      />
    );
  }

  let hashIdx = sortedHashes.findIndex((h) => h === hash);
  if (hashIdx === -1) {
    return <></>;
  }

  const startIdx = hashIdx - 1 < 0 ? sortedHashes.length - 1 : hashIdx - 1;
  const startHash = sortedHashes[startIdx];
  if (startHash === hash) {
    return <></>;
  }

  return (
    <Arc
      circle={circle}
      startAngle={getTheta(startHash)}
      endAngle={getTheta(hash)}
      stroke={color}
      strokeWidth={20}
      fill="transparent"
    />
  );
}
