"use client";

import { useBuilder } from "../../context/BuilderContext";
import BlockRenderer from "../blocks/BlockRenderer";

export default function Canvas() {
  const { state, selectBlock, setDraggedBlockType, addBlock } = useBuilder();
  const { canvas, previewMode } = state;

  const maxWidthClasses = {
    sm: "max-w-xl",
    md: "max-w-3xl",
    lg: "max-w-5xl",
    full: "max-w-none",
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (state.draggedBlockType) {
      e.preventDefault();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (state.draggedBlockType) {
      addBlock(state.draggedBlockType);
      setDraggedBlockType(null);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  return (
    <div
      className={`min-h-full ${previewMode ? "" : "p-8"}`}
      style={{ backgroundColor: canvas.backgroundColor }}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`mx-auto ${maxWidthClasses[canvas.maxWidth]}`}>
        {canvas.blocks.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-2xl transition-colors ${
              state.draggedBlockType
                ? "border-blue-400 bg-blue-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="text-center p-8">
              <div className="text-5xl mb-4 opacity-50">📦</div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Votre page est vide
              </h3>
              <p className="text-gray-400 text-sm max-w-xs">
                Glissez-déposez des blocs depuis le panneau de gauche pour commencer à construire votre site
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {canvas.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
