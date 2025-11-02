import React from "react";
import { Handle, Position } from "reactflow";

export default function DecisionNode({ data }: any) {
  return (
    <div
      className="relative bg-yellow-200 border-2 border-yellow-600 text-center text-sm font-semibold"
      style={{
        width: 100,
        height: 100,
        transform: "rotate(45deg)",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{ transform: "rotate(-45deg)" }}
      />
      <div
        className="absolute top-1/2 left-1/2"
        style={{
          transform: "translate(-50%, -50%) rotate(-45deg)",
        }}
      >
        {data.label || "Decision"}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ transform: "rotate(-45deg)" }}
      />
    </div>
  );
}
