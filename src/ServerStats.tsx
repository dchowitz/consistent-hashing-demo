import * as React from "react";
import { ConsistentHashingState, getHashRange, MAX_HASH } from "./ConsistentHashing";
import { format } from "./Shared";

export default function ServerStats(props: {
  server: string;
  state: ConsistentHashingState;
}) {
  const { server, state } = props;
  const keyCount = state.serverKeyMap[server].length;
  const ranges: { start: number; end: number }[] = [];

  (state.serverHashMap[server] || []).forEach((h) => {
    const range = getHashRange(h, state.sortedServerHashes);
    if (range === undefined) {
      return;
    }
    if (range.type === "partial") {
      if (range.start > range.end) {
        ranges.push({ start: range.start, end: 0 });
        ranges.push({ start: 0, end: range.end });
      } else {
        ranges.push(range);
      }
    } else {
      ranges.push({ start: 0, end: MAX_HASH });
    }
  });

  return (
    <div style={{ textAlign: "center" }}>
      server <strong>{server}</strong>
      <br />
      <br />
      hash range{ranges.length !== 1 && "s"}
      <br />
      {ranges.map((r) => (
        <div key={r.start}>
          <strong>
            [{format(r.start)} ... {format(r.end)}]
          </strong>
        </div>
      ))}
      <br />
      <br />
      <strong>{keyCount}</strong> key{keyCount !== 1 && "s"}
    </div>
  );
}
