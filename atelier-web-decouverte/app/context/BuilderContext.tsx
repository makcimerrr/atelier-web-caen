"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import {
  EditorState,
  Block,
  BlockType,
  createBlock,
  ContainerBlock,
} from "../types/builder";

const initialState: EditorState = {
  canvas: {
    blocks: [],
    backgroundColor: "#ffffff",
    maxWidth: "lg",
  },
  selectedBlockId: null,
  draggedBlockType: null,
  previewMode: false,
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
  // Selection
  selectBlock: (id: string | null) => void;
  getSelectedBlock: () => Block | null;
  // Drag
  setDraggedBlockType: (type: BlockType | null) => void;
  // Preview
  togglePreview: () => void;
  // Reset
  clearCanvas: () => void;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EditorState>(initialState);

  // === CANVAS ===
  const setBackgroundColor = useCallback((color: string) => {
    setState((prev) => ({
      ...prev,
      canvas: { ...prev.canvas, backgroundColor: color },
    }));
  }, []);

  const setMaxWidth = useCallback((width: "sm" | "md" | "lg" | "full") => {
    setState((prev) => ({
      ...prev,
      canvas: { ...prev.canvas, maxWidth: width },
    }));
  }, []);

  // === BLOCKS ===
  const findBlockAndParent = useCallback(
    (
      blocks: Block[],
      id: string,
      parent: Block[] | null = null
    ): { block: Block | null; parent: Block[] | null; index: number } => {
      for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].id === id) {
          return { block: blocks[i], parent: blocks, index: i };
        }
        if (blocks[i].type === "container") {
          const container = blocks[i] as ContainerBlock;
          const result = findBlockAndParent(container.children, id, container.children);
          if (result.block) return result;
        }
      }
      return { block: null, parent: null, index: -1 };
    },
    []
  );

  const addBlock = useCallback((type: BlockType, parentId?: string, index?: number) => {
    const newBlock = createBlock(type);

    setState((prev) => {
      if (parentId) {
        // Add to container
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

      // Add to root
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

      return {
        ...prev,
        canvas: { ...prev.canvas, blocks: updateInBlocks(prev.canvas.blocks) },
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

      return {
        ...prev,
        canvas: { ...prev.canvas, blocks: removeFromBlocks(prev.canvas.blocks) },
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

  // === SELECTION ===
  const selectBlock = useCallback((id: string | null) => {
    setState((prev) => ({ ...prev, selectedBlockId: id }));
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
    return findBlock(state.canvas.blocks, state.selectedBlockId);
  }, [state.selectedBlockId, state.canvas.blocks]);

  // === DRAG ===
  const setDraggedBlockType = useCallback((type: BlockType | null) => {
    setState((prev) => ({ ...prev, draggedBlockType: type }));
  }, []);

  // === PREVIEW ===
  const togglePreview = useCallback(() => {
    setState((prev) => ({
      ...prev,
      previewMode: !prev.previewMode,
      selectedBlockId: null,
    }));
  }, []);

  // === RESET ===
  const clearCanvas = useCallback(() => {
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
        selectBlock,
        getSelectedBlock,
        setDraggedBlockType,
        togglePreview,
        clearCanvas,
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
