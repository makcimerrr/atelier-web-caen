"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import {
  EditorState,
  Block,
  BlockType,
  createBlock,
  ContainerBlock,
  SiteSettings,
  NavLink,
  Section,
  createSection,
  CodeChange,
} from "../types/builder";

const defaultNavLinks: NavLink[] = [
  { id: "nav-1", label: "Accueil", href: "#" },
  { id: "nav-2", label: "Services", href: "#services" },
  { id: "nav-3", label: "Contact", href: "#contact" },
];

const defaultSettings: SiteSettings = {
  siteName: "Mon Super Site",
  primaryColor: "#2563eb",
  backgroundColor: "#ffffff",
  textColor: "#1e293b",
  buttonColor: "#2563eb",
  fontFamily: "inter",
  spacing: "normal",
  navLinks: defaultNavLinks,
  showNav: true,
  showFooter: true,
};

const initialState: EditorState = {
  canvas: {
    blocks: [],
    backgroundColor: "#ffffff",
    maxWidth: "lg",
  },
  sections: [],
  settings: defaultSettings,
  selectedBlockId: null,
  selectedSectionId: null,
  draggedBlockType: null,
  previewMode: false,
  viewMode: "desktop",
  activePanel: "blocks",
  showCodePopup: false,
  lastCodeChange: null,
  codePopupEnabled: true,
};

interface BuilderContextType {
  state: EditorState;
  // Canvas
  setBackgroundColor: (color: string) => void;
  setMaxWidth: (width: "sm" | "md" | "lg" | "full") => void;
  // Blocks
  addBlock: (type: BlockType, parentId?: string, index?: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, direction: "up" | "down") => void;
  duplicateBlock: (id: string) => void;
  // Sections
  addSection: (type: Section["type"]) => void;
  updateSection: (id: string, updates: Partial<Section>) => void;
  deleteSection: (id: string) => void;
  moveSection: (id: string, direction: "up" | "down") => void;
  selectSection: (id: string | null) => void;
  toggleSectionVisibility: (id: string) => void;
  // Settings
  updateSettings: (updates: Partial<SiteSettings>) => void;
  addNavLink: () => void;
  updateNavLink: (id: string, updates: Partial<NavLink>) => void;
  deleteNavLink: (id: string) => void;
  // Selection
  selectBlock: (id: string | null) => void;
  getSelectedBlock: () => Block | null;
  getSelectedSection: () => Section | null;
  // Drag
  setDraggedBlockType: (type: BlockType | null) => void;
  // Preview & View
  togglePreview: () => void;
  setViewMode: (mode: "desktop" | "mobile") => void;
  // Panels
  setActivePanel: (panel: "blocks" | "sections" | "style" | "settings") => void;
  // Code popup
  showCodeChange: (change: CodeChange) => void;
  hideCodePopup: () => void;
  toggleCodePopup: () => void;
  // Templates
  loadTemplate: (templateId: string) => void;
  // Reset
  clearCanvas: () => void;
  resetAll: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditorState>(initialState);

  // === CANVAS ===
  const setBackgroundColor = useCallback((color: string) => {
    setState((prev) => ({
      ...prev,
      canvas: { ...prev.canvas, backgroundColor: color },
      settings: { ...prev.settings, backgroundColor: color },
    }));
  }, []);

  const setMaxWidth = useCallback((width: "sm" | "md" | "lg" | "full") => {
    setState((prev) => ({
      ...prev,
      canvas: { ...prev.canvas, maxWidth: width },
    }));
  }, []);

  // === BLOCKS ===
  const addBlock = useCallback((type: BlockType, parentId?: string, index?: number) => {
    const newBlock = createBlock(type);

    setState((prev) => {
      if (parentId) {
        const updateChildren = (blocks: Block[]): Block[] => {
          return blocks.map((block) => {
            if (block.id === parentId && block.type === "container") {
              const container = block as ContainerBlock;
              const newChildren = [...container.children];
              if (index !== undefined) {
                newChildren.splice(index, 0, newBlock);
              } else {
                newChildren.push(newBlock);
              }
              return { ...container, children: newChildren };
            }
            if (block.type === "container") {
              return { ...block, children: updateChildren((block as ContainerBlock).children) };
            }
            return block;
          });
        };

        return {
          ...prev,
          canvas: { ...prev.canvas, blocks: updateChildren(prev.canvas.blocks) },
          selectedBlockId: newBlock.id,
        };
      }

      const newBlocks = [...prev.canvas.blocks];
      if (index !== undefined) {
        newBlocks.splice(index, 0, newBlock);
      } else {
        newBlocks.push(newBlock);
      }

      return {
        ...prev,
        canvas: { ...prev.canvas, blocks: newBlocks },
        selectedBlockId: newBlock.id,
      };
    });
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setState((prev) => {
      const updateInBlocks = (blocks: Block[]): Block[] => {
        return blocks.map((block) => {
          if (block.id === id) {
            return { ...block, ...updates } as Block;
          }
          if (block.type === "container") {
            return {
              ...block,
              children: updateInBlocks((block as ContainerBlock).children),
            };
          }
          return block;
        });
      };

      // Also update in sections
      const updateInSections = (sections: Section[]): Section[] => {
        return sections.map((section) => ({
          ...section,
          blocks: updateInBlocks(section.blocks),
        }));
      };

      return {
        ...prev,
        canvas: { ...prev.canvas, blocks: updateInBlocks(prev.canvas.blocks) },
        sections: updateInSections(prev.sections),
      };
    });
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setState((prev) => {
      const removeFromBlocks = (blocks: Block[]): Block[] => {
        return blocks
          .filter((block) => block.id !== id)
          .map((block) => {
            if (block.type === "container") {
              return {
                ...block,
                children: removeFromBlocks((block as ContainerBlock).children),
              };
            }
            return block;
          });
      };

      const removeFromSections = (sections: Section[]): Section[] => {
        return sections.map((section) => ({
          ...section,
          blocks: removeFromBlocks(section.blocks),
        }));
      };

      return {
        ...prev,
        canvas: { ...prev.canvas, blocks: removeFromBlocks(prev.canvas.blocks) },
        sections: removeFromSections(prev.sections),
        selectedBlockId: prev.selectedBlockId === id ? null : prev.selectedBlockId,
      };
    });
  }, []);

