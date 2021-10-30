import * as React from "react";
import { getTheta, getCartesianPoint, Circle } from "./math";

export default function ServerNodeTick(props: {
  circle: Circle;
  hash: number;
  highlight: boolean;
}) {
  const { circle, hash, highlight } = props;
  const theta = getTheta(hash);
  const p1 = getCartesianPoint(
    { ...circle, radius: circle.radius - (highlight ? 20 : 5) },
    theta
  );
  const p2 = getCartesianPoint(
    { ...circle, radius: circle.radius + (highlight ? 10 : 5) },
    theta
  );
  return (
    <line
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
      stroke="red"
      strokeWidth={highlight ? "4" : "3"}
    />
  );
}
