"use client";

import { useBuilder } from "../../context/BuilderContext";
import {
  Block,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  ButtonBlock,
  ContainerBlock,
  SpacerBlock,
  BLOCK_COLORS,
  TEXT_COLORS,
  SAMPLE_IMAGES,
} from "../../types/builder";

export default function PropertiesPanel() {
  const { state, getSelectedBlock, updateBlock, deleteBlock, moveBlock, duplicateBlock, selectBlock } = useBuilder();
  const selected = getSelectedBlock();

  if (!selected) {
    return (
      <div className="p-4">
        <div className="text-center py-8">
          <div className="text-4xl mb-3 opacity-30">👆</div>
          <p className="text-sm text-gray-500">
            Sélectionnez un bloc pour modifier ses propriétés
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 capitalize">{selected.type}</h3>
        <button
          onClick={() => selectBlock(null)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => moveBlock(selected.id, "up")}
          className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          title="Monter"
        >
          ↑
        </button>
        <button
          onClick={() => moveBlock(selected.id, "down")}
          className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          title="Descendre"
        >
          ↓
        </button>
        <button
          onClick={() => duplicateBlock(selected.id)}
          className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          title="Dupliquer"
        >
          ⧉
        </button>
        <button
          onClick={() => deleteBlock(selected.id)}
          className="flex-1 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
          title="Supprimer"
        >
          🗑
        </button>
      </div>

      {/* Properties */}
      <div className="space-y-4 pt-2">
        {selected.type === "text" && <TextProperties block={selected} />}
        {selected.type === "heading" && <HeadingProperties block={selected} />}
        {selected.type === "image" && <ImageProperties block={selected} />}
        {selected.type === "button" && <ButtonProperties block={selected} />}
        {selected.type === "container" && <ContainerProperties block={selected} />}
        {selected.type === "spacer" && <SpacerProperties block={selected} />}
      </div>
    </div>
  );
}

// === TEXT PROPERTIES ===
function TextProperties({ block }: { block: TextBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Contenu</label>
        <textarea
          value={block.content}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Taille</label>
          <select
            value={block.fontSize}
            onChange={(e) => updateBlock(block.id, { fontSize: e.target.value as any })}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
          >
            <option value="sm">Petit</option>
            <option value="base">Normal</option>
            <option value="lg">Grand</option>
            <option value="xl">Très grand</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Poids</label>
          <select
            value={block.fontWeight}
            onChange={(e) => updateBlock(block.id, { fontWeight: e.target.value as any })}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
          >
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="bold">Gras</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Alignement</label>
        <div className="flex gap-1">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => updateBlock(block.id, { textAlign: align as any })}
              className={`flex-1 py-2 text-sm rounded-lg ${
                block.textAlign === align
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {align === "left" ? "←" : align === "center" ? "↔" : "→"}
            </button>
          ))}
        </div>
      </div>
      <ColorPicker
        label="Couleur"
        value={block.textColor}
        colors={TEXT_COLORS}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === HEADING PROPERTIES ===
function HeadingProperties({ block }: { block: HeadingBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Contenu</label>
        <input
          type="text"
          value={block.content}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Niveau</label>
        <div className="flex gap-1">
          {[
            { value: "h1", label: "H1" },
            { value: "h2", label: "H2" },
            { value: "h3", label: "H3" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateBlock(block.id, { level: value as any })}
              className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                block.level === value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Alignement</label>
        <div className="flex gap-1">
          {["left", "center", "right"].map((align) => (
            <button
              key={align}
              onClick={() => updateBlock(block.id, { textAlign: align as any })}
              className={`flex-1 py-2 text-sm rounded-lg ${
                block.textAlign === align
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {align === "left" ? "←" : align === "center" ? "↔" : "→"}
            </button>
          ))}
        </div>
      </div>
      <ColorPicker
        label="Couleur"
        value={block.textColor}
        colors={TEXT_COLORS}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === IMAGE PROPERTIES ===
function ImageProperties({ block }: { block: ImageBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Image</label>
        <div className="grid grid-cols-3 gap-1.5">
          {SAMPLE_IMAGES.map((img) => (
            <button
              key={img.name}
              onClick={() => updateBlock(block.id, { src: img.url, alt: img.name })}
              className={`aspect-video rounded-lg overflow-hidden border-2 ${
                block.src === img.url ? "border-blue-500" : "border-gray-200"
              }`}
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Arrondi</label>
        <div className="flex gap-1">
          {[
            { value: "none", label: "Aucun" },
            { value: "md", label: "Moyen" },
            { value: "lg", label: "Grand" },
            { value: "full", label: "Rond" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateBlock(block.id, { rounded: value as any })}
              className={`flex-1 py-1.5 text-xs rounded-lg ${
                block.rounded === value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-500">Ombre</label>
        <button
          onClick={() => updateBlock(block.id, { shadow: !block.shadow })}
          className={`w-10 h-5 rounded-full transition-colors ${
            block.shadow ? "bg-blue-500" : "bg-gray-200"
          }`}
        >
          <span
            className={`block w-4 h-4 bg-white rounded-full shadow transition-transform ${
              block.shadow ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </>
  );
}

// === BUTTON PROPERTIES ===
function ButtonProperties({ block }: { block: ButtonBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Texte</label>
        <input
          type="text"
          value={block.text}
          onChange={(e) => updateBlock(block.id, { text: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Style</label>
        <div className="flex gap-1">
          {[
            { value: "filled", label: "Plein" },
            { value: "outline", label: "Contour" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateBlock(block.id, { variant: value as any })}
              className={`flex-1 py-2 text-sm rounded-lg ${
                block.variant === value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Taille</label>
        <div className="flex gap-1">
          {[
            { value: "sm", label: "Petit" },
            { value: "md", label: "Moyen" },
            { value: "lg", label: "Grand" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateBlock(block.id, { size: value as any })}
              className={`flex-1 py-1.5 text-xs rounded-lg ${
                block.size === value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <ColorPicker
        label="Couleur"
        value={block.color}
        colors={[
          { name: "Bleu", value: "#2563eb" },
          { name: "Gris", value: "#64748b" },
          { name: "Noir", value: "#1e293b" },
          { name: "Vert", value: "#16a34a" },
        ]}
        onChange={(color) => updateBlock(block.id, { color })}
      />
    </>
  );
}

// === CONTAINER PROPERTIES ===
function ContainerProperties({ block }: { block: ContainerBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Disposition</label>
        <div className="flex gap-1">
          {[
            { value: "stack", label: "↓ Pile" },
            { value: "row", label: "→ Ligne" },
            { value: "grid", label: "⊞ Grille" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateBlock(block.id, { layout: value as any })}
              className={`flex-1 py-1.5 text-xs rounded-lg ${
                block.layout === value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Espacement</label>
          <select
            value={block.gap}
            onChange={(e) => updateBlock(block.id, { gap: e.target.value as any })}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
          >
            <option value="none">Aucun</option>
            <option value="sm">Petit</option>
            <option value="md">Moyen</option>
            <option value="lg">Grand</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Padding</label>
          <select
            value={block.padding}
            onChange={(e) => updateBlock(block.id, { padding: e.target.value as any })}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
          >
            <option value="none">Aucun</option>
            <option value="sm">Petit</option>
            <option value="md">Moyen</option>
            <option value="lg">Grand</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Horizontal</label>
          <select
            value={block.justify}
            onChange={(e) => updateBlock(block.id, { justify: e.target.value as any })}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
          >
            <option value="start">Début</option>
            <option value="center">Centre</option>
            <option value="end">Fin</option>
            <option value="between">Espacé</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Vertical</label>
          <select
            value={block.align}
            onChange={(e) => updateBlock(block.id, { align: e.target.value as any })}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
          >
            <option value="start">Début</option>
            <option value="center">Centre</option>
            <option value="end">Fin</option>
            <option value="stretch">Étiré</option>
          </select>
        </div>
      </div>
      <ColorPicker
        label="Fond"
        value={block.background}
        colors={BLOCK_COLORS}
        onChange={(color) => updateBlock(block.id, { background: color })}
      />
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Arrondi</label>
        <div className="flex gap-1">
          {[
            { value: "none", label: "Aucun" },
            { value: "md", label: "Moyen" },
            { value: "lg", label: "Grand" },
            { value: "xl", label: "Très grand" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => updateBlock(block.id, { rounded: value as any })}
              className={`flex-1 py-1.5 text-xs rounded-lg ${
                block.rounded === value
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

// === SPACER PROPERTIES ===
function SpacerProperties({ block }: { block: SpacerBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">Taille</label>
      <div className="flex gap-1">
        {[
          { value: "sm", label: "S" },
          { value: "md", label: "M" },
          { value: "lg", label: "L" },
          { value: "xl", label: "XL" },
        ].map(({ value, label }) => (
          <button
            key={value}
            onClick={() => updateBlock(block.id, { size: value as any })}
            className={`flex-1 py-2 text-sm font-medium rounded-lg ${
              block.size === value
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

// === COLOR PICKER ===
function ColorPicker({
  label,
  value,
  colors,
  onChange,
}: {
  label: string;
  value: string;
  colors: { name: string; value: string }[];
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="flex gap-1.5">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`w-7 h-7 rounded-lg border-2 ${
              value === color.value ? "border-blue-500" : "border-gray-200"
            }`}
            style={{
              backgroundColor: color.value === "transparent" ? "#fff" : color.value,
              backgroundImage:
                color.value === "transparent"
                  ? "linear-gradient(45deg, #e2e8f0 25%, transparent 25%), linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e2e8f0 75%), linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)"
                  : undefined,
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
            }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}
