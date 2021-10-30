import * as React from "react";
import { getTheta, Circle } from "./math";
import Arc from "./Arc";
import { HashRange } from "./CircularHashSpace";
import ServerNodeTick from "./ServerNodeTick";

export default function HighlightHashRange(props: {
  circle: Circle;
  range: HashRange;
  color: string;
}) {
  const { circle, range, color } = props;

  if (range === undefined) {
    return <></>;
  }

  if (range.type === "all") {
    return (
      <>
        <circle
          cx={circle.x}
          cy={circle.y}
          r={circle.radius}
          stroke={color}
          strokeWidth={20}
          fill="transparent"
        />
        <ServerNodeTick circle={circle} hash={range.end} highlight />
      </>
    );
  }

  const { start, end } = range;
  return (
    <>
      <Arc
        circle={circle}
        startAngle={getTheta(start)}
        endAngle={getTheta(end)}
        stroke={color}
        strokeWidth={20}
        fill="transparent"
      />
      <ServerNodeTick circle={circle} hash={range.end} highlight />
    </>
  );
}
