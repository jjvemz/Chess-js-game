import React from "react";
import { useDrag, DragPreviewImage, DragSourceMonitor } from "react-dnd";
import './Piece.css'

interface PieceProps {
  piece: { type: string; color: string };
  position: string;
}

interface DragItem {
  type: string;
  id: string;
}

export default function Piece({ piece: { type, color }, position }: PieceProps) {
  try {
    if (!type || !color) {
      throw new Error(`Missing piece properties: type = ${type}, color = ${color}`);
    }

    const [{ isDragging }, drag, preview] = useDrag<DragItem, unknown, { isDragging: boolean }>({
      type: "piece",
      item: {
        type: "piece",
        id: `${position}_${type}_${color}`,
      },
      collect: (monitor: DragSourceMonitor<DragItem, unknown>) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });

    const pieceImg = `/assets/${type}_${color}.png`;

    return (
      <>
        <DragPreviewImage connect={preview} src={pieceImg} />
        <div
          className="piece-container"
          ref={drag}
          style={{ opacity: isDragging ? 0 : 1 }}
        >
          <img src={pieceImg} alt={`${type} ${color}`} className="piece" />
        </div>
      </>
    );
  } catch (error) {
    console.error("Error in Piece component:", error);
    return <div>Error loading piece</div>;
  }
}