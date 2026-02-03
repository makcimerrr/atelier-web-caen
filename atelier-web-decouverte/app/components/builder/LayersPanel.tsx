"use client";

import { useBuilder } from "../../context/BuilderContext";
import { Block, RowBlock } from "../../types/builder";

export default function LayersPanel() {
  const { state, selectBlock, deleteBlock, duplicateBlock } = useBuilder();
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

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        Structure de la page
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
}

function LayerItem({ block, depth, isSelected, onSelect, onDelete, onDuplicate }: LayerItemProps) {
  const { selectBlock, deleteBlock, duplicateBlock, state } = useBuilder();

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

  return (
    <div>
      <div
        className={`flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer ${
          isSelected
            ? "bg-blue-100 text-blue-700"
            : "hover:bg-zinc-100 text-zinc-700"
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={onSelect}
      >
        {/* Expand/collapse for rows */}
        {isRow && (
          <span className="text-xs text-zinc-400 w-3">
            {rowBlock?.children.length ? "▼" : ""}
          </span>
        )}
        {!isRow && <span className="w-3" />}

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

        {/* Actions */}
        {isSelected && (
          <div className="flex items-center gap-1 flex-shrink-0">
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
      {isRow && rowBlock && rowBlock.children.length > 0 && (
        <div className="mt-1">
          {rowBlock.children.map((child) => (
            <LayerItem
              key={child.id}
              block={child}
              depth={depth + 1}
              isSelected={state.selectedBlockId === child.id}
              onSelect={() => selectBlock(child.id)}
              onDelete={() => deleteBlock(child.id)}
              onDuplicate={() => duplicateBlock(child.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
