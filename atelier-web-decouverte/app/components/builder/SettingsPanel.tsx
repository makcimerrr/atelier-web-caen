"use client";

import { useBuilder } from "../../context/BuilderContext";
import { PRIMARY_COLORS, BACKGROUND_COLORS, FONTS } from "../../types/builder";

export default function SettingsPanel() {
  const {
    state,
    updateSettings,
    addNavLink,
    updateNavLink,
    deleteNavLink,
    toggleCodePopup,
  } = useBuilder();
  const { settings } = state;

  return (
    <div className="p-4 space-y-6">
      {/* Site Identity */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Identité du site
        </h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Nom du site
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => updateSettings({ siteName: e.target.value })}
              className="w-full px-3 py-2.5 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Mon Site"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Description
            </label>
            <textarea
              value={settings.siteDescription}
              onChange={(e) => updateSettings({ siteDescription: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Description de votre site..."
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Couleurs
        </h3>
        <div className="space-y-4">
          {/* Primary Color */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Couleur principale
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRIMARY_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateSettings({ primaryColor: color.value })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    settings.primaryColor === color.value
                      ? "border-zinc-900 ring-2 ring-offset-1 ring-zinc-400"
                      : "border-zinc-200"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Couleur de fond
            </label>
            <div className="flex flex-wrap gap-1.5">
              {BACKGROUND_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateSettings({ backgroundColor: color.value })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    settings.backgroundColor === color.value
                      ? "border-zinc-900 ring-2 ring-offset-1 ring-zinc-400"
                      : "border-zinc-200"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Text Color */}
          <div>
            <label className="block text-xs font-medium text-zinc-500 mb-1.5">
              Couleur du texte
            </label>
            <div className="flex gap-1.5">
              {[
                { name: "Noir", value: "#18181b" },
                { name: "Gris foncé", value: "#3f3f46" },
                { name: "Gris", value: "#71717a" },
                { name: "Blanc", value: "#ffffff" },
              ].map((color) => (
                <button
                  key={color.value}
                  onClick={() => updateSettings({ textColor: color.value })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 ${
                    settings.textColor === color.value
                      ? "border-blue-500 ring-2 ring-offset-1 ring-blue-300"
                      : "border-zinc-200"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Typographie
        </h3>
        <div className="space-y-2">
          {FONTS.map((font) => (
            <button
              key={font.id}
              onClick={() => updateSettings({ fontFamily: font.id as typeof settings.fontFamily })}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                settings.fontFamily === font.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-zinc-200 hover:border-zinc-300 bg-white"
              }`}
            >
              <span className={`font-medium ${font.class}`}>{font.name}</span>
              <span className={`text-lg text-zinc-400 ${font.class}`}>Aa</span>
            </button>
          ))}
        </div>
      </div>

      {/* Layout */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Mise en page
        </h3>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">
            Largeur maximum
          </label>
          <div className="flex gap-1">
            {[
              { value: "sm", label: "S" },
              { value: "md", label: "M" },
              { value: "lg", label: "L" },
              { value: "xl", label: "XL" },
              { value: "full", label: "100%" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => updateSettings({ maxWidth: value as typeof settings.maxWidth })}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  settings.maxWidth === value
                    ? "bg-blue-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Navigation
          </h3>
          <ToggleSwitch
            checked={settings.showNav}
            onChange={(checked) => updateSettings({ showNav: checked })}
          />
        </div>

        {settings.showNav && (
          <div className="space-y-2">
            {settings.navLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-1.5 p-2 bg-zinc-50 border border-zinc-200 rounded-lg min-w-0"
              >
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateNavLink(link.id, { label: e.target.value })}
                  className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-zinc-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Texte"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateNavLink(link.id, { href: e.target.value })}
                  className="w-16 flex-shrink-0 px-2 py-1.5 text-sm border border-zinc-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#"
                />
                <button
                  onClick={() => deleteNavLink(link.id)}
                  className="p-1 flex-shrink-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  disabled={settings.navLinks.length <= 1}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={addNavLink}
              className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg border border-dashed border-blue-200 transition-colors"
            >
              + Ajouter un lien
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
        <div>
          <div className="font-medium text-zinc-700 text-sm">Pied de page</div>
          <div className="text-xs text-zinc-500">Afficher le footer</div>
        </div>
        <ToggleSwitch
          checked={settings.showFooter}
          onChange={(checked) => updateSettings({ showFooter: checked })}
        />
      </div>

      {/* Code Popup */}
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div>
          <div className="font-medium text-blue-700 text-sm flex items-center gap-1.5">
            <span>💡</span> Pop-ups code
          </div>
          <div className="text-xs text-blue-600">Voir le code HTML/CSS</div>
        </div>
        <ToggleSwitch
          checked={state.codePopupEnabled}
          onChange={toggleCodePopup}
        />
      </div>

      {/* Preview colors */}
      <div className="p-4 rounded-lg border border-zinc-200">
        <div className="text-xs text-zinc-400 mb-2">Aperçu des couleurs</div>
        <div
          className="p-4 rounded-lg"
          style={{ backgroundColor: settings.backgroundColor }}
        >
          <div
            className="text-lg font-bold mb-1"
            style={{ color: settings.primaryColor }}
          >
            {settings.siteName}
          </div>
          <div
            className="text-sm mb-3"
            style={{ color: settings.textColor }}
          >
            Texte de démonstration
          </div>
          <button
            className="px-4 py-2 rounded-lg text-white text-sm font-medium"
            style={{ backgroundColor: settings.primaryColor }}
          >
            Bouton
          </button>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? "bg-blue-500" : "bg-zinc-300"
      }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}
