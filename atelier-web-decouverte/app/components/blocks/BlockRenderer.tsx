"use client";

import { useBuilder } from "../../context/BuilderContext";
import {
  Block,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  ButtonBlock,
  ContainerBlock,
  SpacerBlock,
} from "../../types/builder";

interface BlockRendererProps {
  block: Block;
  isNested?: boolean;
}

export default function BlockRenderer({ block, isNested = false }: BlockRendererProps) {
  const { state, selectBlock } = useBuilder();
  const isSelected = state.selectedBlockId === block.id;
  const isPreview = state.previewMode;

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    selectBlock(block.id);
  };

  const wrapperClass = isPreview
    ? ""
    : `relative group cursor-pointer transition-all ${
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2"
          : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1"
      }`;

  const renderBlock = () => {
    switch (block.type) {
      case "text":
        return <TextBlockComponent block={block} />;
      case "heading":
        return <HeadingBlockComponent block={block} />;
      case "image":
        return <ImageBlockComponent block={block} />;
      case "button":
        return <ButtonBlockComponent block={block} />;
      case "container":
        return <ContainerBlockComponent block={block} />;
      case "spacer":
        return <SpacerBlockComponent block={block} />;
      default:
        return null;
    }
  };

  return (
    <div className={wrapperClass} onClick={handleClick}>
      {renderBlock()}
      {!isPreview && isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-t font-medium z-10">
          {block.type}
        </div>
      )}
    </div>
  );
}

// === TEXT ===
function TextBlockComponent({ block }: { block: TextBlock }) {
  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };
  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    bold: "font-bold",
  };
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <p
      className={`${sizeClasses[block.fontSize]} ${weightClasses[block.fontWeight]} ${alignClasses[block.textAlign]}`}
      style={{ color: block.textColor }}
    >
      {block.content}
    </p>
  );
}

// === HEADING ===
function HeadingBlockComponent({ block }: { block: HeadingBlock }) {
  const levelClasses = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-semibold",
  };
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const Tag = block.level;

  return (
    <Tag
      className={`${levelClasses[block.level]} ${alignClasses[block.textAlign]}`}
      style={{ color: block.textColor }}
    >
      {block.content}
    </Tag>
  );
}

// === IMAGE ===
function ImageBlockComponent({ block }: { block: ImageBlock }) {
  const roundedClasses = {
    none: "rounded-none",
    md: "rounded-lg",
    lg: "rounded-2xl",
    full: "rounded-full",
  };

  return (
    <img
      src={block.src}
      alt={block.alt}
      className={`w-full h-auto object-cover ${roundedClasses[block.rounded]} ${
        block.shadow ? "shadow-lg" : ""
      }`}
    />
  );
}

// === BUTTON ===
function ButtonBlockComponent({ block }: { block: ButtonBlock }) {
  const sizeClasses = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };

  const baseClass = `${sizeClasses[block.size]} font-medium rounded-lg transition-all`;

  if (block.variant === "filled") {
    return (
      <button
        className={`${baseClass} text-white hover:opacity-90`}
        style={{ backgroundColor: block.color }}
      >
        {block.text}
      </button>
    );
  }

  return (
    <button
      className={`${baseClass} bg-transparent border-2 hover:opacity-75`}
      style={{ borderColor: block.color, color: block.color }}
    >
      {block.text}
    </button>
  );
}

// === CONTAINER ===
function ContainerBlockComponent({ block }: { block: ContainerBlock }) {
  const { state, selectBlock, setDraggedBlockType, addBlock } = useBuilder();

  const layoutClasses = {
    stack: "flex flex-col",
    row: "flex flex-row flex-wrap",
    grid: "grid grid-cols-2 md:grid-cols-3",
  };
  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-8",
  };
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
  };
  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };
  const paddingClasses = {
    none: "p-0",
    sm: "p-2",
    md: "p-4",
    lg: "p-8",
  };
  const roundedClasses = {
    none: "rounded-none",
    md: "rounded-lg",
    lg: "rounded-2xl",
    xl: "rounded-3xl",
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (state.draggedBlockType) {
      e.preventDefault();
      e.currentTarget.classList.add("ring-2", "ring-blue-400", "ring-dashed");
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("ring-2", "ring-blue-400", "ring-dashed");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove("ring-2", "ring-blue-400", "ring-dashed");
    if (state.draggedBlockType) {
      addBlock(state.draggedBlockType, block.id);
      setDraggedBlockType(null);
    }
  };

  return (
    <div
      className={`${layoutClasses[block.layout]} ${gapClasses[block.gap]} ${justifyClasses[block.justify]} ${alignClasses[block.align]} ${paddingClasses[block.padding]} ${roundedClasses[block.rounded]} min-h-[60px]`}
      style={{ backgroundColor: block.background }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {block.children.length === 0 && !state.previewMode ? (
        <div className="flex-1 flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg p-4">
          Déposez des éléments ici
        </div>
      ) : (
        block.children.map((child) => (
          <BlockRenderer key={child.id} block={child} isNested />
        ))
      )}
    </div>
  );
}

// === SPACER ===
function SpacerBlockComponent({ block }: { block: SpacerBlock }) {
  const sizeClasses = {
    sm: "h-4",
    md: "h-8",
    lg: "h-16",
    xl: "h-24",
  };

  return <div className={`w-full ${sizeClasses[block.size]}`} />;
}
