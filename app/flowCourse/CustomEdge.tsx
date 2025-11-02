import React from "react";
import {
  EdgeProps,
  getBezierPath,
  BezierEdge,
  EdgeLabelRenderer,
} from "reactflow";

// Simple IconButton component
const IconButton = ({
  icon,
  ...props
}: {
  icon: string;
  [key: string]: any;
}) => <button {...props}>{icon}</button>;

export default function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  } = props;
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });
  return (
    <>
      <BezierEdge {...props} />
      <EdgeLabelRenderer>
        <IconButton aria-label="delete" pos="absolute" icon="🗑️" />
      </EdgeLabelRenderer>
    </>
  );
}
