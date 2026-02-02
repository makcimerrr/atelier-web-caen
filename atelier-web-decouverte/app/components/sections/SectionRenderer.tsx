"use client";

import { useBuilder } from "../../context/BuilderContext";
import { Section, Block } from "../../types/builder";
import BlockRenderer from "../blocks/BlockRenderer";

interface SectionRendererProps {
  section: Section;
}

export default function SectionRenderer({ section }: SectionRendererProps) {
  const { state, selectSection, updateSection } = useBuilder();
  const isSelected = state.selectedSectionId === section.id;
  const isPreview = state.previewMode;

  if (!section.visible && !isPreview) {
    return (
      <div
        className="py-4 px-6 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer opacity-50 hover:opacity-75 transition-opacity"
        onClick={() => selectSection(section.id)}
      >
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <span>👁️‍🗨️</span>
          <span className="text-sm font-medium">{section.title} (masquée)</span>
        </div>
      </div>
    );
  }

  if (!section.visible && isPreview) {
    return null;
  }

  const paddingClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-16",
    xl: "py-24",
  };

  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    selectSection(section.id);
  };

  return (
    <section
      className={`relative w-full ${paddingClasses[section.settings.padding]} ${alignClasses[section.settings.textAlign]} transition-all ${
        !isPreview
          ? `cursor-pointer ${
              isSelected
                ? "ring-2 ring-blue-500 ring-offset-2"
                : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1"
            }`
          : ""
      }`}
      style={{ backgroundColor: section.settings.backgroundColor }}
      onClick={handleClick}
    >
      {/* Section label */}
      {!isPreview && isSelected && (
        <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10 shadow-lg">
          {section.title}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`space-y-6 ${section.settings.textAlign === 'center' ? 'flex flex-col items-center' : ''}`}>
          {section.blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} />
          ))}
        </div>
      </div>
    </section>
  );
}
