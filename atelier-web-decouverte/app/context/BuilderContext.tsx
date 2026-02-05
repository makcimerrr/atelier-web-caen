"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import {
  EditorState,
  Block,
  BlockType,
  RowBlock,
  createBlock,
  DropPosition,
  SiteSettings,
  NavLink,
  CodeChange,
  DragState,
} from "../types/builder";

const AUTOSAVE_KEY = "atelier-web-autosave";

const defaultNavLinks: NavLink[] = [
  { id: "nav-1", label: "Accueil", href: "#" },
  { id: "nav-2", label: "À propos", href: "#about" },
  { id: "nav-3", label: "Contact", href: "#contact" },
];

const defaultSettings: SiteSettings = {
  siteName: "Mon Site",
  siteDescription: "Créé avec le Site Builder",
  primaryColor: "#2563eb",
  backgroundColor: "#ffffff",
  textColor: "#18181b",
  fontFamily: "inter",
  maxWidth: "lg",
  navLinks: defaultNavLinks,
  showNav: true,
  showFooter: true,
};

const initialDragState: DragState = {
  isDragging: false,
  draggedItem: null,
  dropPosition: null,
};

const initialState: EditorState = {
  blocks: [],
  settings: defaultSettings,
  selectedBlockId: null,
  dragState: initialDragState,
  previewMode: false,
  viewMode: "desktop",
  activePanel: "elements",
  showCodePopup: false,
  lastCodeChange: null,
  codePopupEnabled: true,
  history: [[]],
  historyIndex: 0,
};

interface BuilderContextType {
  state: EditorState;
  // Blocks
  addBlock: (type: BlockType, position?: DropPosition) => void;
  insertBlockAt: (type: BlockType, targetId: string, position: "before" | "after" | "inside") => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (blockId: string, targetId: string | null, position: "before" | "after" | "inside") => void;
  duplicateBlock: (id: string) => void;
  // Selection
  selectBlock: (id: string | null) => void;
  getSelectedBlock: () => Block | null;
  // Drag
  startDrag: (item: DragState["draggedItem"]) => void;
  updateDropPosition: (position: DropPosition | null) => void;
  endDrag: () => void;
  // Settings
  updateSettings: (updates: Partial<SiteSettings>) => void;
  addNavLink: () => void;
  updateNavLink: (id: string, updates: Partial<NavLink>) => void;
  deleteNavLink: (id: string) => void;
  // View & Preview
  togglePreview: () => void;
  setViewMode: (mode: "desktop" | "mobile") => void;
  setActivePanel: (panel: EditorState["activePanel"]) => void;
  // Code popup
  showCodeChange: (change: CodeChange) => void;
  hideCodePopup: () => void;
  toggleCodePopup: () => void;
  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // Reset
  clearCanvas: () => void;
  // Load configuration
  loadConfiguration: (blocks: Block[], settings: SiteSettings) => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditorState>(initialState);
  const [hasLoadedFromCache, setHasLoadedFromCache] = useState(false);

  // Charger depuis le cache au démarrage (si disponible)
  useEffect(() => {
    if (hasLoadedFromCache) return;

    try {
      const savedData = localStorage.getItem(AUTOSAVE_KEY);
      if (savedData) {
        const { blocks, settings } = JSON.parse(savedData);
        if (blocks && blocks.length > 0) {
          setState((prev) => ({
            ...prev,
            blocks: blocks,
            settings: { ...defaultSettings, ...settings },
            history: [blocks],
            historyIndex: 0,
          }));
        }
      }
    } catch (e) {
      console.warn("Erreur lors du chargement du cache:", e);
    }
    setHasLoadedFromCache(true);
  }, [hasLoadedFromCache]);

