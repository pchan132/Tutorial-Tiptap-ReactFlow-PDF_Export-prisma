import React from "react";
import { Handle, Position } from "reactflow";

export default function ProcessNode({ data }: any) {
  return (
    <div className="px-4 py-2 bg-blue-200 border-2 border-blue-600 rounded text-center">
      <Handle type="target" position={Position.Top} />
      <div className="font-semibold">{data.label || "Process"}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
