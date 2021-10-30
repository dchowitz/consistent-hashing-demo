import * as React from "react";

export default function KeyNodeCircle(props: {
  x: number;
  y: number;
  highlight?: boolean;
}) {
  const { x, y } = props;
  const highlight = !!props.highlight;
  return (
    <circle cx={x} cy={y} r={highlight ? 8 : 4} fill={highlight ? "orange" : "green"} />
  );
}
