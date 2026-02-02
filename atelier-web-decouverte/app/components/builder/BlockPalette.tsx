"use client";

import { useBuilder } from "../../context/BuilderContext";
import { BlockType } from "../../types/builder";

const BLOCKS: { type: BlockType; icon: string; label: string; description: string }[] = [
  { type: "heading", icon: "H", label: "Titre", description: "Ajouter un titre" },
  { type: "text", icon: "T", label: "Texte", description: "Paragraphe de texte" },
  { type: "image", icon: "🖼", label: "Image", description: "Ajouter une image" },
  { type: "button", icon: "▢", label: "Bouton", description: "Bouton cliquable" },
  { type: "container", icon: "☐", label: "Conteneur", description: "Grouper des éléments" },
  { type: "spacer", icon: "↕", label: "Espace", description: "Ajouter de l'espace" },
];

export default function BlockPalette() {
  const { setDraggedBlockType, addBlock, showCodeChange, state } = useBuilder();

  const handleDragStart = (e: React.DragEvent, type: BlockType) => {
    setDraggedBlockType(type);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => {
    setDraggedBlockType(null);
  };

  const handleClick = (type: BlockType) => {
    addBlock(type);

    // Show code popup
    if (state.codePopupEnabled) {
      const blockInfo = BLOCKS.find((b) => b.type === type);
      let code = "";
      let explanation = "";

      switch (type) {
        case "heading":
          code = `<h2 className="text-3xl font-bold">\n  Titre de section\n</h2>`;
          explanation = "Les titres utilisent les balises h1, h2, h3 pour la hiérarchie du contenu.";
          break;
        case "text":
          code = `<p className="text-base text-gray-700">\n  Votre texte ici...\n</p>`;
          explanation = "Les paragraphes sont créés avec la balise <p> et stylés avec Tailwind CSS.";
          break;
        case "image":
          code = `<img\n  src="image.jpg"\n  alt="Description"\n  className="rounded-lg shadow-lg"\n/>`;
          explanation = "Les images sont des éléments <img> avec des attributs src et alt.";
          break;
        case "button":
          code = `<button className="px-6 py-3 bg-blue-500 text-white rounded-lg">\n  Cliquez ici\n</button>`;
          explanation = "Les boutons sont stylés avec des classes Tailwind pour les couleurs et l'espacement.";
          break;
        case "container":
          code = `<div className="flex flex-col gap-4 p-6">\n  {/* Éléments enfants */}\n</div>`;
          explanation = "Les conteneurs utilisent Flexbox ou CSS Grid pour organiser leur contenu.";
          break;
        case "spacer":
          code = `<div className="h-8" />\n/* Ou avec Tailwind: py-8 */`;
          explanation = "Les espaceurs créent de l'espace vertical entre les éléments.";
          break;
      }

      showCodeChange({
        type: "component",
        action: "add",
        elementName: blockInfo?.label || type,
        code,
        explanation,
      });
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Blocs disponibles
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {BLOCKS.map(({ type, icon, label, description }) => (
          <div
            key={type}
            draggable
            onDragStart={(e) => handleDragStart(e, type)}
            onDragEnd={handleDragEnd}
            onClick={() => handleClick(type)}
            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl cursor-grab hover:border-blue-400 hover:bg-blue-50 hover:shadow-md active:cursor-grabbing transition-all select-none group"
          >
            <span className="text-2xl mb-1 text-gray-500 group-hover:text-blue-500 group-hover:scale-110 transition-all">
              {icon}
            </span>
            <span className="text-xs font-medium text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      {/* Help text */}
      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <p className="text-xs text-gray-500 text-center">
          💡 Cliquez ou glissez-déposez pour ajouter un bloc
        </p>
      </div>
    </div>
  );
}
