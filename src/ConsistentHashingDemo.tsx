import * as React from "react";
import CircularHashSpace from "./CircularHashSpace";
import ConsistentHashing, {
  ConsistentHashingInspect,
  hash,
  ServerKeyMap,
} from "./ConsistentHashing";
import { v4 as uuid } from "uuid";

type Action = {
  action: "addServer" | "removeServer";
  server: string;
  state: ConsistentHashingInspect;
};

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

  const [lastAction, setLastAction] = React.useState<Action | undefined>();
  const [highlightServer, setHighlightServer] = React.useState<string | undefined>();
  const [highlightKeyHash, setHighlightKeyHash] = React.useState<number | undefined>();
  const isEmpty = csState.keys.length === 0 && csState.servers.length === 0;
  const highlightServerHash = !!highlightServer ? hash(highlightServer) : undefined;
  const highlightServerExists =
    highlightServer && !!csState.serverKeyMap[highlightServer];

  const onAddServer = (count: number) => () => {
    let server: string | undefined;
    for (let i = 0; i < count; i++) {
      server = getNextServerName();
      cs.addServer(server);
    }
    const newState = cs.inspect();
    setCsState(newState);
    if (server) {
      setLastAction({ action: "addServer", server, state: newState });
    }
  };

  function onRemoveServer(e: React.MouseEvent) {
    const server = (e.target as any).id;
    if (!!server && server !== "") {
      cs.removeServer(server);
      setCsState(cs.inspect());
      setHighlightServer(undefined);
      setLastAction({ action: "removeServer", server, state: csState });
    }
  }

  function onHoverServer(e: React.MouseEvent) {
    const server = (e.target as any).id;
    if (!!server && server !== "") {
      setHighlightServer(server);
    }
  }

  const onAddKey = (count: number) => () => {
    for (let i = 0; i < count; i++) {
      const key = getNextKeyName();
      cs.addKey(key);
    }
    setCsState(cs.inspect());
    setLastAction(undefined);
  };

  function onRemoveKey(e: React.MouseEvent) {
    const key = (e.target as any).id;
    if (!!key && key !== "") {
      cs.removeKey(key);
      setCsState(cs.inspect());
      setHighlightKeyHash(undefined);
      setHighlightServer(undefined);
      setLastAction(undefined);
    }
  }

  function onHoverKey(e: React.MouseEvent) {
    const key = (e.target as any).id;
    if (!!key && key !== "") {
      setHighlightKeyHash(hash(key));
      setHighlightServer(cs.lookupServer(key));
    }
  }

  function onUnhover() {
    setHighlightServer(undefined);
    setHighlightKeyHash(undefined);
  }

  function onReset() {
    csRef.current = new ConsistentHashing();
    setCsState(csRef.current.inspect());
    setHighlightKeyHash(undefined);
    setHighlightServer(undefined);
    setLastAction(undefined);
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
        <div style={{ position: "absolute", zIndex: -1 }}>
          <CircularHashSpace
            serverHashes={csState.serverHashes}
            keyHashes={csState.keyHashes}
            highlightServerHash={highlightServerHash}
            highlightKeyHash={highlightKeyHash}
          />
        </div>
        <div
          style={{
            width: 400,
            height: 400,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <div style={{ height: "50%" }}>
            {highlightServerExists ? (
              <ServerStats server={highlightServer} serverKeyMap={csState.serverKeyMap} />
            ) : (
              <OverallStats serverKeyCounts={csState.sortedServerKeyCounts} />
            )}
          </div>
          {lastAction && (
            <div onMouseOver={onHoverServer} onMouseLeave={onUnhover}>
              <LastActionStats action={lastAction} />
            </div>
          )}
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

function OverallStats(props: { serverKeyCounts: number[] }) {
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

function ServerStats(props: { server: string; serverKeyMap: ServerKeyMap }) {
  const { server, serverKeyMap } = props;
  const keys = serverKeyMap[server];
  const servers = Object.keys(serverKeyMap).map((k) => k);
  const serverIndex = servers.indexOf(server);
  const previousServerIndex = serverIndex === 0 ? servers.length - 1 : serverIndex - 1;
  const previousServer = servers[previousServerIndex];
  const startHash = hash(previousServer);
  const endHash = hash(server) - 1;

  return (
    <div style={{ textAlign: "center" }}>
      server <strong>{server}</strong>
      <br />
      <br />
      hash range
      <br />
      <strong>
        {(startHash > endHash && (
          <>
            [{format(startHash)} ... 0]
            <br />
            [0 ... {format(endHash)}]
          </>
        )) || (
          <>
            [{format(startHash)} ... {format(endHash)}]
          </>
        )}
      </strong>
      <br />
      <br />
      <strong>{keys.length}</strong> key{keys.length !== 1 && "s"}
    </div>
  );
}

function LastActionStats(props: { action: Action }) {
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

function Item(props: { name: string }) {
  return (
    <div
      style={{
        fontFamily: "monospace",
        padding: "0.25rem",
      }}
    >
      <a id={props.name} href="#">
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

const format = new Intl.NumberFormat().format;
const formatPercent = new Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 1,
}).format;
