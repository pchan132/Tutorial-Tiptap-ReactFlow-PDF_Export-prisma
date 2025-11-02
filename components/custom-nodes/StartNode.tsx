import React from "react";
import { Handle, Position } from "reactflow";

export default function StartNode({ data }: any) {
  return (
    <div
      className="px-4 py-2 bg-green-200 border-2 border-green-600 rounded-full text-center"
      style={{ minWidth: 100 }}
    >
      <Handle type="target" position={Position.Top} />
      <div className="font-semibold">{data.label || "Start / End"}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
