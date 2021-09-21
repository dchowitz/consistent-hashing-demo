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
  const [startX, startY] = getCartesianPoint(circle, startAngle);
  const [endX, endY] = getCartesianPoint(circle, endAngle);

  let size = endAngle - startAngle;
  size = size > 0 ? size : MATH_PI_DOUBLE + size;
  const isLarge = size > Math.PI;

  // prettier-ignore
  const d = [
    "M", startX, startY,
    "A", circle.radius, circle.radius, 0, isLarge ? 1 : 0, 1, endX, endY
  ].join(" ");

  return <path d={d} {...others} />;
}