  const moveBlock = useCallback((id: string, direction: "up" | "down") => {
    setState((prev) => {
      const moveInBlocks = (blocks: Block[]): Block[] => {
        const index = blocks.findIndex((b) => b.id === id);
        if (index === -1) {
          return blocks.map((block) => {
            if (block.type === "container") {
              return {
                ...block,
                children: moveInBlocks((block as ContainerBlock).children),
              };
            }
            return block;
          });
        }

        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= blocks.length) return blocks;

        const newBlocks = [...blocks];
        [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
        return newBlocks;
      };

      return {
        ...prev,
        canvas: { ...prev.canvas, blocks: moveInBlocks(prev.canvas.blocks) },
      };
    });
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    setState((prev) => {
      const duplicateInBlocks = (blocks: Block[]): Block[] => {
        const result: Block[] = [];
        for (const block of blocks) {
          result.push(block);
          if (block.id === id) {
            const duplicate = JSON.parse(JSON.stringify(block));
            duplicate.id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            result.push(duplicate);
          } else if (block.type === "container") {
            const updated = {
              ...block,
              children: duplicateInBlocks((block as ContainerBlock).children),
            };
            result[result.length - 1] = updated;
          }
        }
        return result;
      };

      return {
        ...prev,
        canvas: { ...prev.canvas, blocks: duplicateInBlocks(prev.canvas.blocks) },
      };
    });
  }, []);

