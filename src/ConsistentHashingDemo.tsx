import * as React from "react";
import CircularHashSpace from "./CircularHashSpace";
import ConsistentHashing, { hash } from "./ConsistentHashing";
import { v4 as uuid } from "uuid";

export default function ConsistentHashingDemo() {
  const csRef = React.useRef(new ConsistentHashing());
  const cs = csRef.current;
  const [csState, setCsState] = React.useState(cs.inspect());
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
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
      <div>
        <CircularHashSpace
          serverHashes={csState.serverHashes}
          keyHashes={csState.keyHashes}
          highlightHash={highlightHash}
        />
      </div>
      <DivSpacer />
      <div style={{ flex: 1 }}>
        <button onClick={onAddServer(1)}>add server</button>
        <SpanSpacer />
        <button onClick={onAddServer(10)}>add 10 servers</button>
        <br />
        {!!csState.servers.length && <em>click a server to remove it</em>}
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
        <br />
        {!!csState.keys.length && <em>click a key to remove it</em>}
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

// function TextInput(props: { label: string; onValue: (input: string) => void }) {
//   const [value, setValue] = React.useState("");
//   const hasValue = value !== "";

//   const onChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
//     setValue(e.target.value || "");
//   }, []);

//   const onClick = React.useCallback(() => {
//     props.onValue(value);
//     setValue("");
//   }, []);

//   return (
//     <span>
//       <input type="text" size={10} onChange={onChange} value={value} />{" "}
//       <button onClick={onClick} disabled={!hasValue}>
//         {props.label}
//       </button>
//     </span>
//   );
// }
