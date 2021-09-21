import * as React from "react";
import { getTheta, getCartesianPoint, Circle } from "./math";

export default function KeyNode(props: {
  circle: Circle;
  hash: number;
  highlight?: boolean;
}) {
  const { circle, hash } = props;
  const highlight = !!props.highlight;
  const theta = getTheta(hash);
  const [x, y] = getCartesianPoint(circle, theta);
  return (
    <circle cx={x} cy={y} r={highlight ? 8 : 4} fill={highlight ? "orange" : "green"} />
  );
}
