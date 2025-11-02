import { Handle, NodeProps, Position } from "reactflow";

export default function Paymentinti({
  data: { amount },
}: NodeProps<{ amount: number }>) {
  return (
    <div className="border border-blue-700 rounded">
      <div className="bg-blue-700 p-1.5 pr-10">Amount:</div>
      <div className="p-4">${amount}</div>
      <Handle type="target" position={Position.Right} />
    </div>
  );
}
