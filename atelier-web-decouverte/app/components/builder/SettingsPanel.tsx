"use client";

import { useBuilder } from "../../context/BuilderContext";

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
      {/* Site Name */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Nom du site
        </h3>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => updateSettings({ siteName: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          placeholder="Mon Super Site"
        />
      </div>

      {/* Navbar Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <div className="font-medium text-gray-800">Barre de navigation</div>
          <div className="text-xs text-gray-500">Afficher le menu en haut</div>
        </div>
        <button
          onClick={() => updateSettings({ showNav: !settings.showNav })}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            settings.showNav ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              settings.showNav ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Navigation Links */}
      {settings.showNav && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Liens de navigation
            </h3>
            <button
              onClick={addNavLink}
              className="text-xs font-medium text-blue-500 hover:text-blue-600"
            >
              + Ajouter
            </button>
          </div>
          <div className="space-y-2">
            {settings.navLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-xl"
              >
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateNavLink(link.id, { label: e.target.value })}
                  className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Texte du lien"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateNavLink(link.id, { href: e.target.value })}
                  className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="#section"
                />
                <button
                  onClick={() => deleteNavLink(link.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={settings.navLinks.length <= 1}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <div className="font-medium text-gray-800">Pied de page</div>
          <div className="text-xs text-gray-500">Afficher le footer en bas</div>
        </div>
        <button
          onClick={() => updateSettings({ showFooter: !settings.showFooter })}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            settings.showFooter ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              settings.showFooter ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Code Popup Toggle */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
        <div>
          <div className="font-medium text-gray-800 flex items-center gap-2">
            <span>💡</span> Pop-ups pédagogiques
          </div>
          <div className="text-xs text-gray-500">Voir le code à chaque modification</div>
        </div>
        <button
          onClick={toggleCodePopup}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            state.codePopupEnabled ? "bg-purple-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              state.codePopupEnabled ? "left-7" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Info box */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-3">
          <span className="text-xl">ℹ️</span>
          <div>
            <div className="font-medium text-blue-800 text-sm">Astuce</div>
            <p className="text-xs text-blue-600 mt-1">
              Toutes les modifications sont visibles en temps réel dans l'aperçu.
              Activez les pop-ups pédagogiques pour comprendre le code derrière chaque action !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
