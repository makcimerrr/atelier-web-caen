"use client";

import { useBuilder } from "../../context/BuilderContext";
import { SECTION_TYPES, TEMPLATES, Section } from "../../types/builder";

export default function SectionsPanel() {
  const {
    state,
    addSection,
    deleteSection,
    moveSection,
    toggleSectionVisibility,
    selectSection,
    loadTemplate,
  } = useBuilder();

  return (
    <div className="p-4 space-y-6">
      {/* Templates */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Templates rapides
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => loadTemplate(template.id)}
              className="flex flex-col items-center p-3 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
            >
              <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                {template.icon}
              </span>
              <span className="text-xs font-medium text-gray-700">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add sections */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Ajouter une section
        </h3>
        <div className="space-y-2">
          {SECTION_TYPES.map((sectionType) => (
            <button
              key={sectionType.type}
              onClick={() => addSection(sectionType.type)}
              className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {sectionType.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-800 text-sm">{sectionType.name}</div>
                <div className="text-xs text-gray-500 truncate">{sectionType.description}</div>
              </div>
              <span className="text-gray-300 group-hover:text-blue-400">+</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current sections */}
      {state.sections.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Sections de votre page ({state.sections.length})
          </h3>
          <div className="space-y-2">
            {state.sections.map((section, index) => (
              <SectionItem
                key={section.id}
                section={section}
                index={index}
                totalSections={state.sections.length}
                isSelected={state.selectedSectionId === section.id}
                onSelect={() => selectSection(section.id)}
                onMoveUp={() => moveSection(section.id, "up")}
                onMoveDown={() => moveSection(section.id, "down")}
                onToggleVisibility={() => toggleSectionVisibility(section.id)}
                onDelete={() => deleteSection(section.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface SectionItemProps {
  section: Section;
  index: number;
  totalSections: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onToggleVisibility: () => void;
  onDelete: () => void;
}

function SectionItem({
  section,
  index,
  totalSections,
  isSelected,
  onSelect,
  onMoveUp,
  onMoveDown,
  onToggleVisibility,
  onDelete,
}: SectionItemProps) {
  const sectionInfo = SECTION_TYPES.find((s) => s.type === section.type);

  return (
    <div
      className={`p-3 rounded-xl border transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-300"
      } ${!section.visible ? "opacity-50" : ""}`}
    >
      <div className="flex items-center gap-2">
        {/* Icon and title */}
        <button
          onClick={onSelect}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <span className="text-lg">{sectionInfo?.icon}</span>
          <span className={`font-medium text-sm ${isSelected ? "text-blue-700" : "text-gray-700"}`}>
            {section.title}
          </span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Monter"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === totalSections - 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Descendre"
          >
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={onToggleVisibility}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            title={section.visible ? "Masquer" : "Afficher"}
          >
            {section.visible ? (
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"
            title="Supprimer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