  // === SECTIONS ===
  const addSection = useCallback((type: Section["type"]) => {
    const newSection = createSection(type, state.settings);
    setState((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
      selectedSectionId: newSection.id,
    }));

    // Show code popup for new section
    if (state.codePopupEnabled) {
      const codeChange: CodeChange = {
        type: "section",
        action: "add",
        elementName: type,
        code: `<Section type="${type}">\n  {/* Contenu de la section */}\n</Section>`,
        explanation: `Une nouvelle section "${type}" a été ajoutée à votre page.`,
      };
      showCodeChange(codeChange);
    }
  }, [state.settings, state.codePopupEnabled]);

  const updateSection = useCallback((id: string, updates: Partial<Section>) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      ),
    }));
  }, []);

  const deleteSection = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.filter((section) => section.id !== id),
      selectedSectionId: prev.selectedSectionId === id ? null : prev.selectedSectionId,
    }));
  }, []);

  const moveSection = useCallback((id: string, direction: "up" | "down") => {
    setState((prev) => {
      const index = prev.sections.findIndex((s) => s.id === id);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.sections.length) return prev;

      const newSections = [...prev.sections];
      [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];

      return { ...prev, sections: newSections };
    });
  }, []);

  const selectSection = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedSectionId: id, selectedBlockId: null }));
  }, []);

  const toggleSectionVisibility = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((section) =>
        section.id === id ? { ...section, visible: !section.visible } : section
      ),
    }));
  }, []);

  // === SETTINGS ===
  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setState((prev) => {
      const newSettings = { ...prev.settings, ...updates };

      // Show code popup for color changes
      if (prev.codePopupEnabled && updates.primaryColor && updates.primaryColor !== prev.settings.primaryColor) {
        const codeChange: CodeChange = {
          type: "style",
          action: "update",
          elementName: "couleur principale",
          code: `/* Tailwind CSS */\n.bg-primary {\n  background-color: ${updates.primaryColor};\n}\n\n/* Equivalent CSS */\n:root {\n  --primary-color: ${updates.primaryColor};\n}`,
          explanation: "La couleur principale affecte les boutons, les liens et les éléments d'accent.",
        };
        setTimeout(() => showCodeChange(codeChange), 0);
      }

      return { ...prev, settings: newSettings };
    });
  }, []);

  const addNavLink = useCallback(() => {
    const newLink: NavLink = {
      id: `nav-${Date.now()}`,
      label: "Nouveau lien",
      href: "#",
    };
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        navLinks: [...prev.settings.navLinks, newLink],
      },
    }));
  }, []);

  const updateNavLink = useCallback((id: string, updates: Partial<NavLink>) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        navLinks: prev.settings.navLinks.map((link) =>
          link.id === id ? { ...link, ...updates } : link
        ),
      },
    }));
  }, []);

  const deleteNavLink = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        navLinks: prev.settings.navLinks.filter((link) => link.id !== id),
      },
    }));
  }, []);

  // === SELECTION ===
  const selectBlock = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedBlockId: id, selectedSectionId: null }));
  }, []);

  const getSelectedBlock = useCallback((): Block | null => {
    const findBlock = (blocks: Block[], id: string): Block | null => {
      for (const block of blocks) {
        if (block.id === id) return block;
        if (block.type === "container") {
          const found = findBlock((block as ContainerBlock).children, id);
          if (found) return found;
        }
      }
      return null;
    };

    if (!state.selectedBlockId) return null;

    // Search in canvas blocks
    let found = findBlock(state.canvas.blocks, state.selectedBlockId);
    if (found) return found;

    // Search in sections
    for (const section of state.sections) {
      found = findBlock(section.blocks, state.selectedBlockId);
      if (found) return found;
    }

    return null;
  }, [state.selectedBlockId, state.canvas.blocks, state.sections]);

  const getSelectedSection = useCallback((): Section | null => {
    if (!state.selectedSectionId) return null;
    return state.sections.find((s) => s.id === state.selectedSectionId) || null;
  }, [state.selectedSectionId, state.sections]);

  // === DRAG ===
  const setDraggedBlockType = useCallback((type: BlockType | null) => {
    setState((prev) => ({ ...prev, draggedBlockType: type }));
  }, []);

  // === PREVIEW & VIEW ===
  const togglePreview = useCallback(() => {
    setState((prev) => ({
      ...prev,
      previewMode: !prev.previewMode,
      selectedBlockId: null,
      selectedSectionId: null,
    }));
  }, []);

  const setViewMode = useCallback((mode: "desktop" | "mobile") => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  // === PANELS ===
  const setActivePanel = useCallback((panel: "blocks" | "sections" | "style" | "settings") => {
    setState((prev) => ({ ...prev, activePanel: panel }));
  }, []);

  // === CODE POPUP ===
  const showCodeChange = useCallback((change: CodeChange) => {
    setState((prev) => ({
      ...prev,
      lastCodeChange: change,
      showCodePopup: prev.codePopupEnabled,
    }));
  }, []);

  const hideCodePopup = useCallback(() => {
    setState((prev) => ({ ...prev, showCodePopup: false }));
  }, []);

  const toggleCodePopup = useCallback(() => {
    setState((prev) => ({ ...prev, codePopupEnabled: !prev.codePopupEnabled }));
  }, []);

  // === TEMPLATES ===
  const loadTemplate = useCallback((templateId: string) => {
    const templates = getTemplates(state.settings);
    const template = templates[templateId];
    if (template) {
      setState((prev) => ({
        ...prev,
        sections: template.sections,
        settings: { ...prev.settings, ...template.settings },
        selectedBlockId: null,
        selectedSectionId: null,
      }));
    }
  }, [state.settings]);

  // === RESET ===
  const clearCanvas = useCallback(() => {
    setState((prev) => ({
      ...prev,
      canvas: { ...initialState.canvas },
      sections: [],
      selectedBlockId: null,
      selectedSectionId: null,
    }));
  }, []);

  const resetAll = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <BuilderContext.Provider
      value={{
        state,
        setBackgroundColor,
        setMaxWidth,
        addBlock,
        updateBlock,
        deleteBlock,
        moveBlock,
        duplicateBlock,
        addSection,
        updateSection,
        deleteSection,
        moveSection,
        selectSection,
        toggleSectionVisibility,
        updateSettings,
        addNavLink,
        updateNavLink,
        deleteNavLink,
        selectBlock,
        getSelectedBlock,
        getSelectedSection,
        setDraggedBlockType,
        togglePreview,
        setViewMode,
        setActivePanel,
        showCodeChange,
        hideCodePopup,
        toggleCodePopup,
        loadTemplate,
        clearCanvas,
        resetAll,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}

// Templates helper
function getTemplates(settings: SiteSettings): Record<string, { sections: Section[]; settings: Partial<SiteSettings> }> {
  return {
    blank: {
      sections: [],
      settings: {},
    },
    portfolio: {
      sections: [
        createSection("hero", settings),
        createSection("features", settings),
        createSection("cta", settings),
      ],
      settings: {
        siteName: "Mon Portfolio",
        primaryColor: "#8b5cf6",
      },
    },
    business: {
      sections: [
        createSection("hero", settings),
        createSection("features", settings),
        createSection("testimonial", settings),
        createSection("cta", settings),
      ],
      settings: {
        siteName: "Mon Entreprise",
        primaryColor: "#0ea5e9",
      },
    },
    creative: {
      sections: [
        createSection("hero", settings),
        createSection("gallery", settings),
        createSection("cta", settings),
      ],
      settings: {
        siteName: "Studio Créatif",
        primaryColor: "#f43f5e",
      },
    },
  };
}
