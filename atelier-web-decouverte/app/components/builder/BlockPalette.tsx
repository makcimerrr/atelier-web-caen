"use client";

import { useBuilder } from "../../context/BuilderContext";
import { BlockType } from "../../types/builder";

const BLOCKS: { type: BlockType; icon: string; label: string }[] = [
  { type: "heading", icon: "H", label: "Titre" },
  { type: "text", icon: "T", label: "Texte" },
  { type: "image", icon: "🖼", label: "Image" },
  { type: "button", icon: "▢", label: "Bouton" },
  { type: "container", icon: "☐", label: "Conteneur" },
  { type: "spacer", icon: "↕", label: "Espace" },
];

export default function BlockPalette() {
  const { setDraggedBlockType, addBlock } = useBuilder();

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    setDraggedBlockType(type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggedBlockType(null);
  };

  const handleClick = (type: BlockType) => {
    addBlock(type);
  };

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Blocs
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {BLOCKS.map(({ type, icon, label }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            onDragEnd={handleDragEnd}
            onClick={() => handleClick(type)}
            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg cursor-grab hover:border-blue-400 hover:bg-blue-50 active:cursor-grabbing transition-colors select-none"
          >
            <span className="text-xl mb-1 text-gray-600">{icon}</span>
            <span className="text-xs font-medium text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
