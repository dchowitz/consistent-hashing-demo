import * as React from "react";
import { MAX_HASH } from "../ConsistentHashing";
import KeyNodeCircle from "./KeyNodeCircle";
import ServerNodeTick from "./ServerNodeTick";

export default function Legend() {
  const dim = 16;
  const dimHalf = dim / 2;
  return (
    <>
      <div>
        <svg width={dim} height={dim} version="1.1" xmlns="http://www.w3.org/2000/svg">
          <KeyNodeCircle x={dimHalf} y={dimHalf} />
        </svg>
        <Label>location of a key on the hash ring</Label>
      </div>
      <div>
        <svg width={dim} height={dim} version="1.1" xmlns="http://www.w3.org/2000/svg">
          <KeyNodeCircle x={dimHalf} y={dimHalf} highlight />
        </svg>
        <Label>key (highlighted)</Label>
      </div>
      <div>
        <svg width={dim} height={dim} version="1.1" xmlns="http://www.w3.org/2000/svg">
          <ServerNodeTick
            circle={{ x: 8, y: 8, radius: 8 }}
            hash={(MAX_HASH / 4) * 3}
            highlight
          />
        </svg>
        <Label>location of a server on the hash ring</Label>
      </div>
      <div>
        <svg width={dim} height={dim} version="1.1" xmlns="http://www.w3.org/2000/svg">
          <line
            x1={0}
            y1={dimHalf}
            x2={dim}
            y2={dimHalf}
            stroke="lightblue"
            strokeWidth={dim}
          />
        </svg>
        <Label>hash range mapped to a server</Label>
      </div>
      <div>
        <svg width={dim} height={dim} version="1.1" xmlns="http://www.w3.org/2000/svg">
          <line
            x1={0}
            y1={dimHalf}
            x2={dim}
            y2={dimHalf}
            stroke="lightsalmon"
            strokeWidth={dim}
          />
        </svg>
        <Label>hash range re-mapped due to server deletion</Label>
      </div>
    </>
  );
}

const Label: React.FC = (props) => {
  return <span style={{ marginLeft: "0.5rem" }}>{props.children}</span>;
};
