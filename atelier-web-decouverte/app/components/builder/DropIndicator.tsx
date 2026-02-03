"use client";

import { useBuilder } from "../../context/BuilderContext";

interface DropIndicatorProps {
  targetId: string | null;
  position: "before" | "after" | "inside";
  isFirst?: boolean;
  isLast?: boolean;
  isInRow?: boolean;
}

export default function DropIndicator({
  targetId,
  position,
  isFirst = false,
  isLast = false,
  isInRow = false,
}: DropIndicatorProps) {
  const { state, updateDropPosition, endDrag } = useBuilder();
  const { dragState } = state;

  // Check if this indicator is currently active
  const isActive =
    dragState.isDragging &&
    dragState.dropPosition?.targetId === targetId &&
    dragState.dropPosition?.position === position;

  // Don't show if not dragging
  if (!dragState.isDragging) {
    return null;
  }

  // Can't drop something inside itself
  if (
    dragState.draggedItem?.type === "existing" &&
    dragState.draggedItem.blockId === targetId
  ) {
    return null;
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateDropPosition({ targetId, position });
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    // Don't clear if entering a child element
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    endDrag();
  };

  // Horizontal indicator for row children
  if (isInRow) {
    return (
      <div
        className={`relative flex-shrink-0 transition-all duration-150 self-stretch ${
          isActive ? "w-2 mx-1" : "w-4"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Invisible hit area - wider for easier targeting */}
        <div className="absolute inset-y-0 -left-4 -right-4 cursor-pointer z-10" />
        {/* Visual indicator */}
        <div
          className={`absolute inset-y-2 left-1/2 -translate-x-1/2 w-1 bg-blue-500 rounded-full transition-all ${
            isActive ? "opacity-100 scale-y-100" : "opacity-0 scale-y-50"
          }`}
        >
          {/* Dots at ends */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-1 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      </div>
    );
  }

  // Vertical indicator for stacked blocks
  return (
    <div
      className={`relative transition-all duration-150 ${
        isActive ? "h-2 my-1" : isFirst || isLast ? "h-2" : "h-0"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Invisible hit area - always present for better UX */}
      <div className="absolute inset-x-0 -top-3 -bottom-3 cursor-pointer" />

      {/* Visual indicator */}
      <div
        className={`absolute inset-x-0 top-1/2 -translate-y-1/2 transition-all ${
          isActive ? "opacity-100 h-1" : "opacity-0 h-0"
        }`}
      >
        <div className="h-full bg-blue-500 rounded-full relative">
          {/* Dots at ends */}
          <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full" />
        </div>
      </div>
    </div>
  );
}
