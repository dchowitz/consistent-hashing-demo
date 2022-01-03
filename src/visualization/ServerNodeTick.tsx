import * as React from "react";
import { colors } from "./CircularHashSpace";
import { getTheta, getCartesianPoint, Circle } from "./math";

export default function ServerNodeTick(props: {
  circle: Circle;
  hash: number;
  highlight?: boolean;
  color?: string;
}) {
  const { circle, hash, color } = props;
  const highlight = !!props.highlight;
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
    <Tick
      circle={circle}
      theta={getTheta(hash)}
      lengthOutside={highlight ? 10 : 5}
      lengthInside={highlight ? 20 : 5}
      stroke={color || colors.server}
      strokeWidth={highlight ? 4 : 3}
    />
  );
}

export function Tick(props: {
  circle: Circle;
  theta: number;
  lengthOutside: number;
  lengthInside: number;
  stroke: string;
  strokeWidth: number;
}) {
  const { circle, theta, lengthOutside, lengthInside, stroke, strokeWidth } = props;
  const p1 = getCartesianPoint(
    { ...circle, radius: circle.radius - lengthInside },
    theta
  );
  const p2 = getCartesianPoint(
    { ...circle, radius: circle.radius + lengthOutside },
    theta
  );
  return (
    <line
      x1={p1.x}
      y1={p1.y}
      x2={p2.x}
      y2={p2.y}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
}
