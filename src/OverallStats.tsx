import * as React from "react";

export default function OverallStats(props: { serverKeyCounts: number[] }) {
  const counts = props.serverKeyCounts;
  return (
    <div style={{ textAlign: "center" }}>
      {counts.length > 0 && (
        <>
          keys / server
          <br />
          <strong>{counts[0]}</strong> min,&nbsp;
          <strong>{counts[counts.length - 1]}</strong> max,
          <br />
          <strong>{median(counts)}</strong> median,&nbsp;
          <strong>{alphaAvg(counts)}</strong> &alpha;-avg&nbsp;
        </>
      )}
    </div>
  );
}

function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const l = sorted.length;
  if (l === 0) {
    return undefined;
  }

  if (l % 2 === 1) {
    // l=1: 0
    // l=3: 0,1,2
    // l=5: 0,1,2,3,4
    const mid = (l - 1) / 2;
    return sorted[mid];
  }

  // l=2: 0,1
  // l=4: 0,1,2,3
  // l=6: 0,1,2,3,4,5
  const m1 = l / 2;
  const m2 = m1 - 1;
  return ((sorted[m1] + sorted[m2]) / 2).toFixed(1);
}

function alphaAvg(values: number[]) {
  const alpha = 0.1; // we ignore both 10% of values from start *and* end (20% in sum)
  const sorted = [...values].sort((a, b) => a - b);
  const k = Math.floor(alpha * sorted.length);
  const trimmed = k > 0 ? sorted.slice(k, -k) : sorted;
  return (trimmed.reduce((sum, i) => sum + i, 0) / trimmed.length).toFixed(1);
}
