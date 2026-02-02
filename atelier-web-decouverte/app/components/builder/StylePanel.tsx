"use client";

import { useBuilder } from "../../context/BuilderContext";
import { PRIMARY_COLORS, BACKGROUND_COLORS, FONTS } from "../../types/builder";

export default function StylePanel() {
  const { state, updateSettings, showCodeChange } = useBuilder();
  const { settings } = state;

  const handleColorChange = (colorType: string, color: string, colorName: string) => {
    updateSettings({ [colorType]: color });

    // Show code popup
    if (state.codePopupEnabled) {
      showCodeChange({
        type: "style",
        action: "update",
        elementName: colorType === "primaryColor" ? "couleur principale" :
                     colorType === "backgroundColor" ? "couleur de fond" :
                     colorType === "textColor" ? "couleur du texte" : "couleur",
        code: `/* Tailwind CSS */\n.${colorType === "primaryColor" ? "bg-primary" : colorType === "backgroundColor" ? "bg-page" : "text-main"} {\n  ${colorType === "textColor" ? "color" : "background-color"}: ${color};\n}\n\n/* CSS Variable */\n:root {\n  --${colorType.replace("Color", "")}: ${color}; /* ${colorName} */\n}`,
        explanation: colorType === "primaryColor"
          ? "La couleur principale est utilisée pour les boutons, liens et accents."
          : colorType === "backgroundColor"
          ? "La couleur de fond définit l'arrière-plan de votre page."
          : "La couleur du texte s'applique à tous les paragraphes et titres.",
      });
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Primary Color */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Couleur principale
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {PRIMARY_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange("primaryColor", color.value, color.name)}
              className={`aspect-square rounded-xl border-2 transition-all hover:scale-105 ${
                settings.primaryColor === color.value
                  ? "border-gray-800 ring-2 ring-offset-2 ring-gray-400"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Utilisée pour les boutons et les accents
        </p>
      </div>

      {/* Background Color */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Couleur de fond
        </h3>
        <div className="grid grid-cols-4 gap-2">
          {BACKGROUND_COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange("backgroundColor", color.value, color.name)}
              className={`aspect-square rounded-xl border-2 transition-all hover:scale-105 ${
                settings.backgroundColor === color.value
                  ? "border-gray-800 ring-2 ring-offset-2 ring-gray-400"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Text Color */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Couleur du texte
        </h3>
        <div className="flex gap-2">
          {[
            { name: "Noir", value: "#1e293b" },
            { name: "Gris foncé", value: "#475569" },
            { name: "Gris", value: "#64748b" },
            { name: "Blanc", value: "#ffffff" },
          ].map((color) => (
            <button
              key={color.value}
              onClick={() => handleColorChange("textColor", color.value, color.name)}
              className={`w-10 h-10 rounded-xl border-2 transition-all hover:scale-105 ${
                settings.textColor === color.value
                  ? "border-blue-500 ring-2 ring-offset-2 ring-blue-300"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Font Family */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Police de caractères
        </h3>
        <div className="space-y-2">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => {
                updateSettings({ fontFamily: font.id as any });
                if (state.codePopupEnabled) {
                  showCodeChange({
                    type: "style",
                    action: "update",
                    elementName: "police",
                    code: `/* Tailwind CSS */\n<body className="${font.class}">\n  {/* Contenu */}\n</body>\n\n/* CSS */\nbody {\n  font-family: "${font.name}", sans-serif;\n}`,
                    explanation: `La police "${font.name}" sera appliquée à tout le texte de votre site.`,
                  });
                }
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                settings.fontFamily === font.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <span className={`font-medium ${font.class}`}>{font.name}</span>
              <span className={`text-lg text-gray-400 ${font.class}`}>{font.preview}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Spacing */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Espacement
        </h3>
        <div className="flex gap-2">
          {[
            { id: "compact", name: "Compact", icon: "▫️" },
            { id: "normal", name: "Normal", icon: "◻️" },
            { id: "large", name: "Large", icon: "⬜" },
          ].map((spacing) => (
            <button
              key={spacing.id}
              onClick={() => updateSettings({ spacing: spacing.id as any })}
              className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all ${
                settings.spacing === spacing.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              }`}
            >
              <span className="text-xl">{spacing.icon}</span>
              <span className="text-xs font-medium text-gray-600">{spacing.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preview box */}
      <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-400 mb-2">Aperçu</div>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: settings.backgroundColor }}
        >
          <div
            className="text-lg font-bold mb-2"
            style={{ color: settings.primaryColor }}
          >
            Titre
          </div>
          <div
            className="text-sm mb-3"
            style={{ color: settings.textColor }}
          >
            Texte de démonstration
          </div>
          <div
            className="inline-block px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: settings.primaryColor }}
          >
            Bouton
          </div>
        </div>
      </div>
    </div>
  );
}
