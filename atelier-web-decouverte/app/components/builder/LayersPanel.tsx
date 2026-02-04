"use client";

import { useState } from "react";
import { useBuilder } from "../../context/BuilderContext";
import { Block, RowBlock } from "../../types/builder";

export default function LayersPanel() {
  const { state, selectBlock, deleteBlock, duplicateBlock, updateBlock, moveBlock } = useBuilder();
  const { blocks, selectedBlockId } = state;

  if (blocks.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-40">📄</div>
          <p className="text-sm text-zinc-500">
            Aucun élément
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Ajoutez des éléments depuis l'onglet "Éléments"
          </p>
        </div>
      </div>
    );
  }

  // Move block in array
  const handleMoveUp = (blockId: string, parentBlocks: Block[]) => {
    const index = parentBlocks.findIndex(b => b.id === blockId);
    if (index > 0) {
      const prevBlockId = parentBlocks[index - 1].id;
      moveBlock(blockId, prevBlockId, "before");
    }
  };

  const handleMoveDown = (blockId: string, parentBlocks: Block[]) => {
    const index = parentBlocks.findIndex(b => b.id === blockId);
    if (index < parentBlocks.length - 1) {
      const nextBlockId = parentBlocks[index + 1].id;
      moveBlock(blockId, nextBlockId, "after");
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        Structure de la page ({blocks.length})
      </h3>
      <div className="space-y-1">
        {blocks.map((block, index) => (
          <LayerItem
            key={block.id}
            block={block}
            depth={0}
            isSelected={selectedBlockId === block.id}
            onSelect={() => selectBlock(block.id)}
            onDelete={() => deleteBlock(block.id)}
            onDuplicate={() => duplicateBlock(block.id)}
            onMoveUp={() => handleMoveUp(block.id, blocks)}
            onMoveDown={() => handleMoveDown(block.id, blocks)}
            canMoveUp={index > 0}
            canMoveDown={index < blocks.length - 1}
            parentBlocks={blocks}
          />
        ))}
      </div>
    </div>
  );
}

interface LayerItemProps {
  block: Block;
  depth: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  parentBlocks: Block[];
}

function LayerItem({
  block,
  depth,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  parentBlocks,
}: LayerItemProps) {
  const { selectBlock, deleteBlock, duplicateBlock, updateBlock, moveBlock, state } = useBuilder();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const blockIcons: Record<Block["type"], string> = {
    heading: "H",
    text: "T",
    image: "🖼",
    button: "▢",
    row: "⊞",
    spacer: "↕",
    divider: "—",
    header: "🏠",
    footer: "📋",
    hero: "🚀",
    features: "✨",
    testimonial: "💬",
    cta: "📣",
    gallery: "🖼️",
    card: "🃏",
    video: "▶️",
    list: "📝",
    quote: "❝",
    socials: "🔗",
    stats: "📊",
    accordion: "📂",
    pricing: "💰",
  };

  const blockNames: Record<Block["type"], string> = {
    heading: "Titre",
    text: "Texte",
    image: "Image",
    button: "Bouton",
    row: "Colonnes",
    spacer: "Espace",
    divider: "Séparateur",
    header: "En-tête",
    footer: "Pied de page",
    hero: "Hero",
    features: "Fonctionnalités",
    testimonial: "Témoignage",
    cta: "Appel à l'action",
    gallery: "Galerie",
    card: "Carte",
    video: "Vidéo",
    list: "Liste",
    quote: "Citation",
    socials: "Réseaux",
    stats: "Stats",
    accordion: "FAQ",
    pricing: "Tarif",
  };

  const getBlockPreview = (b: Block): string => {
    switch (b.type) {
      case "heading":
      case "text":
        return b.content.substring(0, 20) + (b.content.length > 20 ? "..." : "");
      case "button":
        return b.text;
      case "row":
        return `${b.children.length} élément${b.children.length > 1 ? "s" : ""}`;
      default:
        return "";
    }
  };

  const isRow = block.type === "row";
  const rowBlock = isRow ? (block as RowBlock) : null;
  const isHidden = block.visible === false;

  const toggleVisibility = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateBlock(block.id, { visible: !isHidden });
  };

  const handleChildMoveUp = (childId: string) => {
    if (rowBlock) {
      const index = rowBlock.children.findIndex(c => c.id === childId);
      if (index > 0) {
        const prevChildId = rowBlock.children[index - 1].id;
        moveBlock(childId, prevChildId, "before");
      }
    }
  };

  const handleChildMoveDown = (childId: string) => {
    if (rowBlock) {
      const index = rowBlock.children.findIndex(c => c.id === childId);
      if (index < rowBlock.children.length - 1) {
        const nextChildId = rowBlock.children[index + 1].id;
        moveBlock(childId, nextChildId, "after");
      }
    }
  };

  return (
    <div className={isHidden ? "opacity-50" : ""}>
      <div
        className={`flex items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
          isSelected
            ? "bg-blue-100 text-blue-700"
            : "hover:bg-zinc-100 text-zinc-700"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={onSelect}
      >
        {/* Expand/collapse for rows */}
        {isRow && rowBlock?.children.length ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsCollapsed(!isCollapsed);
            }}
            className="text-xs text-zinc-400 w-4 hover:text-zinc-600"
          >
            {isCollapsed ? "▶" : "▼"}
          </button>
        ) : (
          <span className="w-4" />
        )}

        {/* Icon */}
        <span className="text-sm w-6 text-center flex-shrink-0">
          {blockIcons[block.type]}
        </span>

        {/* Name and preview */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{blockNames[block.type]}</span>
            {getBlockPreview(block) && (
              <span className="text-xs text-zinc-400 truncate">
                {getBlockPreview(block)}
              </span>
            )}
          </div>
        </div>

        {/* Visibility toggle */}
        <button
          onClick={toggleVisibility}
          className={`p-1 rounded ${isHidden ? "text-zinc-400" : "text-zinc-500 hover:text-zinc-700"}`}
          title={isHidden ? "Afficher" : "Masquer"}
        >
          {isHidden ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>

        {/* Actions when selected */}
        {isSelected && (
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {/* Move up */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveUp();
              }}
              disabled={!canMoveUp}
              className={`p-1 rounded ${canMoveUp ? "hover:bg-blue-200 text-blue-600" : "text-zinc-300 cursor-not-allowed"}`}
              title="Monter"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            {/* Move down */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMoveDown();
              }}
              disabled={!canMoveDown}
              className={`p-1 rounded ${canMoveDown ? "hover:bg-blue-200 text-blue-600" : "text-zinc-300 cursor-not-allowed"}`}
              title="Descendre"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Duplicate */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate();
              }}
              className="p-1 hover:bg-blue-200 rounded text-blue-600"
              title="Dupliquer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            {/* Delete */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-red-100 rounded text-red-500"
              title="Supprimer"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Children for rows */}
      {isRow && rowBlock && rowBlock.children.length > 0 && !isCollapsed && (
        <div className="mt-1">
          {rowBlock.children.map((child, index) => (
            <LayerItem
              key={child.id}
              block={child}
              depth={depth + 1}
              isSelected={state.selectedBlockId === child.id}
              onSelect={() => selectBlock(child.id)}
              onDelete={() => deleteBlock(child.id)}
              onDuplicate={() => duplicateBlock(child.id)}
              onMoveUp={() => handleChildMoveUp(child.id)}
              onMoveDown={() => handleChildMoveDown(child.id)}
              canMoveUp={index > 0}
              canMoveDown={index < rowBlock.children.length - 1}
              parentBlocks={rowBlock.children}
            />
          ))}
        </div>
      )}
    </div>
  );
}
