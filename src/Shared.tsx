import * as React from "react";

export function Item(props: { name: string }) {
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
export function DivSpacer() {
  return <div style={{ marginTop: "0.5rem", marginLeft: "0.5rem" }} />;
}
export function SpanSpacer() {
  return <span style={{ marginLeft: "0.5rem" }} />;
}

export const format = new Intl.NumberFormat().format;
export const formatPercent = new Intl.NumberFormat(undefined, {
  style: "percent",
  maximumFractionDigits: 1,
}).format;
