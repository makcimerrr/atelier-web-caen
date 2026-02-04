"use client";

import { useBuilder } from "../../context/BuilderContext";
import { BlockType, BLOCK_TYPES } from "../../types/builder";

export default function ElementsPanel() {
  const { addBlock, startDrag, endDrag, state } = useBuilder();

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    startDrag({ type: "new", blockType: type });
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("text/plain", type);
  };

  const handleDragEnd = () => {
    // If no valid drop occurred, end drag without action
    if (!state.dragState.dropPosition) {
      endDrag();
    }
  };

  const handleClick = (type: BlockType) => {
    addBlock(type);
  };

  // Group elements by category
  const basicElements = BLOCK_TYPES.filter(b => b.category === "basic");
  const layoutElements = BLOCK_TYPES.filter(b => b.category === "layout");
  const structureElements = BLOCK_TYPES.filter(b => b.category === "structure");
  const sectionElements = BLOCK_TYPES.filter(b => b.category === "sections");
  const interactiveElements = BLOCK_TYPES.filter(b => b.category === "interactive");

  return (
    <div className="p-4 space-y-6">
      {/* Basic Elements */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Éléments de base
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {basicElements.map(({ type, icon, name, description }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onDragEnd={handleDragEnd}
              onClick={() => handleClick(type)}
              className="flex flex-col items-center justify-center p-3 bg-white border border-zinc-200 rounded-xl cursor-grab hover:border-blue-400 hover:bg-blue-50 active:cursor-grabbing transition-all select-none group"
            >
              <span className="text-2xl mb-1.5 group-hover:scale-110 transition-transform">
                {icon}
              </span>
              <span className="text-xs font-medium text-zinc-700">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Layout Elements */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Mise en page
        </h3>
        <div className="space-y-2">
          {layoutElements.map(({ type, icon, name, description }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onDragEnd={handleDragEnd}
              onClick={() => handleClick(type)}
              className="flex items-center gap-3 p-3 bg-white border border-zinc-200 rounded-xl cursor-grab hover:border-blue-400 hover:bg-blue-50 active:cursor-grabbing transition-all select-none group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-zinc-700 text-sm">{name}</div>
                <div className="text-xs text-zinc-400 truncate">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Structure Elements */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Structure
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {structureElements.map(({ type, icon, name, description }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onDragEnd={handleDragEnd}
              onClick={() => handleClick(type)}
              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl cursor-grab hover:border-purple-400 hover:from-purple-100 hover:to-blue-100 active:cursor-grabbing transition-all select-none group"
            >
              <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
                {icon}
              </span>
              <span className="text-xs font-medium text-purple-700">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sections prédéfinies */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Sections prêtes à l'emploi
        </h3>
        <div className="space-y-2">
          {sectionElements.map(({ type, icon, name, description }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onDragEnd={handleDragEnd}
              onClick={() => handleClick(type)}
              className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl cursor-grab hover:border-amber-400 hover:from-amber-100 hover:to-orange-100 active:cursor-grabbing transition-all select-none group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-amber-800 text-sm">{name}</div>
                <div className="text-xs text-amber-600 truncate">{description}</div>
              </div>
              <span className="text-xs bg-amber-200 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Auto
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Elements */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Éléments interactifs
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {interactiveElements.map(({ type, icon, name, description }) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => handleDragStart(e, type)}
              onDragEnd={handleDragEnd}
              onClick={() => handleClick(type)}
              className="flex flex-col items-center justify-center p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl cursor-grab hover:border-emerald-400 hover:from-emerald-100 hover:to-teal-100 active:cursor-grabbing transition-all select-none group"
            >
              <span className="text-xl mb-1 group-hover:scale-110 transition-transform">
                {icon}
              </span>
              <span className="text-xs font-medium text-emerald-700">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick tip */}
      <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-xs text-blue-700 font-medium mb-1">Astuce</p>
            <p className="text-xs text-blue-600">
              Glissez-déposez les éléments sur la zone de travail ou cliquez pour les ajouter à la fin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
