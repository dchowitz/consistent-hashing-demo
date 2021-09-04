import * as React from "react";

export default function CircularHashSpace(props: {
  serverHashes: number[];
  keyHashes: number[];
  highlightHash?: number;
}) {
  const { serverHashes, keyHashes, highlightHash } = props;
  const width = 400;
  const height = 400;
  const circle = {
    x: width / 2,
    y: height / 2,
    radius: width / 2 - 10,
  };

  return (
    <div>
      <svg version="1.1" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
        <rect
          width="100%"
          height="100%"
          stroke="gray"
          strokeWidth="2"
          fill="transparent"
        />
        <circle
          cx={circle.x}
          cy={circle.y}
          r={circle.radius}
          stroke="lightblue"
          strokeWidth="2"
          fill="transparent"
        />
        {keyHashes.map((h) => (
          <KeyNode key={h} circle={circle} hash={h} highlight={highlightHash === h} />
        ))}
        {serverHashes.map((h) => (
          <ServerNode key={h} circle={circle} hash={h} highlight={highlightHash === h} />
        ))}
      </svg>
    </div>
  );
}

function KeyNode(props: { circle: Circle; hash: number; highlight: boolean }) {
  const { circle, hash, highlight } = props;
  const theta = getTheta(hash);
  const [x, y] = getCartesianPoint(circle, theta);
  return <circle cx={x} cy={y} r={highlight ? 8 : 4} fill="green" />;
}

function ServerNode(props: { circle: Circle; hash: number; highlight: boolean }) {
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

type Circle = { x: number; y: number; radius: number };
const MATH_PI_HALF = Math.PI / 2;

/**
 * Maps a hash in the range [0, 0xffffffff] to an
 * angle on the circle.
 */
function getTheta(hash: number) {
  return (hash / 0x7fffffff) * Math.PI;
}

/**
 * Transforms a polar coordinate into its cartesian equivalent.
 * Assumption is to have clockwise mapping:
 * - positive y-axis denotes 0rad (0°)
 * - positive x-axis denotes pi/2rad (90°)
 */
function getCartesianPoint(circle: Circle, theta: number): [x: number, y: number] {
  return [
    circle.radius * Math.cos(theta - MATH_PI_HALF) + circle.x,
    circle.radius * Math.sin(theta - MATH_PI_HALF) + circle.y,
  ];
}
