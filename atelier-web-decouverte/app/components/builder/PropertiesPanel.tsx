"use client";

import { useBuilder } from "../../context/BuilderContext";
import {
  TextBlock,
  HeadingBlock,
  ImageBlock,
  ButtonBlock,
  ContainerBlock,
  SpacerBlock,
  Section,
  BLOCK_COLORS,
  TEXT_COLORS,
  SAMPLE_IMAGES,
  BACKGROUND_COLORS,
} from "../../types/builder";

export default function PropertiesPanel() {
  const {
    state,
    getSelectedBlock,
    getSelectedSection,
    updateBlock,
    updateSection,
    deleteBlock,
    deleteSection,
    moveBlock,
    moveSection,
    duplicateBlock,
    selectBlock,
    selectSection,
    showCodeChange,
  } = useBuilder();

  const selectedBlock = getSelectedBlock();
  const selectedSection = getSelectedSection();

  // Section properties
  if (selectedSection) {
    return (
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">📦</span>
            <h3 className="font-semibold text-gray-800">{selectedSection.title}</h3>
          </div>
          <button
            onClick={() => selectSection(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Section Title */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Titre de la section</label>
          <input
            type="text"
            value={selectedSection.title}
            onChange={(e) => updateSection(selectedSection.id, { title: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Background Color */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Couleur de fond</label>
          <div className="grid grid-cols-4 gap-1.5">
            {BACKGROUND_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() =>
                  updateSection(selectedSection.id, {
                    settings: { ...selectedSection.settings, backgroundColor: color.value },
                  })
                }
                className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                  selectedSection.settings.backgroundColor === color.value
                    ? "border-blue-500 ring-2 ring-offset-1 ring-blue-300"
                    : "border-gray-200"
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Padding */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Espacement vertical</label>
          <div className="flex gap-1">
            {[
              { value: "sm", label: "S" },
              { value: "md", label: "M" },
              { value: "lg", label: "L" },
              { value: "xl", label: "XL" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() =>
                  updateSection(selectedSection.id, {
                    settings: { ...selectedSection.settings, padding: value as any },
                  })
                }
                className={`flex-1 py-2 text-sm font-medium rounded-lg ${
                  selectedSection.settings.padding === value
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Align */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Alignement du contenu</label>
          <div className="flex gap-1">
            {["left", "center", "right"].map((align) => (
              <button
                key={align}
                onClick={() =>
                  updateSection(selectedSection.id, {
                    settings: { ...selectedSection.settings, textAlign: align as any },
                  })
                }
                className={`flex-1 py-2 text-sm rounded-lg ${
                  selectedSection.settings.textAlign === align
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {align === "left" ? "← Gauche" : align === "center" ? "↔ Centre" : "→ Droite"}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          <button
            onClick={() => moveSection(selectedSection.id, "up")}
            className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
            title="Monter"
          >
            ↑ Monter
          </button>
          <button
            onClick={() => moveSection(selectedSection.id, "down")}
            className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
            title="Descendre"
          >
            ↓ Descendre
          </button>
        </div>
        <button
          onClick={() => deleteSection(selectedSection.id)}
          className="w-full py-2 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
        >
          🗑️ Supprimer la section
        </button>
      </div>
    );
  }

  // Block properties
  if (!selectedBlock) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-30">👆</div>
          <p className="text-sm text-gray-500 mb-2">
            Sélectionnez un élément
          </p>
          <p className="text-xs text-gray-400">
            Cliquez sur un bloc ou une section pour modifier ses propriétés
          </p>
        </div>

        {/* Help section */}
        <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <span>💡</span> Astuce
          </h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            Commencez par ajouter une section depuis le panneau "Sections" à gauche,
            puis personnalisez-la ici.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800 capitalize flex items-center gap-2">
          <span className="text-lg">
            {selectedBlock.type === "heading" && "H"}
            {selectedBlock.type === "text" && "T"}
            {selectedBlock.type === "image" && "🖼"}
            {selectedBlock.type === "button" && "▢"}
            {selectedBlock.type === "container" && "☐"}
            {selectedBlock.type === "spacer" && "↕"}
          </span>
          {selectedBlock.type === "heading"
            ? "Titre"
            : selectedBlock.type === "text"
            ? "Texte"
            : selectedBlock.type === "image"
            ? "Image"
            : selectedBlock.type === "button"
            ? "Bouton"
            : selectedBlock.type === "container"
            ? "Conteneur"
            : "Espace"}
        </h3>
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
          onClick={() => moveBlock(selectedBlock.id, "up")}
          className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          title="Monter"
        >
          ↑
        </button>
        <button
          onClick={() => moveBlock(selectedBlock.id, "down")}
          className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          title="Descendre"
        >
          ↓
        </button>
        <button
          onClick={() => duplicateBlock(selectedBlock.id)}
          className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
          title="Dupliquer"
        >
          ⧉
        </button>
        <button
          onClick={() => deleteBlock(selectedBlock.id)}
          className="flex-1 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded-lg"
          title="Supprimer"
        >
          🗑
        </button>
      </div>

      {/* Properties */}
      <div className="space-y-4 pt-2">
        {selectedBlock.type === "text" && (
          <TextProperties block={selectedBlock} onUpdate={updateBlock} onShowCode={showCodeChange} codeEnabled={state.codePopupEnabled} />
        )}
        {selectedBlock.type === "heading" && (
          <HeadingProperties block={selectedBlock} onUpdate={updateBlock} onShowCode={showCodeChange} codeEnabled={state.codePopupEnabled} />
        )}
        {selectedBlock.type === "image" && (
          <ImageProperties block={selectedBlock} onUpdate={updateBlock} onShowCode={showCodeChange} codeEnabled={state.codePopupEnabled} />
        )}
        {selectedBlock.type === "button" && (
          <ButtonProperties block={selectedBlock} onUpdate={updateBlock} onShowCode={showCodeChange} codeEnabled={state.codePopupEnabled} />
        )}
        {selectedBlock.type === "container" && (
          <ContainerProperties block={selectedBlock} onUpdate={updateBlock} />
        )}
        {selectedBlock.type === "spacer" && (
          <SpacerProperties block={selectedBlock} onUpdate={updateBlock} />
        )}
      </div>
    </div>
  );
}

// === TEXT PROPERTIES ===
function TextProperties({
  block,
  onUpdate,
  onShowCode,
  codeEnabled,
}: {
  block: TextBlock;
  onUpdate: (id: string, updates: any) => void;
  onShowCode: (change: any) => void;
  codeEnabled: boolean;
}) {
  const handleContentChange = (content: string) => {
    onUpdate(block.id, { content });
    if (codeEnabled) {
      onShowCode({
        type: "text",
        action: "update",
        elementName: "texte",
        code: `<p className="text-base">\n  ${content.slice(0, 50)}${content.length > 50 ? '...' : ''}\n</p>`,
        explanation: "Le contenu texte est mis à jour en temps réel.",
      });
    }
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Contenu</label>
        <textarea
          value={block.content}
          onChange={(e) => handleContentChange(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Taille</label>
          <select
            value={block.fontSize}
            onChange={(e) => onUpdate(block.id, { fontSize: e.target.value })}
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
            onChange={(e) => onUpdate(block.id, { fontWeight: e.target.value })}
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
              onClick={() => onUpdate(block.id, { textAlign: align })}
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
        onChange={(color) => onUpdate(block.id, { textColor: color })}
      />
    </>
  );
}

// === HEADING PROPERTIES ===
function HeadingProperties({
  block,
  onUpdate,
  onShowCode,
  codeEnabled,
}: {
  block: HeadingBlock;
  onUpdate: (id: string, updates: any) => void;
  onShowCode: (change: any) => void;
  codeEnabled: boolean;
}) {
  const handleContentChange = (content: string) => {
    onUpdate(block.id, { content });
    if (codeEnabled) {
      onShowCode({
        type: "text",
        action: "update",
        elementName: "titre",
        code: `<${block.level} className="text-3xl font-bold">\n  ${content}\n</${block.level}>`,
        explanation: `Les titres utilisent des balises sémantiques (${block.level}) pour la structure HTML.`,
      });
    }
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Contenu</label>
        <input
          type="text"
          value={block.content}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Niveau</label>
        <div className="flex gap-1">
          {[
            { value: "h1", label: "H1", desc: "Principal" },
            { value: "h2", label: "H2", desc: "Section" },
            { value: "h3", label: "H3", desc: "Sous-section" },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onUpdate(block.id, { level: value })}
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
              onClick={() => onUpdate(block.id, { textAlign: align })}
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
        onChange={(color) => onUpdate(block.id, { textColor: color })}
      />
    </>
  );
}

// === IMAGE PROPERTIES ===
function ImageProperties({
  block,
  onUpdate,
  onShowCode,
  codeEnabled,
}: {
  block: ImageBlock;
  onUpdate: (id: string, updates: any) => void;
  onShowCode: (change: any) => void;
  codeEnabled: boolean;
}) {
  const handleImageChange = (src: string, alt: string) => {
    onUpdate(block.id, { src, alt });
    if (codeEnabled) {
      onShowCode({
        type: "component",
        action: "update",
        elementName: "image",
        code: `<img\n  src="${src.slice(0, 40)}..."\n  alt="${alt}"\n  className="rounded-lg"\n/>`,
        explanation: "Les images ont un attribut 'alt' pour l'accessibilité.",
      });
    }
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Image</label>
        <div className="grid grid-cols-3 gap-1.5">
          {SAMPLE_IMAGES.map((img) => (
            <button
              key={img.name}
              onClick={() => handleImageChange(img.url, img.name)}
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
              onClick={() => onUpdate(block.id, { rounded: value })}
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
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <label className="text-xs font-medium text-gray-600">Ombre</label>
        <button
          onClick={() => onUpdate(block.id, { shadow: !block.shadow })}
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
function ButtonProperties({
  block,
  onUpdate,
  onShowCode,
  codeEnabled,
}: {
  block: ButtonBlock;
  onUpdate: (id: string, updates: any) => void;
  onShowCode: (change: any) => void;
  codeEnabled: boolean;
}) {
  const handleTextChange = (text: string) => {
    onUpdate(block.id, { text });
    if (codeEnabled) {
      onShowCode({
        type: "component",
        action: "update",
        elementName: "bouton",
        code: `<button className="px-6 py-3 bg-blue-500 text-white rounded-lg">\n  ${text}\n</button>`,
        explanation: "Le texte du bouton guide l'utilisateur sur l'action à effectuer.",
      });
    }
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Texte</label>
        <input
          type="text"
          value={block.text}
          onChange={(e) => handleTextChange(e.target.value)}
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
              onClick={() => onUpdate(block.id, { variant: value })}
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
              onClick={() => onUpdate(block.id, { size: value })}
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
          { name: "Violet", value: "#7c3aed" },
          { name: "Rose", value: "#ec4899" },
          { name: "Vert", value: "#16a34a" },
          { name: "Gris", value: "#64748b" },
          { name: "Noir", value: "#1e293b" },
        ]}
        onChange={(color) => onUpdate(block.id, { color })}
      />
    </>
  );
}

// === CONTAINER PROPERTIES ===
function ContainerProperties({
  block,
  onUpdate,
}: {
  block: ContainerBlock;
  onUpdate: (id: string, updates: any) => void;
}) {
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
              onClick={() => onUpdate(block.id, { layout: value })}
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
            onChange={(e) => onUpdate(block.id, { gap: e.target.value })}
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
            onChange={(e) => onUpdate(block.id, { padding: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg"
          >
            <option value="none">Aucun</option>
            <option value="sm">Petit</option>
            <option value="md">Moyen</option>
            <option value="lg">Grand</option>
          </select>
        </div>
      </div>
      <ColorPicker
        label="Fond"
        value={block.background}
        colors={BLOCK_COLORS}
        onChange={(color) => onUpdate(block.id, { background: color })}
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
              onClick={() => onUpdate(block.id, { rounded: value })}
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
function SpacerProperties({
  block,
  onUpdate,
}: {
  block: SpacerBlock;
  onUpdate: (id: string, updates: any) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">Taille</label>
      <div className="flex gap-1">
        {[
          { value: "sm", label: "S", height: "16px" },
          { value: "md", label: "M", height: "32px" },
          { value: "lg", label: "L", height: "64px" },
          { value: "xl", label: "XL", height: "96px" },
        ].map(({ value, label, height }) => (
          <button
            key={value}
            onClick={() => onUpdate(block.id, { size: value })}
            className={`flex-1 py-2 text-sm font-medium rounded-lg flex flex-col items-center ${
              block.size === value
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <span>{label}</span>
            <span className="text-xs opacity-60">{height}</span>
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
      <div className="flex gap-1.5 flex-wrap">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
              value === color.value ? "border-blue-500 ring-2 ring-offset-1 ring-blue-300" : "border-gray-200"
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
