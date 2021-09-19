import * as React from "react";

export default function CircularHashSpace(props: {
  serverHashes: number[];
  keyHashes: number[];
  highlightServerHash?: number;
  highlightKeyHash?: number;
}) {
  const { keyHashes, highlightServerHash, highlightKeyHash } = props;
  const serverHashes = [...props.serverHashes];
  const width = 400;
  const height = 400;
  const circle = {
    x: width / 2,
    y: height / 2,
    radius: width / 2 - 10,
  };

  const highlightServer = highlightServerHash !== undefined;
  const serverIdx = highlightServer && serverHashes.indexOf(highlightServerHash);
  const serverDeleted = highlightServer && serverIdx === -1;
  let successorServerHash: number | undefined;

  if (serverDeleted) {
    let successorServerIdx = serverHashes.findIndex((h) => h > highlightServerHash);
    if (successorServerIdx === -1) {
      successorServerIdx = 0;
    }
    successorServerHash = serverHashes[successorServerIdx];
    serverHashes.splice(successorServerIdx, 0, highlightServerHash);
  }

  return (
    <svg version="1.1" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" stroke="gray" strokeWidth="2" fill="transparent" />
      <circle
        cx={circle.x}
        cy={circle.y}
        r={circle.radius}
        stroke="lightblue"
        strokeWidth="2"
        fill="transparent"
      />

      {(highlightServer && successorServerHash !== undefined && (
        <>
          <HighlightHashRange
            circle={circle}
            hash={successorServerHash!}
            sortedHashes={serverHashes}
            color="lightblue"
          />
          <HighlightHashRange
            circle={circle}
            hash={highlightServerHash}
            sortedHashes={serverHashes}
            color="lightsalmon"
          />
        </>
      )) ||
        (highlightServer && (
          <HighlightHashRange
            circle={circle}
            hash={highlightServerHash}
            sortedHashes={serverHashes}
            color="lightblue"
          />
        ))}

      {keyHashes.map((h) => (
        <KeyNode key={h} circle={circle} hash={h} />
      ))}
      {highlightKeyHash !== undefined && (
        <KeyNode hash={highlightKeyHash} circle={circle} highlight />
      )}
      {serverHashes.map((h) => (
        <ServerNode
          key={h}
          circle={circle}
          hash={h}
          highlight={highlightServerHash === h}
        />
      ))}
      {successorServerHash !== undefined && (
        <ServerNode circle={circle} hash={successorServerHash} highlight />
      )}
    </svg>
  );
}

function KeyNode(props: { circle: Circle; hash: number; highlight?: boolean }) {
  const { circle, hash } = props;
  const highlight = !!props.highlight;
  const theta = getTheta(hash);
  const [x, y] = getCartesianPoint(circle, theta);
  return (
    <circle cx={x} cy={y} r={highlight ? 8 : 4} fill={highlight ? "orange" : "green"} />
  );
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

function HighlightHashRange(props: {
  circle: Circle;
  hash: number;
  sortedHashes: number[];
  color: string;
}) {
  const { circle, hash, sortedHashes, color } = props;
  if (sortedHashes.length === 0) return <></>;
  if (sortedHashes.length === 1) {
    return (
      <circle
        cx={circle.x}
        cy={circle.y}
        r={circle.radius}
        stroke={color}
        strokeWidth={20}
        fill="transparent"
      />
    );
  }

  let hashIdx = sortedHashes.findIndex((h) => h === hash);
  if (hashIdx === -1) {
    return <></>;
  }

  const startIdx = hashIdx - 1 < 0 ? sortedHashes.length - 1 : hashIdx - 1;
  const startHash = sortedHashes[startIdx];
  if (startHash === hash) {
    return <></>;
  }

  return (
    <Arc
      circle={circle}
      startAngle={getTheta(startHash)}
      endAngle={getTheta(hash)}
      stroke={color}
      strokeWidth={20}
      fill="transparent"
    />
  );
}

function Arc(
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
  ].join(" ")

  return <path d={d} {...others} />;
}

type Circle = { x: number; y: number; radius: number };
const MATH_PI_HALF = Math.PI / 2;
const MATH_PI_DOUBLE = Math.PI * 2;

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
