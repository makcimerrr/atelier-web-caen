"use client";

import { useState } from "react";
import { BuilderProvider, useBuilder } from "./context/BuilderContext";
import Canvas from "./components/builder/Canvas";
import BlockPalette from "./components/builder/BlockPalette";
import PropertiesPanel from "./components/builder/PropertiesPanel";
import SectionsPanel from "./components/builder/SectionsPanel";
import StylePanel from "./components/builder/StylePanel";
import SettingsPanel from "./components/builder/SettingsPanel";
import CodePopup from "./components/builder/CodePopup";
import CommentsPanel from "./components/comments/CommentsPanel";

export default function Home() {
  return (
    <BuilderProvider>
      <Editor />
    </BuilderProvider>
  );
}

function Editor() {
  const { state, togglePreview, setViewMode, setActivePanel, clearCanvas } = useBuilder();
  const [showComments, setShowComments] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const panels = [
    { id: "sections", label: "Sections", icon: "📦" },
    { id: "blocks", label: "Blocs", icon: "🧩" },
    { id: "style", label: "Style", icon: "🎨" },
    { id: "settings", label: "Réglages", icon: "⚙️" },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-100 overflow-hidden">
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">
            <div className="relative h-32 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }} />
              </div>
              <h1 className="text-4xl font-bold text-white relative">🚀 Site Builder</h1>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Bienvenue dans l'atelier !
              </h2>
              <p className="text-gray-600 mb-6">
                Construis ton propre site web en quelques clics. Aucune connaissance en code requise !
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">1</span>
                  <span>Ajoute des sections et des blocs</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">2</span>
                  <span>Personnalise les couleurs et le style</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">3</span>
                  <span>Découvre le code derrière chaque action</span>
                </div>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all"
              >
                Commencer 🎉
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            Z
          </div>
          <div>
            <h1 className="font-bold text-gray-800 leading-none">Zone01 Site Builder</h1>
            <p className="text-xs text-gray-400">Atelier découverte web</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode("desktop")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              state.viewMode === "desktop"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🖥️ Desktop
          </button>
          <button
            onClick={() => setViewMode("mobile")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              state.viewMode === "mobile"
                ? "bg-white text-gray-800 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📱 Mobile
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearCanvas}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Recommencer"
          >
            🗑️ Vider
          </button>
          <button
            onClick={() => setShowComments(true)}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
          >
            💬 Commentaires
          </button>
          <button
            onClick={togglePreview}
            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
              state.previewMode
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:scale-105"
            }`}
          >
            {state.previewMode ? "✏️ Éditer" : "👁️ Aperçu"}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        {!state.previewMode && (
          <aside className="w-72 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            {/* Panel Tabs */}
            <div className="flex-shrink-0 flex border-b border-gray-200">
              {panels.map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id as any)}
                  className={`flex-1 py-3 text-center transition-all ${
                    state.activePanel === panel.id
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                  title={panel.label}
                >
                  <span className="text-lg">{panel.icon}</span>
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {state.activePanel === "sections" && <SectionsPanel />}
              {state.activePanel === "blocks" && <BlockPalette />}
              {state.activePanel === "style" && <StylePanel />}
              {state.activePanel === "settings" && <SettingsPanel />}
            </div>
          </aside>
        )}

        {/* Canvas */}
        <main className="flex-1 overflow-hidden bg-slate-200">
          <Canvas />
        </main>

        {/* Right Sidebar - Properties */}
        {!state.previewMode && (
          <aside className="w-72 flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto custom-scrollbar">
            <PropertiesPanel />
          </aside>
        )}
      </div>

      {/* Preview Mode Banner */}
      {state.previewMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-4 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">Mode aperçu</span>
            </div>
            <button
              onClick={togglePreview}
              className="px-4 py-1.5 bg-white text-slate-900 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
            >
              Retour à l'édition
            </button>
          </div>
        </div>
      )}

      {/* Code Popup */}
      <CodePopup />

      {/* Comments Panel */}
      <CommentsPanel isOpen={showComments} onClose={() => setShowComments(false)} />

      {/* Responsive indicator */}
      {state.viewMode === "mobile" && !state.previewMode && (
        <div className="fixed bottom-6 left-6 z-40">
          <div className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
            <span>📱</span>
            Vue mobile (375px)
          </div>
        </div>
      )}
    </div>
  );
}
