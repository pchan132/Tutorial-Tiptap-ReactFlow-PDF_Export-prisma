"use client";
import ReactFlow, {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "@xyflow/react/dist/style.css";
// Import initial nodes and edges
// Workflow.constants.ts
import { initialEdges, initialNodes } from "./Workflow.constants";
// Import custom node components
import Paymentinti from "./Paymentinti";
import PaymentCountry from "./PaymentCountry";
import PaymentProvider from "./PaymentProvider";
import PaymentProviderSelect from "./PaymentProviderSelect";

// edge
import CustomEdge from "./CustomEdge";

// ประเภท node
const nodeTypes = {
  paymentInit: Paymentinti,
  paymentCountry: PaymentCountry,
  paymentProvider: PaymentProvider,
  paymentProviderSelect: PaymentProviderSelect,
};

// ประเภท edge
const edgeTypes = {
  CustomEdge: CustomEdge,
};

export default function Workflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* หน้าจอเต็ม */}
      {/* ReactFlow component ใช้สำหรับการแสดงผล Workflow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}
