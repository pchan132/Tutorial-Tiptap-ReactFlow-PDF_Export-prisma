"use client";

import { useCallback, useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from "reactflow";

import "reactflow/dist/style.css";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import ProcessNode from "@/components/custom-nodes/ProcessNode";
import StartNode from "@/components/custom-nodes/StartNode";
import DecisionNode from "@/components/custom-nodes/DecisionNode";

// ...
const nodeTypes = {
  start: StartNode,
  process: ProcessNode,
  decision: DecisionNode,
};

export default function FlowchartPage() {
  // state ของ nodes และ edges
  const [nodes, setNodes, onNodesChange] = useNodesState([
    {
      id: "1",
      position: { x: 250, y: 0 },
      data: { label: "Start" },
      type: "input",
    },
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // เชื่อมเส้นระหว่าง Node
  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  // ลบ Node ทั้งหมด
  const handleClear = () => {
    setNodes([]);
    setEdges([]);
  };

  // Export Flowchart → PDF
  const handleExportPDF = async () => {
    const flow = document.getElementById("flowchart-container");
    if (!flow) return;
    const imgData = await toPng(flow);
    const pdf = new jsPDF("l", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("flowchart.pdf");
  };

  // Save Flowchart → LocalStorage (แทน Database ชั่วคราว)
  const handleSave = () => {
    const data = { nodes, edges };
    localStorage.setItem("flowchart", JSON.stringify(data));
    alert("💾 บันทึกผังงานแล้ว!");
  };

  // Load Flowchart
  const handleLoad = () => {
    const saved = localStorage.getItem("flowchart");
    if (!saved) return alert("ยังไม่มีผังงานที่บันทึกไว้");
    const { nodes, edges } = JSON.parse(saved);
    setNodes(nodes);
    setEdges(edges);
  };

  const handleAddNode = (type: string) => {
    const id = (nodes.length + 1).toString();
    const newNode: Node = {
      id,
      type, // 🔸 ใช้ type ที่ส่งมา
      position: { x: Math.random() * 500, y: Math.random() * 400 },
      data: { label: `${type.toUpperCase()} ${id}` },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">
      {/* Toolbar */}
      <div className="p-2 bg-white border-b flex gap-2 justify-between">
        <div className="flex gap-2">
          <div className="flex gap-3 mb-3 flex-wrap">
            <button
              onClick={() => handleAddNode("start")}
              className="px-3 py-2 bg-green-500 text-white rounded"
            >
              🔵 Add Start
            </button>
            <button
              onClick={() => handleAddNode("process")}
              className="px-3 py-2 bg-blue-500 text-white rounded"
            >
              ⬜ Add Process
            </button>
            <button
              onClick={() => handleAddNode("decision")}
              className="px-3 py-2 bg-yellow-500 text-white rounded"
            >
              🔶 Add Decision
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              💾 Save
            </button>
            <button
              onClick={handleExportPDF}
              className="px-3 py-2 bg-red-500 text-white rounded"
            >
              🧾 Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Flowchart Area */}
      <div id="flowchart-container" className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
