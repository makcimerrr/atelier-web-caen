"use client";

import { useState, useEffect } from "react";
import { BuilderProvider, useBuilder } from "./context/BuilderContext";
import Canvas from "./components/builder/Canvas";
import ElementsPanel from "./components/builder/ElementsPanel";
import LayersPanel from "./components/builder/LayersPanel";
import PropertiesPanel from "./components/builder/PropertiesPanel";
import SettingsPanel from "./components/builder/SettingsPanel";
import CodePopup from "./components/builder/CodePopup";
import CommentsPanel from "./components/comments/CommentsPanel";
import SaveModal from "./components/builder/SaveModal";

export default function Home() {
  return (
    <BuilderProvider>
      <Editor />
    </BuilderProvider>
  );
}

function Editor() {
  const { state, togglePreview, setViewMode, setActivePanel, clearCanvas, undo, redo, canUndo, canRedo, loadConfiguration } = useBuilder();
  const [showComments, setShowComments] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Load configuration from localStorage (when coming from admin)
  useEffect(() => {
    const savedConfig = localStorage.getItem("loadConfig");
    if (savedConfig) {
      try {
        const { blocks, settings } = JSON.parse(savedConfig);
        loadConfiguration(blocks, settings);
        localStorage.removeItem("loadConfig");
      } catch (err) {
        console.error("Error loading saved config:", err);
      }
    }
  }, [loadConfiguration]);

  // Load example configuration
  const loadExample = async () => {
    try {
      const res = await fetch("/api/example");
      if (res.ok) {
        const data = await res.json();
        loadConfiguration(data.blocks, data.settings);
        setShowWelcome(false);
      }
    } catch (error) {
      console.error("Error loading example:", error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const panels = [
    { id: "elements", label: "Éléments", icon: "🧩" },
    { id: "layers", label: "Calques", icon: "📄" },
    { id: "settings", label: "Site", icon: "⚙️" },
  ];

  return (
    <div className="h-screen flex flex-col bg-zinc-100 overflow-hidden">
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in">
            <div className="relative h-28 bg-blue-500 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0" style={{
                  backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }} />
              </div>
              <h1 className="text-3xl font-bold text-white relative">Site Builder</h1>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-zinc-800 mb-2">
                Bienvenue !
              </h2>
              <p className="text-zinc-600 mb-5">
                Construis ton propre site web en quelques clics. Glisse, dépose, personnalise !
              </p>
              <div className="space-y-2.5 mb-6">
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">1</span>
                  <span>Glisse des éléments sur la page</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">2</span>
                  <span>Personnalise le contenu et les couleurs</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-600">
                  <span className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">3</span>
                  <span>Prévisualise ton site en temps réel</span>
                </div>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="w-full py-3.5 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors"
              >
                Commencer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <header className="flex-shrink-0 h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
            S
          </div>
          <div>
            <h1 className="font-bold text-zinc-800 leading-none">Site Builder</h1>
            <p className="text-xs text-zinc-400">Atelier découverte web</p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg">
          {[
            { mode: "desktop", icon: "🖥️", label: "Desktop" },
            { mode: "mobile", icon: "📱", label: "Mobile" },
          ].map(({ mode, icon, label }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode as "desktop" | "mobile")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                state.viewMode === mode
                  ? "bg-white text-zinc-800 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-700"
              }`}
            >
              <span>{icon}</span>
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-all ${
                canUndo
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-300 cursor-not-allowed"
              }`}
              title="Annuler (Cmd+Z)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-all ${
                canRedo
                  ? "text-zinc-600 hover:bg-zinc-100"
                  : "text-zinc-300 cursor-not-allowed"
              }`}
              title="Refaire (Cmd+Shift+Z)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
              </svg>
            </button>
          </div>

          <button
            onClick={loadExample}
            className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-purple-500 hover:bg-purple-50 rounded-lg transition-all flex items-center gap-1.5"
            title="Charger un site exemple"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <span className="hidden sm:inline">Exemple</span>
          </button>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1.5"
            title="Recommencer à zéro"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-3 py-2 text-sm font-medium bg-green-500 text-white hover:bg-green-600 rounded-lg transition-all flex items-center gap-1.5"
            title="Enregistrer mon site"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            <span className="hidden sm:inline">Enregistrer</span>
          </button>
          <button
            onClick={() => setShowComments(true)}
            className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
          >
            💬
          </button>
          <button
            onClick={togglePreview}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              state.previewMode
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {state.previewMode ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Éditer
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Aperçu
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tools */}
        {!state.previewMode && (
          <aside className="w-72 flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col overflow-hidden">
            {/* Panel Tabs */}
            <div className="flex-shrink-0 flex border-b border-zinc-200">
              {panels.map((panel) => (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id as typeof state.activePanel)}
                  className={`flex-1 py-3 text-center transition-all ${
                    state.activePanel === panel.id
                      ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                      : "text-zinc-500 hover:bg-zinc-50"
                  }`}
                  title={panel.label}
                >
                  <span className="text-lg">{panel.icon}</span>
                </button>
              ))}
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {state.activePanel === "elements" && <ElementsPanel />}
              {state.activePanel === "layers" && <LayersPanel />}
              {state.activePanel === "settings" && <SettingsPanel />}
            </div>
          </aside>
        )}

        {/* Canvas */}
        <main className="flex-1 overflow-hidden">
          <Canvas />
        </main>

        {/* Right Sidebar - Properties */}
        {!state.previewMode && (
          <aside className="w-72 flex-shrink-0 bg-white border-l border-zinc-200 overflow-y-auto custom-scrollbar">
            <PropertiesPanel />
          </aside>
        )}
      </div>

      {/* Preview Mode Banner */}
      {state.previewMode && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-4 px-5 py-2.5 bg-zinc-900 text-white rounded-full shadow-2xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium">Mode aperçu</span>
            </div>
            <button
              onClick={togglePreview}
              className="px-3 py-1 bg-white text-zinc-900 rounded-full text-sm font-bold hover:bg-zinc-100 transition-colors"
            >
              Retour
            </button>
          </div>
        </div>
      )}

      {/* View mode indicator */}
      {state.viewMode === "mobile" && !state.previewMode && (
        <div className="fixed bottom-6 left-6 z-40">
          <div className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium shadow-lg flex items-center gap-2">
            <span>📱</span>
            Vue mobile (375px)
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-800 mb-2">Tout effacer ?</h3>
              <p className="text-sm text-zinc-500 mb-6">
                Tu vas supprimer tous les éléments de ta page. Cette action est irréversible.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 px-4 bg-zinc-100 text-zinc-700 font-medium rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    clearCanvas();
                    setShowResetModal(false);
                  }}
                  className="flex-1 py-2.5 px-4 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                >
                  Tout effacer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Popup */}
      <CodePopup />

      {/* Comments Panel */}
      <CommentsPanel isOpen={showComments} onClose={() => setShowComments(false)} />

      {/* Save Modal */}
      <SaveModal isOpen={showSaveModal} onClose={() => setShowSaveModal(false)} />
    </div>
  );
}
