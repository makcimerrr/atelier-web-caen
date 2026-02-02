// Types pour le Site Builder Avancé

// === BLOCS ===
export type BlockType = "text" | "heading" | "image" | "button" | "container" | "spacer";

export interface BlockBase {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BlockBase {
  type: "text";
  content: string;
  fontSize: "sm" | "base" | "lg" | "xl";
  fontWeight: "normal" | "medium" | "bold";
  textAlign: "left" | "center" | "right";
  textColor: string;
}

export interface HeadingBlock extends BlockBase {
  type: "heading";
  content: string;
  level: "h1" | "h2" | "h3";
  textAlign: "left" | "center" | "right";
  textColor: string;
}

export interface ImageBlock extends BlockBase {
  type: "image";
  src: string;
  alt: string;
  rounded: "none" | "md" | "lg" | "full";
  shadow: boolean;
}

export interface ButtonBlock extends BlockBase {
  type: "button";
  text: string;
  variant: "filled" | "outline";
  size: "sm" | "md" | "lg";
  color: string;
}

export interface ContainerBlock extends BlockBase {
  type: "container";
  children: Block[];
  layout: "stack" | "row" | "grid";
  gap: "none" | "sm" | "md" | "lg";
  justify: "start" | "center" | "end" | "between";
  align: "start" | "center" | "end" | "stretch";
  padding: "none" | "sm" | "md" | "lg";
  background: string;
  rounded: "none" | "md" | "lg" | "xl";
}

export interface SpacerBlock extends BlockBase {
  type: "spacer";
  size: "sm" | "md" | "lg" | "xl";
}

export type Block =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | ButtonBlock
  | ContainerBlock
  | SpacerBlock;

// === CANVAS ===
export interface CanvasState {
  blocks: Block[];
  backgroundColor: string;
  maxWidth: "sm" | "md" | "lg" | "full";
}

// === SELECTION ===
export interface EditorState {
  canvas: CanvasState;
  selectedBlockId: string | null;
  draggedBlockType: BlockType | null;
  previewMode: boolean;
}

// === COMMENTAIRES ===
export interface Comment {
  id: string;
  pseudo: string;
  message: string;
  tag: CommentTag;
  createdAt: string;
}

export type CommentTag = "web" | "design" | "code" | "decouverte";

// === CONSTANTES ===
export const COLORS = {
  primary: "#2563eb",      // Bleu principal
  primaryLight: "#3b82f6",
  primaryDark: "#1d4ed8",
  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  text: "#1e293b",
  textMuted: "#64748b",
  textLight: "#94a3b8",
};

export const BLOCK_COLORS = [
  { name: "Transparent", value: "transparent" },
  { name: "Blanc", value: "#ffffff" },
  { name: "Gris clair", value: "#f1f5f9" },
  { name: "Gris", value: "#e2e8f0" },
  { name: "Bleu clair", value: "#dbeafe" },
  { name: "Bleu", value: "#2563eb" },
];

export const TEXT_COLORS = [
  { name: "Noir", value: "#1e293b" },
  { name: "Gris", value: "#64748b" },
  { name: "Bleu", value: "#2563eb" },
  { name: "Blanc", value: "#ffffff" },
];

export const SAMPLE_IMAGES = [
  { name: "Paysage", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop" },
  { name: "Nature", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop" },
  { name: "Ville", url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=400&fit=crop" },
  { name: "Tech", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop" },
  { name: "Bureau", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop" },
  { name: "Abstrait", url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=400&fit=crop" },
];

export const COMMENT_TAGS: { value: CommentTag; label: string; icon: string }[] = [
  { value: "web", label: "Web", icon: "🌐" },
  { value: "design", label: "Design", icon: "🎨" },
  { value: "code", label: "Code", icon: "💻" },
  { value: "decouverte", label: "Découverte", icon: "🔍" },
];

// === HELPERS ===
export function createBlock(type: BlockType): Block {
  const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  switch (type) {
    case "text":
      return {
        id,
        type: "text",
        content: "Votre texte ici",
        fontSize: "base",
        fontWeight: "normal",
        textAlign: "left",
        textColor: "#1e293b",
      };
    case "heading":
      return {
        id,
        type: "heading",
        content: "Titre",
        level: "h2",
        textAlign: "left",
        textColor: "#1e293b",
      };
    case "image":
      return {
        id,
        type: "image",
        src: SAMPLE_IMAGES[0].url,
        alt: "Image",
        rounded: "md",
        shadow: true,
      };
    case "button":
      return {
        id,
        type: "button",
        text: "Cliquez ici",
        variant: "filled",
        size: "md",
        color: "#2563eb",
      };
    case "container":
      return {
        id,
        type: "container",
        children: [],
        layout: "stack",
        gap: "md",
        justify: "start",
        align: "stretch",
        padding: "md",
        background: "transparent",
        rounded: "none",
      };
    case "spacer":
      return {
        id,
        type: "spacer",
        size: "md",
      };
  }
}
