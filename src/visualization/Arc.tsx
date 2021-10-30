import * as React from "react";
import { getCartesianPoint, MATH_PI_DOUBLE, Circle } from "./math";

export default function Arc(
  props: {
    circle: Circle;
    startAngle: number;
    endAngle: number;
  } & React.SVGProps<SVGPathElement>
) {
  const { circle, startAngle, endAngle, ...others } = props;
  const start = getCartesianPoint(circle, startAngle);
  const end = getCartesianPoint(circle, endAngle);

  let size = endAngle - startAngle;
  size = size > 0 ? size : MATH_PI_DOUBLE + size;
  const isLarge = size > Math.PI;

  // prettier-ignore
  const d = [
    "M", start.x, start.y,
    "A", circle.radius, circle.radius, 0, isLarge ? 1 : 0, 1, end.x, end.y
  ].join(" ");

  return <path d={d} {...others} />;
}
