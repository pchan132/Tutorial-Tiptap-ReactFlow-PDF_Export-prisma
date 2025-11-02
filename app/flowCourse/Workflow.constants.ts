import { Currency } from "lucide-react";
import { Edge, Node } from "reactflow";

export const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "CustomEdge",
    animated: true,
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "CustomEdge",
    animated: true,
  },
  {
    id: "e2-4",
    source: "2",
    target: "4",
    type: "CustomEdge",
    animated: true,
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    type: "CustomEdge",
    animated: true,
  },
];

export const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: { amount: 10 },
    type: "paymentInit",
  },
  {
    id: "2",
    data: { country: "United States", currency: "USD", icon: "US" },
    position: { x: 400, y: 100 },
    type: "paymentCountry",
  },
  {
    id: "3",
    data: { country: "Thailand", currency: "THB", icon: "TH" },
    position: { x: 400, y: 200 },
    type: "paymentCountry",
  },
  {
    id: "4",
    data: { name: "Stripe", icon: "St" },
    position: { x: 700, y: 150 },
    type: "paymentProvider",
  },
  {
    id: "5",
    data: { name: "Apple Pay", icon: "Ap" },
    position: { x: 700, y: 200 },
    type: "paymentProvider",
  },
  {
    id: "7",
    data: {},
    position: { x: 275, y: -150 },
    type: "paymentProviderSelect",
  },
];
