import * as React from "react";
import { getTheta, getCartesianPoint, Circle } from "./math";

export default function ServerNode(props: {
  circle: Circle;
  hash: number;
  highlight: boolean;
}) {
  const { circle, hash, highlight } = props;
  const theta = getTheta(hash);
  const [x1, y1] = getCartesianPoint(
    { ...circle, radius: circle.radius - (highlight ? 20 : 5) },
    theta
  );
  const [x2, y2] = getCartesianPoint(
    { ...circle, radius: circle.radius + (highlight ? 10 : 5) },
    theta
  );
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="red"
      strokeWidth={highlight ? "4" : "3"}
    />
  );
}
