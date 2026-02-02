"use client";

import { useBuilder } from "../../context/BuilderContext";
import BlockRenderer from "../blocks/BlockRenderer";
import SectionRenderer from "../sections/SectionRenderer";
import SiteNavbar from "../site/SiteNavbar";
import SiteFooter from "../site/SiteFooter";

export default function Canvas() {
  const { state, selectBlock, selectSection, setDraggedBlockType, addBlock } = useBuilder();
  const { canvas, sections, settings, previewMode, viewMode } = state;

  const handleDragOver = (e: React.DragEvent) => {
    if (state.draggedBlockType) {
      e.preventDefault();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (state.draggedBlockType) {
      addBlock(state.draggedBlockType);
      setDraggedBlockType(null);
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
      selectSection(null);
    }
  };

  const getFontClass = () => {
    switch (settings.fontFamily) {
      case "poppins":
        return "font-poppins";
      case "space":
        return "font-space";
      case "mono":
        return "font-mono";
      default:
        return "font-sans";
    }
  };

  const getSpacingClass = () => {
    switch (settings.spacing) {
      case "compact":
        return "space-y-2";
      case "large":
        return "space-y-8";
      default:
        return "space-y-4";
    }
  };

  // Mobile frame wrapper
  const mobileWrapper = viewMode === "mobile" ? (
    <div className="flex items-center justify-center min-h-full py-8 px-4 bg-slate-200">
      <div className="relative mobile-frame w-[375px] h-[667px] overflow-hidden bg-white">
        <div className="absolute inset-0 overflow-y-auto custom-scrollbar pt-6">
          {renderContent()}
        </div>
      </div>
    </div>
  ) : null;

  function renderContent() {
    const hasContent = sections.length > 0 || canvas.blocks.length > 0;

    return (
      <div
        className={`min-h-full ${getFontClass()}`}
        style={{
          backgroundColor: settings.backgroundColor,
          color: settings.textColor,
        }}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Navbar */}
        {settings.showNav && <SiteNavbar />}

        {/* Main content */}
        <main className={previewMode ? "" : "min-h-[400px]"}>
          {/* Sections */}
          {sections.length > 0 && (
            <div className="w-full">
              {sections.map((section) => (
                <SectionRenderer key={section.id} section={section} />
              ))}
            </div>
          )}

          {/* Legacy blocks (if any) */}
          {canvas.blocks.length > 0 && (
            <div className={`max-w-5xl mx-auto px-4 py-8 ${getSpacingClass()}`}>
              {canvas.blocks.map((block) => (
                <BlockRenderer key={block.id} block={block} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!hasContent && !previewMode && (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
              <div
                className={`w-full max-w-2xl border-2 border-dashed rounded-2xl transition-colors p-12 ${
                  state.draggedBlockType
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className="text-center">
                  <div className="text-6xl mb-6 opacity-40">🎨</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-3">
                    Commencez à créer !
                  </h3>
                  <p className="text-gray-400 max-w-md mx-auto mb-6">
                    Utilisez le panneau de gauche pour ajouter des sections prédéfinies ou des blocs personnalisés.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500">
                    <span className="px-3 py-1.5 bg-white rounded-full border">
                      🚀 Hero
                    </span>
                    <span className="px-3 py-1.5 bg-white rounded-full border">
                      ✨ Fonctionnalités
                    </span>
                    <span className="px-3 py-1.5 bg-white rounded-full border">
                      📢 Appel à l'action
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        {settings.showFooter && hasContent && <SiteFooter />}
      </div>
    );
  }

  if (viewMode === "mobile") {
    return mobileWrapper;
  }

  return (
    <div className="min-h-full overflow-y-auto custom-scrollbar">
      {renderContent()}
    </div>
  );
}
