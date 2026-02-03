"use client";

import { useBuilder } from "../../context/BuilderContext";
import BlockWrapper from "../blocks/BlockWrapper";
import DropIndicator from "./DropIndicator";

export default function Canvas() {
  const { state, selectBlock, endDrag, updateDropPosition } = useBuilder();
  const { blocks, settings, previewMode, viewMode, dragState } = state;

  const maxWidthClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-6xl",
    xl: "max-w-7xl",
    full: "max-w-none",
  };

  const viewWidthClasses = {
    desktop: "w-full",
    mobile: "w-[375px]",
  };

  const getFontClass = () => {
    switch (settings.fontFamily) {
      case "poppins": return "font-poppins";
      case "space": return "font-space";
      case "mono": return "font-mono";
      default: return "font-sans";
    }
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragState.isDragging && blocks.length === 0) {
      updateDropPosition({ targetId: null, position: "after" });
    }
  };

  const handleDragLeave = () => {
    if (blocks.length === 0) {
      updateDropPosition(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    endDrag();
  };

  const showEmptyDropZone = blocks.length === 0 && dragState.isDragging && dragState.dropPosition?.targetId === null;

  // Mobile frame
  if (viewMode === "mobile" && !previewMode) {
    return (
      <div className="h-full overflow-auto p-4 sm:p-6 bg-gradient-to-br from-zinc-300 to-zinc-400 flex items-start justify-center">
        <div className="relative mt-4">
          {/* Phone frame - iPhone style */}
          <div className="w-[320px] sm:w-[375px] h-[640px] sm:h-[700px] bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden p-3 relative">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-20 flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-800 ring-1 ring-zinc-700" />
            </div>
            {/* Screen */}
            <div className="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
              {/* Status bar */}
              <div className="h-12 flex items-end justify-between px-6 pb-1 bg-inherit relative z-10">
                <span className="text-xs font-semibold" style={{ color: settings.textColor }}>9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: settings.textColor }}>
                    <path d="M12 3a9 9 0 019 9v7a2 2 0 01-2 2H5a2 2 0 01-2-2v-7a9 9 0 019-9z" />
                  </svg>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" style={{ color: settings.textColor }}>
                    <path d="M2 17h20v4H2zM4 13h16v2H4zM6 9h12v2H6zM8 5h8v2H8z" />
                  </svg>
                  <div className="w-6 h-3 bg-green-500 rounded-sm relative">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] w-[3px] h-2 bg-green-500 rounded-r-sm" />
                  </div>
                </div>
              </div>
              {/* Content */}
              <div
                className={`h-[calc(100%-48px)] overflow-auto ${getFontClass()}`}
                style={{ backgroundColor: settings.backgroundColor }}
                onClick={handleCanvasClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="p-3">
                  {renderBlocks()}
                </div>
              </div>
              {/* Home indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-800 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Preview mode
  if (previewMode) {
    // Hide settings navbar if user added a Header block
    const hasHeaderBlock = blocks.some(block => block.type === "header");

    // Find sticky header block for special rendering
    const stickyHeader = blocks.find(block => block.type === "header" && (block as any).sticky);
    const otherBlocks = stickyHeader
      ? blocks.filter(block => block.id !== stickyHeader.id)
      : blocks;

    return (
      <div
        className={`h-full overflow-y-auto ${getFontClass()}`}
        style={{ backgroundColor: settings.backgroundColor }}
      >
        {/* Settings navbar (if no header block) */}
        {settings.showNav && !hasHeaderBlock && (
          <nav
            className="sticky top-0 z-50 border-b"
            style={{
              backgroundColor: settings.backgroundColor,
              borderColor: settings.textColor + "20"
            }}
          >
            <div className={`mx-auto ${maxWidthClasses[settings.maxWidth]} px-6 py-4`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg" style={{ color: settings.textColor }}>
                  {settings.siteName}
                </span>
                <div className="flex gap-6">
                  {settings.navLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      className="text-sm hover:opacity-70"
                      style={{ color: settings.textColor }}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </nav>
        )}

        {/* Sticky header block rendered at top level for proper sticky behavior */}
        {stickyHeader && (
          <div className="sticky top-0 z-50">
            <BlockWrapper key={stickyHeader.id} block={stickyHeader} />
          </div>
        )}

        {/* Main content */}
        <div className={`mx-auto ${maxWidthClasses[settings.maxWidth]} px-6 py-8`}>
          {otherBlocks.map((block) => (
            <BlockWrapper key={block.id} block={block} />
          ))}
        </div>

        {settings.showFooter && blocks.length > 0 && (
          <footer
            className="border-t py-8 mt-12"
            style={{
              backgroundColor: settings.backgroundColor,
              borderColor: settings.textColor + "20"
            }}
          >
            <div className={`mx-auto ${maxWidthClasses[settings.maxWidth]} px-6 text-center`}>
              <p className="text-sm" style={{ color: settings.textColor + "80" }}>
                {settings.siteName} - Créé avec le Site Builder
              </p>
            </div>
          </footer>
        )}
      </div>
    );
  }

  // Desktop edit mode
  return (
    <div
      className="h-full overflow-auto p-6"
      style={{ backgroundColor: "#e4e4e7" }}
      onClick={handleCanvasClick}
    >
      <div
        className={`mx-auto ${viewWidthClasses[viewMode]} min-h-[600px] bg-white shadow-xl rounded-lg ${getFontClass()}`}
        style={{ backgroundColor: settings.backgroundColor }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={`mx-auto ${maxWidthClasses[settings.maxWidth]} p-6`}>
          {renderBlocks()}
        </div>
      </div>
    </div>
  );

  function renderBlocks() {
    if (blocks.length === 0) {
      return (
        <div
          className={`flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-xl transition-all ${
            showEmptyDropZone
              ? "border-blue-500 bg-blue-50"
              : "border-zinc-200 bg-zinc-50"
          }`}
        >
          {showEmptyDropZone ? (
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="text-blue-600 font-medium">Déposez ici</p>
            </div>
          ) : (
            <div className="text-center p-8">
              <div className="text-6xl mb-4 opacity-40">📦</div>
              <h3 className="text-lg font-semibold text-zinc-600 mb-2">
                Page vide
              </h3>
              <p className="text-zinc-400 text-sm max-w-xs mx-auto">
                Glissez des éléments depuis le panneau de gauche ou cliquez dessus pour les ajouter
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-0">
        {/* Drop indicator at the very top */}
        <DropIndicator
          targetId={blocks[0]?.id || null}
          position="before"
          isFirst={true}
        />

        {blocks.map((block, index) => (
          <div key={block.id}>
            <BlockWrapper block={block} />
            {/* Drop indicator after each block */}
            <DropIndicator
              targetId={block.id}
              position="after"
              isLast={index === blocks.length - 1}
            />
          </div>
        ))}
      </div>
    );
  }
}
