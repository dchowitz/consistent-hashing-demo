import * as React from "react";

export default function KeyInput(props: {
  value: string;
  onChange: (key: string) => void;
}) {
  const apiController = React.useRef(new AbortController());

  function fetchRandomKey() {
    apiController.current.abort();
    apiController.current = new AbortController();
    const { signal } = apiController.current;

    fetch("https://random-word-api.herokuapp.com/word?number=1", { signal })
      .then((r) => r.json())
      .then((words) => props.onChange(words[0] || "Fetch Failed"));
  }

  return (
    <div>
      <input
        placeholder="Enter Key"
        type="text"
        value={props.value}
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        style={{ width: "25ch", marginRight: "1rem" }}
      />
      <button onClick={fetchRandomKey}>Random Key</button>
    </div>
  );
}
