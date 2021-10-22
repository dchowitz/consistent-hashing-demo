import * as React from "react";
import { Circle } from "./math";

export default function KeyRing(props: { circle: Circle }) {
  const { circle } = props;
  return (
    <circle
      cx={circle.x}
      cy={circle.y}
      r={circle.radius}
      stroke="green"
      strokeWidth="8"
      fill="transparent"
    />
  );
}
