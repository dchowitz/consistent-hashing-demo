import * as React from "react";
import CircularHashSpace from "./visualization/CircularHashSpace";
import ConsistentHashing, {
  ConsistentHashingState,
  emptyConsistentHashingState,
} from "./ConsistentHashing";
import { v4 as uuid } from "uuid";
import ServerStats from "./ServerStats";
import LastActionStats from "./LastActionStats";
import OverallStats from "./OverallStats";
import { DivSpacer, SpanSpacer, Item } from "./Shared";
import Legend from "./visualization/Legend";

export type Action = {
  action: "addServer" | "removeServer";
  server: string;
  state: ConsistentHashingState;
};

export default function ConsistentHashingDemo() {
  const csRef = React.useRef(new ConsistentHashing());
  const cs = csRef.current;

  const [csState, setCsState] = React.useState(emptyConsistentHashingState);
  const [lastAction, setLastAction] = React.useState<Action | undefined>();
  const [highlightServer, setHighlightServer] = React.useState<string | undefined>();
  const [highlightKey, setHighlightKey] = React.useState<string | undefined>();
  const isEmpty = csState.keys.length === 0 && csState.servers.length === 0;
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
      setHighlightKey(undefined);
      setHighlightServer(undefined);
      setLastAction(undefined);
    }
  }

  function onHoverKey(e: React.MouseEvent) {
    const key = (e.target as any).id;
    if (!!key && key !== "") {
      setHighlightKey(key);
      setHighlightServer(cs.lookupServer(key));
    }
  }

  function onUnhover() {
    setHighlightServer(undefined);
    setHighlightKey(undefined);
  }

  function onReset() {
    csRef.current = new ConsistentHashing();
    setCsState(csRef.current.inspect());
    setHighlightKey(undefined);
    setHighlightServer(undefined);
    setLastAction(undefined);
  }

  return (
    <>
      <div
        style={{
          height: 400,
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
        }}
      >
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", zIndex: -1 }}>
            <CircularHashSpace
              state={csState}
              highlightKey={highlightKey}
              highlightServer={highlightServer}
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
                <ServerStats
                  server={highlightServer}
                  serverKeyMap={csState.serverKeyMap}
                />
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
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div>
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
          </div>
          <DivSpacer />
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              overflowY: "auto",
            }}
            onClick={onRemoveServer}
            onMouseOver={onHoverServer}
            onMouseLeave={onUnhover}
          >
            <MemoizedNodeList names={csState.servers} />
          </div>
        </div>
        <DivSpacer />
        <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
          <div>
            <button onClick={onAddKey(1)}>add key</button>
            <SpanSpacer />
            <button onClick={onAddKey(100)}>add 100 keys</button>
            <SpanSpacer />
            <button onClick={onReset} disabled={isEmpty}>
              reset
            </button>
          </div>
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
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              overflowY: "auto",
            }}
            onClick={onRemoveKey}
            onMouseOver={onHoverKey}
            onMouseLeave={onUnhover}
          >
            <MemoizedNodeList names={csState.keys} />
          </div>
        </div>
      </div>
      <Legend />
    </>
  );
}

const MemoizedNodeList = React.memo(
  function NodeList(props: { names: string[] }) {
    return (
      <>
        {props.names.map((k) => (
          <Item key={k} name={k} />
        ))}
      </>
    );
  },
  (prev, next) => prev.names === next.names
);

function getNextServerName() {
  return "s-" + uuid().slice(-6);
}

function getNextKeyName() {
  return "k-" + uuid().slice(-6);
}
