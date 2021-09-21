import * as React from "react";
import { Action } from "./ConsistentHashingDemo";
import { formatPercent, Item } from "./Shared";

export default function LastActionStats(props: { action: Action }) {
  const { action, server, state } = props.action;
  const keyCount = state.serverKeyMap[server]?.length || 0;
  const keyCountPercent = keyCount > 0 && keyCount / state.keys.length;
  const actionName = action === "addServer" ? "adding" : "removing";
  return (
    <div style={{ textAlign: "center" }}>
      reassigned <strong>{keyCount}</strong> keys{" "}
      {keyCountPercent && `(${formatPercent(keyCountPercent)})`}
      <br />
      by {actionName} server <Item name={server} />
    </div>
  );
}
