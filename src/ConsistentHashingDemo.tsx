import * as React from "react";
import CircularHashSpace from "./CircularHashSpace";
import ConsistentHashing, { ConsistentHashingInspect, hash } from "./ConsistentHashing";
import { v4 as uuid } from "uuid";

export default function ConsistentHashingDemo() {
  const csRef = React.useRef(new ConsistentHashing());
  const cs = csRef.current;
  const [csState, setCsState] = React.useState<ConsistentHashingInspect>({
    servers: [],
    serverHashes: [],
    keys: [],
    keyHashes: [],
    serverKeyMap: {},
    sortedServerKeyCounts: [],
  });
  const [highlightHash, setHighlightHash] = React.useState<number | undefined>();
  const isEmpty = csState.keys.length === 0 && csState.servers.length === 0;

  const onAddServer = (count: number) => () => {
    for (let i = 0; i < count; i++) {
      const server = getNextServerName();
      cs.addServer(server);
    }
    setCsState(cs.inspect());
  };

  function onRemoveServer(e: React.MouseEvent) {
    const server = (e.target as any).id;
    cs.removeServer(server);
    setCsState(cs.inspect());
  }

  function onHoverServer(e: React.MouseEvent) {
    const server = (e.target as any).id;
    setHighlightHash(hash(server));
  }

  const onAddKey = (count: number) => () => {
    for (let i = 0; i < count; i++) {
      const key = getNextKeyName();
      cs.addKey(key);
    }
    setCsState(cs.inspect());
  };

  function onRemoveKey(e: React.MouseEvent) {
    const key = (e.target as any).id;
    cs.removeKey(key);
    setCsState(cs.inspect());
  }

  function onHoverKey(e: React.MouseEvent) {
    const key = (e.target as any).id;
    setHighlightHash(hash(key));
  }

  function onUnhover() {
    setHighlightHash(undefined);
  }

  function onReset() {
    csRef.current = new ConsistentHashing();
    setCsState(csRef.current.inspect());
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute" }}>
          <CircularHashSpace
            serverHashes={csState.serverHashes}
            keyHashes={csState.keyHashes}
            highlightHash={highlightHash}
          />
        </div>
        <div
          style={{
            width: 400,
            height: 400,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stats serverKeyCounts={csState.sortedServerKeyCounts} />
        </div>
      </div>
      <DivSpacer />
      <div style={{ flex: 1 }}>
        <button onClick={onAddServer(1)}>add server</button>
        <SpanSpacer />
        <button onClick={onAddServer(10)}>add 10 servers</button>
        <DivSpacer />
        {!!csState.servers.length && (
          <div>
            <span>
              <strong style={{ fontSize: "1.5rem" }}>{csState.servers.length}</strong>{" "}
              servers
            </span>
            <br />
            <em style={{ color: "gray" }}>click a server to remove it</em>
          </div>
        )}
        <DivSpacer />
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          onClick={onRemoveServer}
          onMouseOver={onHoverServer}
          onMouseLeave={onUnhover}
        >
          {csState.servers.map((s) => (
            <Item key={s} name={s} />
          ))}
        </div>
      </div>
      <DivSpacer />
      <div style={{ flex: 3 }}>
        <button onClick={onAddKey(1)}>add key</button>
        <SpanSpacer />
        <button onClick={onAddKey(100)}>add 100 keys</button>
        <SpanSpacer />
        <button onClick={onReset} disabled={isEmpty}>
          reset
        </button>
        <DivSpacer />
        {!!csState.keys.length && (
          <div>
            <span>
              <strong style={{ fontSize: "1.5rem" }}>{csState.keys.length}</strong> keys
            </span>
            <br />
            <em style={{ color: "gray" }}>click a key to remove it</em>
          </div>
        )}
        <DivSpacer />
        <div
          style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          onClick={onRemoveKey}
          onMouseOver={onHoverKey}
          onMouseLeave={onUnhover}
        >
          {csState.keys.map((k) => (
            <Item key={k} name={k} />
          ))}
        </div>
      </div>
    </div>
  );
}

function getNextServerName() {
  return "s-" + uuid().slice(-6);
}

function getNextKeyName() {
  return "k-" + uuid().slice(-6);
}

function Stats(props: { serverKeyCounts: number[] }) {
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

function Item(props: { name: string }) {
  return (
    <div style={{ fontFamily: "monospace", padding: "0.25rem" }}>
      <a id={props.name} href={"#" + props.name}>
        {props.name}
      </a>
    </div>
  );
}

function DivSpacer() {
  return <div style={{ marginTop: "0.5rem", marginLeft: "0.5rem" }} />;
}
function SpanSpacer() {
  return <span style={{ marginLeft: "0.5rem" }} />;
}

function median(values: number[]) {
  const sorted = [...values].sort();
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
  const sorted = [...values].sort();
  const k = Math.floor(alpha * sorted.length);
  const trimmed = sorted.slice(k, -k);
  return (trimmed.reduce((sum, i) => sum + i, 0) / trimmed.length).toFixed(1);
}