  // Sauvegarder automatiquement à chaque changement de blocs ou settings
  useEffect(() => {
    if (!hasLoadedFromCache) return;

    try {
      const dataToSave = {
        blocks: state.blocks,
        settings: state.settings,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn("Erreur lors de la sauvegarde automatique:", e);
    }
  }, [state.blocks, state.settings, hasLoadedFromCache]);

  // === HISTORY ===
  const saveToHistory = useCallback((blocks: Block[]) => {
    setState((prev) => {
      const newHistory = prev.history.slice(0, prev.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(blocks)));
      // Limit history to 50 entries
      if (newHistory.length > 50) newHistory.shift();
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  }, []);

  // === BLOCK HELPERS ===
  const findBlockById = useCallback((blocks: Block[], id: string): Block | null => {
    for (const block of blocks) {
      if (block.id === id) return block;
      if (block.type === "row") {
        const found = findBlockById(block.children, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const findBlockParent = useCallback((
    blocks: Block[],
    id: string,
    parent: { blocks: Block[]; index: number; parentId: string | null } | null = null
  ): { blocks: Block[]; index: number; parentId: string | null } | null => {
    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      if (block.id === id) {
        return parent || { blocks, index: i, parentId: null };
      }
      if (block.type === "row") {
        const result = findBlockParent(block.children, id, {
          blocks: block.children,
          index: -1,
          parentId: block.id
        });
        if (result) {
          if (result.index === -1) {
            result.index = block.children.findIndex(b => b.id === id);
          }
          return result;
        }
      }
    }
    return null;
  }, []);

  const removeBlockFromTree = useCallback((blocks: Block[], id: string): Block[] => {
    return blocks
      .filter((block) => block.id !== id)
      .map((block) => {
        if (block.type === "row") {
          return { ...block, children: removeBlockFromTree(block.children, id) };
        }
        return block;
      });
  }, []);

  const insertBlockInTree = useCallback((
    blocks: Block[],
    newBlock: Block,
    targetId: string | null,
    position: "before" | "after" | "inside"
  ): Block[] => {
    // Insert at root level if no target
    if (!targetId) {
      return [...blocks, newBlock];
    }

    const result: Block[] = [];
    for (const block of blocks) {
      if (block.id === targetId) {
        if (position === "before") {
          result.push(newBlock, block);
        } else if (position === "after") {
          result.push(block, newBlock);
        } else if (position === "inside" && block.type === "row") {
          // When inserting inside a row, set width to auto for side-by-side layout
          const blockForRow = { ...newBlock, width: "auto" as const };
          result.push({ ...block, children: [...block.children, blockForRow] });
        } else {
          result.push(block);
        }
      } else if (block.type === "row") {
        result.push({
          ...block,
          children: insertBlockInTree(block.children, newBlock, targetId, position),
        });
      } else {
        result.push(block);
      }
    }
    return result;
  }, []);

  // === BLOCKS ===
  const addBlock = useCallback((type: BlockType, position?: DropPosition) => {
    const newBlock = createBlock(type);

    setState((prev) => {
      let newBlocks: Block[];

      if (position) {
        newBlocks = insertBlockInTree(prev.blocks, newBlock, position.targetId, position.position);
      } else {
        newBlocks = [...prev.blocks, newBlock];
      }

      return {
        ...prev,
        blocks: newBlocks,
        selectedBlockId: newBlock.id,
        dragState: initialDragState,
      };
    });

    // Save to history after state update
    setTimeout(() => {
      setState((prev) => {
        saveToHistory(prev.blocks);
        return prev;
      });
    }, 0);
  }, [insertBlockInTree, saveToHistory]);

  const insertBlockAt = useCallback((
    type: BlockType,
    targetId: string,
    position: "before" | "after" | "inside"
  ) => {
    addBlock(type, { targetId, position });
  }, [addBlock]);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setState((prev) => {
      const updateInBlocks = (blocks: Block[]): Block[] => {
        return blocks.map((block) => {
          if (block.id === id) {
            return { ...block, ...updates } as Block;
          }
          if (block.type === "row") {
            return { ...block, children: updateInBlocks(block.children) };
          }
          return block;
        });
      };

      const newBlocks = updateInBlocks(prev.blocks);
      return { ...prev, blocks: newBlocks };
    });
  }, []);

  const deleteBlock = useCallback((id: string) => {
    setState((prev) => {
      const newBlocks = removeBlockFromTree(prev.blocks, id);
      saveToHistory(newBlocks);
      return {
        ...prev,
        blocks: newBlocks,
        selectedBlockId: prev.selectedBlockId === id ? null : prev.selectedBlockId,
      };
    });
  }, [removeBlockFromTree, saveToHistory]);

  const moveBlock = useCallback((
    blockId: string,
    targetId: string | null,
    position: "before" | "after" | "inside"
  ) => {
    setState((prev) => {
      // Find the block to move
      const blockToMove = findBlockById(prev.blocks, blockId);
      if (!blockToMove) return prev;

      // Can't move a row inside itself
      if (blockId === targetId) return prev;
      if (blockToMove.type === "row") {
        const isDescendant = (parent: RowBlock, childId: string): boolean => {
          for (const child of parent.children) {
            if (child.id === childId) return true;
            if (child.type === "row" && isDescendant(child, childId)) return true;
          }
          return false;
        };
        if (targetId && isDescendant(blockToMove, targetId)) return prev;
      }

      // Remove from current position
      let newBlocks = removeBlockFromTree(prev.blocks, blockId);

      // Insert at new position
      newBlocks = insertBlockInTree(newBlocks, blockToMove, targetId, position);

      saveToHistory(newBlocks);
      return { ...prev, blocks: newBlocks, dragState: initialDragState };
    });
  }, [findBlockById, removeBlockFromTree, insertBlockInTree, saveToHistory]);

  const duplicateBlock = useCallback((id: string) => {
    setState((prev) => {
      const duplicateInBlocks = (blocks: Block[]): Block[] => {
        const result: Block[] = [];
        for (const block of blocks) {
          if (block.type === "row") {
            result.push({ ...block, children: duplicateInBlocks(block.children) });
          } else {
            result.push(block);
          }

          if (block.id === id) {
            const duplicate = JSON.parse(JSON.stringify(block));
            duplicate.id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            if (duplicate.type === "row") {
              duplicate.children = duplicate.children.map((child: Block) => ({
                ...child,
                id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              }));
            }
            result.push(duplicate);
          }
        }
        return result;
      };

      const newBlocks = duplicateInBlocks(prev.blocks);
      saveToHistory(newBlocks);
      return { ...prev, blocks: newBlocks };
    });
  }, [saveToHistory]);

  // === SELECTION ===
  const selectBlock = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedBlockId: id }));
  }, []);

  const getSelectedBlock = useCallback((): Block | null => {
    if (!state.selectedBlockId) return null;
    return findBlockById(state.blocks, state.selectedBlockId);
  }, [state.selectedBlockId, state.blocks, findBlockById]);

  // === DRAG ===
  const startDrag = useCallback((item: DragState["draggedItem"]) => {
    setState((prev) => ({
      ...prev,
      dragState: { isDragging: true, draggedItem: item, dropPosition: null },
    }));
  }, []);

  const updateDropPosition = useCallback((position: DropPosition | null) => {
    setState((prev) => ({
      ...prev,
      dragState: { ...prev.dragState, dropPosition: position },
    }));
  }, []);

  const endDrag = useCallback(() => {
    setState((prev) => {
      const { dragState } = prev;

      // If we have a valid drop position, perform the drop
      if (dragState.draggedItem && dragState.dropPosition) {
        if (dragState.draggedItem.type === "new") {
          // Adding new block
          const newBlock = createBlock(dragState.draggedItem.blockType);
          const newBlocks = insertBlockInTree(
            prev.blocks,
            newBlock,
            dragState.dropPosition.targetId,
            dragState.dropPosition.position
          );
          saveToHistory(newBlocks);
          return {
            ...prev,
            blocks: newBlocks,
            selectedBlockId: newBlock.id,
            dragState: initialDragState,
          };
        } else {
          // Moving existing block
          const blockToMove = findBlockById(prev.blocks, dragState.draggedItem.blockId);
          if (blockToMove) {
            let newBlocks = removeBlockFromTree(prev.blocks, dragState.draggedItem.blockId);
            newBlocks = insertBlockInTree(
              newBlocks,
              blockToMove,
              dragState.dropPosition.targetId,
              dragState.dropPosition.position
            );
            saveToHistory(newBlocks);
            return { ...prev, blocks: newBlocks, dragState: initialDragState };
          }
        }
      }

      return { ...prev, dragState: initialDragState };
    });
  }, [findBlockById, insertBlockInTree, removeBlockFromTree, saveToHistory]);

  // === SETTINGS ===
  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...updates },
    }));
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

  // === VIEW & PREVIEW ===
  const togglePreview = useCallback(() => {
    setState((prev) => ({
      ...prev,
      previewMode: !prev.previewMode,
      selectedBlockId: null,
    }));
  }, []);

  const setViewMode = useCallback((mode: "desktop" | "mobile") => {
    setState((prev) => ({ ...prev, viewMode: mode }));
  }, []);

  const setActivePanel = useCallback((panel: EditorState["activePanel"]) => {
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

  // === HISTORY ===
  const undo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex <= 0) return prev;
      const newIndex = prev.historyIndex - 1;
      return {
        ...prev,
        blocks: JSON.parse(JSON.stringify(prev.history[newIndex])),
        historyIndex: newIndex,
        selectedBlockId: null,
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((prev) => {
      if (prev.historyIndex >= prev.history.length - 1) return prev;
      const newIndex = prev.historyIndex + 1;
      return {
        ...prev,
        blocks: JSON.parse(JSON.stringify(prev.history[newIndex])),
        historyIndex: newIndex,
        selectedBlockId: null,
      };
    });
  }, []);

  // === RESET ===
  const clearCanvas = useCallback(() => {
    // Effacer le cache de sauvegarde automatique
    try {
      localStorage.removeItem(AUTOSAVE_KEY);
    } catch (e) {
      console.warn("Erreur lors de la suppression du cache:", e);
    }

    setState((prev) => ({
      ...prev,
      blocks: [],
      selectedBlockId: null,
      history: [[]],
      historyIndex: 0,
    }));
  }, []);

  // === LOAD CONFIGURATION ===
  const loadConfiguration = useCallback((blocks: Block[], settings: SiteSettings) => {
    setState((prev) => {
      const newBlocks = JSON.parse(JSON.stringify(blocks));
      saveToHistory(newBlocks);
      return {
        ...prev,
        blocks: newBlocks,
        settings: { ...defaultSettings, ...settings },
        selectedBlockId: null,
        previewMode: false,
      };
    });
  }, [saveToHistory]);

  return (
    <BuilderContext.Provider
      value={{
        state,
        addBlock,
        insertBlockAt,
        updateBlock,
        deleteBlock,
        moveBlock,
        duplicateBlock,
        selectBlock,
        getSelectedBlock,
        startDrag,
        updateDropPosition,
        endDrag,
        updateSettings,
        addNavLink,
        updateNavLink,
        deleteNavLink,
        togglePreview,
        setViewMode,
        setActivePanel,
        showCodeChange,
        hideCodePopup,
        toggleCodePopup,
        undo,
        redo,
        canUndo: state.historyIndex > 0,
        canRedo: state.historyIndex < state.history.length - 1,
        clearCanvas,
        loadConfiguration,
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
