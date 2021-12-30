export type Circle = { x: number; y: number; radius: number };

const MATH_PI_HALF = Math.PI / 2;
export const MATH_PI_DOUBLE = Math.PI * 2;

/**
 * Maps a hash in the range [0, 0xffffffff] to an
 * angle on the circle.
 * Assumption is to have clockwise mapping:
 * - positive y-axis denotes 0rad (0°)
 * - positive x-axis denotes pi/2rad (90°)
 */
export function getTheta(hash: number) {
  return (hash / 0x7fffffff) * Math.PI - MATH_PI_HALF;
}

export function getHash(deg: number) {
  return (0x7fffffff / 180) * deg;
}

/**
 * Transforms a polar coordinate into its cartesian equivalent.
 */
export function getCartesianPoint(circle: Circle, theta: number) {
  return {
    x: circle.radius * Math.cos(theta) + circle.x,
    y: circle.radius * Math.sin(theta) + circle.y,
  };
}

/**
 * Maps a hash to a corresponding point on a circle.
 */
export function getCirclePoint(circle: Circle, hash: number) {
  return getCartesianPoint(circle, getTheta(hash));
}
