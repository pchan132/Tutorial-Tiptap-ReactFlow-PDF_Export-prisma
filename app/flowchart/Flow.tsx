"use client";
import {
  ReactFlow,
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  EdgeChange,
  NodeChange,
  Edge,
  Node,
  addEdge,
  Connection,
  MiniMap,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Interactive Flowchart , applyEdgeChanges, applyNodeChanges
import { useState, useCallback } from "react";

// ReactFlowComponent with interactive nodes and edges
const ReactFlowComponent = ({
  // Initial
  nodes: initialNodes,
  edges: initialEdges,
}: {
  // Props
  nodes: Node[];
  edges: Edge[];
}) => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  // Handlers for node and edge changes
  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  // Handle connect (optional)
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange} // Enable node interaction
        onEdgesChange={onEdgesChange} // Enable edge interaction
        onConnect={onConnect} // Enable connection creation
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

function Flow() {
  const nodes: Node[] = [
    {
      id: "n1",
      position: { x: 0, y: 0 },
      data: { label: "Node 1" },
      type: "input",
    },
    {
      id: "n2",
      position: { x: 100, y: 100 },
      data: { label: "Node 2" },
    },
  ];
  const edges: Edge[] = [
    {
      id: "e1",
      source: "n1",
      target: "n2",
      animated: true,
    },
  ];
  return <ReactFlowComponent nodes={nodes} edges={edges} />;
}

export default Flow; // Default export
