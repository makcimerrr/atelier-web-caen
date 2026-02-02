// Types pour le Site Builder Pédagogique Avancé

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

// === SECTIONS ===
export type SectionType = "hero" | "features" | "gallery" | "testimonial" | "cta" | "text" | "custom";

export interface Section {
  id: string;
  type: SectionType;
  title: string;
  visible: boolean;
  blocks: Block[];
  settings: SectionSettings;
}

export interface SectionSettings {
  backgroundColor: string;
  padding: "sm" | "md" | "lg" | "xl";
  textAlign: "left" | "center" | "right";
}

// === NAVIGATION ===
export interface NavLink {
  id: string;
  label: string;
  href: string;
}

// === SITE SETTINGS ===
export interface SiteSettings {
  siteName: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  fontFamily: "inter" | "poppins" | "space" | "mono";
  spacing: "compact" | "normal" | "large";
  navLinks: NavLink[];
  showNav: boolean;
  showFooter: boolean;
}

// === CANVAS ===
export interface CanvasState {
  blocks: Block[];
  backgroundColor: string;
  maxWidth: "sm" | "md" | "lg" | "full";
}

// === CODE CHANGE (pour popup pédagogique) ===
export interface CodeChange {
  type: "text" | "style" | "section" | "component";
  action: "add" | "update" | "delete";
  elementName: string;
  code: string;
  explanation: string;
}

// === EDITOR STATE ===
export interface EditorState {
  canvas: CanvasState;
  sections: Section[];
  settings: SiteSettings;
  selectedBlockId: string | null;
  selectedSectionId: string | null;
  draggedBlockType: BlockType | null;
  previewMode: boolean;
  viewMode: "desktop" | "mobile";
  activePanel: "blocks" | "sections" | "style" | "settings";
  showCodePopup: boolean;
  lastCodeChange: CodeChange | null;
  codePopupEnabled: boolean;
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
  primary: "#2563eb",
  primaryLight: "#3b82f6",
  primaryDark: "#1d4ed8",
  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  text: "#1e293b",
  textMuted: "#64748b",
  textLight: "#94a3b8",
};

export const PRIMARY_COLORS = [
  { name: "Bleu", value: "#2563eb" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#ec4899" },
  { name: "Rouge", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Vert", value: "#16a34a" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Gris", value: "#64748b" },
];

export const BACKGROUND_COLORS = [
  { name: "Blanc", value: "#ffffff" },
  { name: "Gris très clair", value: "#f8fafc" },
  { name: "Gris clair", value: "#f1f5f9" },
  { name: "Crème", value: "#fef7ed" },
  { name: "Bleu très clair", value: "#eff6ff" },
  { name: "Violet très clair", value: "#f5f3ff" },
  { name: "Vert très clair", value: "#f0fdf4" },
  { name: "Noir", value: "#0f172a" },
];

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

export const FONTS = [
  { id: "inter", name: "Inter", class: "font-sans", preview: "Aa Bb Cc" },
  { id: "poppins", name: "Poppins", class: "font-poppins", preview: "Aa Bb Cc" },
  { id: "space", name: "Space Grotesk", class: "font-space", preview: "Aa Bb Cc" },
  { id: "mono", name: "Roboto Mono", class: "font-mono", preview: "Aa Bb Cc" },
];

export const SAMPLE_IMAGES = [
  { name: "Paysage", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop" },
  { name: "Nature", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop" },
  { name: "Ville", url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=400&fit=crop" },
  { name: "Tech", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop" },
  { name: "Bureau", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop" },
  { name: "Abstrait", url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=400&fit=crop" },
];

export const COMMENT_TAGS: { value: CommentTag; label: string; icon: string; color: string }[] = [
  { value: "web", label: "Web", icon: "🌐", color: "#2563eb" },
  { value: "design", label: "Design", icon: "🎨", color: "#ec4899" },
  { value: "code", label: "Code", icon: "💻", color: "#16a34a" },
  { value: "decouverte", label: "Découverte", icon: "🔍", color: "#f59e0b" },
];

export const SECTION_TYPES: { type: SectionType; name: string; icon: string; description: string }[] = [
  { type: "hero", name: "Hero", icon: "🚀", description: "Section d'accueil avec titre et image" },
  { type: "features", name: "Fonctionnalités", icon: "✨", description: "Liste de caractéristiques" },
  { type: "gallery", name: "Galerie", icon: "🖼️", description: "Grille d'images" },
  { type: "testimonial", name: "Témoignage", icon: "💬", description: "Citation ou avis client" },
  { type: "cta", name: "Appel à l'action", icon: "📢", description: "Section avec bouton d'action" },
  { type: "text", name: "Texte", icon: "📝", description: "Section de contenu texte" },
];

export const TEMPLATES = [
  { id: "blank", name: "Page vide", icon: "📄", description: "Commencer de zéro" },
  { id: "portfolio", name: "Portfolio", icon: "🎨", description: "Présentation créative" },
  { id: "business", name: "Business", icon: "💼", description: "Site professionnel" },
  { id: "creative", name: "Créatif", icon: "✨", description: "Design moderne" },
];

// === HELPERS ===
export function createBlock(type: BlockType): Block {
  const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  switch (type) {
    case "text":
      return {
        id,
        type: "text",
        content: "Votre texte ici. Cliquez pour modifier ce paragraphe et ajouter votre propre contenu.",
        fontSize: "base",
        fontWeight: "normal",
        textAlign: "left",
        textColor: "#1e293b",
      };
    case "heading":
      return {
        id,
        type: "heading",
        content: "Titre de section",
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

export function createSection(type: SectionType, siteSettings: SiteSettings): Section {
  const id = `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const defaultSettings: SectionSettings = {
    backgroundColor: "#ffffff",
    padding: "lg",
    textAlign: "center",
  };

  const sectionInfo = SECTION_TYPES.find((s) => s.type === type);
  const title = sectionInfo?.name || "Section";

  // Create default blocks based on section type
  const blocks: Block[] = [];

  switch (type) {
    case "hero":
      blocks.push(
        {
          id: `block-${Date.now()}-h1`,
          type: "heading",
          content: "Bienvenue sur mon site",
          level: "h1",
          textAlign: "center",
          textColor: "#1e293b",
        },
        {
          id: `block-${Date.now()}-p`,
          type: "text",
          content: "Créez votre présence en ligne en quelques clics. Personnalisez chaque élément selon vos envies.",
          fontSize: "lg",
          fontWeight: "normal",
          textAlign: "center",
          textColor: "#64748b",
        },
        {
          id: `block-${Date.now()}-btn`,
          type: "button",
          text: "Découvrir",
          variant: "filled",
          size: "lg",
          color: siteSettings.primaryColor,
        }
      );
      break;

    case "features":
      blocks.push(
        {
          id: `block-${Date.now()}-h2`,
          type: "heading",
          content: "Nos fonctionnalités",
          level: "h2",
          textAlign: "center",
          textColor: "#1e293b",
        },
        {
          id: `block-${Date.now()}-container`,
          type: "container",
          children: [
            {
              id: `block-${Date.now()}-f1`,
              type: "text",
              content: "🚀 Rapide et intuitif",
              fontSize: "lg",
              fontWeight: "medium",
              textAlign: "center",
              textColor: "#1e293b",
            },
            {
              id: `block-${Date.now()}-f2`,
              type: "text",
              content: "🎨 Design moderne",
              fontSize: "lg",
              fontWeight: "medium",
              textAlign: "center",
              textColor: "#1e293b",
            },
            {
              id: `block-${Date.now()}-f3`,
              type: "text",
              content: "📱 100% responsive",
              fontSize: "lg",
              fontWeight: "medium",
              textAlign: "center",
              textColor: "#1e293b",
            },
          ],
          layout: "row",
          gap: "lg",
          justify: "center",
          align: "stretch",
          padding: "md",
          background: "transparent",
          rounded: "none",
        }
      );
      break;

    case "gallery":
      blocks.push(
        {
          id: `block-${Date.now()}-h2`,
          type: "heading",
          content: "Galerie",
          level: "h2",
          textAlign: "center",
          textColor: "#1e293b",
        },
        {
          id: `block-${Date.now()}-container`,
          type: "container",
          children: [
            {
              id: `block-${Date.now()}-img1`,
              type: "image",
              src: SAMPLE_IMAGES[0].url,
              alt: "Image 1",
              rounded: "lg",
              shadow: true,
            },
            {
              id: `block-${Date.now()}-img2`,
              type: "image",
              src: SAMPLE_IMAGES[1].url,
              alt: "Image 2",
              rounded: "lg",
              shadow: true,
            },
            {
              id: `block-${Date.now()}-img3`,
              type: "image",
              src: SAMPLE_IMAGES[2].url,
              alt: "Image 3",
              rounded: "lg",
              shadow: true,
            },
          ],
          layout: "grid",
          gap: "md",
          justify: "center",
          align: "stretch",
          padding: "none",
          background: "transparent",
          rounded: "none",
        }
      );
      break;

    case "testimonial":
      blocks.push(
        {
          id: `block-${Date.now()}-quote`,
          type: "text",
          content: '"Ce site builder est incroyable ! J\'ai pu créer mon site en quelques minutes seulement."',
          fontSize: "xl",
          fontWeight: "medium",
          textAlign: "center",
          textColor: "#1e293b",
        },
        {
          id: `block-${Date.now()}-author`,
          type: "text",
          content: "— Marie D., Designer",
          fontSize: "base",
          fontWeight: "normal",
          textAlign: "center",
          textColor: "#64748b",
        }
      );
      defaultSettings.backgroundColor = "#f8fafc";
      break;

    case "cta":
      blocks.push(
        {
          id: `block-${Date.now()}-h2`,
          type: "heading",
          content: "Prêt à commencer ?",
          level: "h2",
          textAlign: "center",
          textColor: "#ffffff",
        },
        {
          id: `block-${Date.now()}-p`,
          type: "text",
          content: "Rejoignez des milliers d'utilisateurs satisfaits.",
          fontSize: "lg",
          fontWeight: "normal",
          textAlign: "center",
          textColor: "#e2e8f0",
        },
        {
          id: `block-${Date.now()}-btn`,
          type: "button",
          text: "Commencer maintenant",
          variant: "filled",
          size: "lg",
          color: "#ffffff",
        }
      );
      defaultSettings.backgroundColor = siteSettings.primaryColor;
      break;

    case "text":
      blocks.push(
        {
          id: `block-${Date.now()}-h2`,
          type: "heading",
          content: "À propos",
          level: "h2",
          textAlign: "left",
          textColor: "#1e293b",
        },
        {
          id: `block-${Date.now()}-p`,
          type: "text",
          content: "Ajoutez votre contenu ici. Parlez de votre projet, de votre histoire, de ce qui vous rend unique. N'hésitez pas à personnaliser ce texte pour qu'il reflète votre personnalité.",
          fontSize: "base",
          fontWeight: "normal",
          textAlign: "left",
          textColor: "#64748b",
        }
      );
      defaultSettings.textAlign = "left";
      break;
  }

  return {
    id,
    type,
    title,
    visible: true,
    blocks,
    settings: defaultSettings,
  };
}

// Helper pour générer le code d'un bloc
export function generateBlockCode(block: Block): string {
  switch (block.type) {
    case "heading":
      return `<${block.level} className="text-${block.level === 'h1' ? '4xl' : block.level === 'h2' ? '3xl' : '2xl'} font-bold">
  ${block.content}
</${block.level}>`;

    case "text":
      return `<p className="text-${block.fontSize}">
  ${block.content}
</p>`;

    case "button":
      return `<button className="px-6 py-3 bg-[${block.color}] text-white rounded-lg">
  ${block.text}
</button>`;

    case "image":
      return `<img
  src="${block.src}"
  alt="${block.alt}"
  className="rounded-${block.rounded} ${block.shadow ? 'shadow-lg' : ''}"
/>`;

    default:
      return `<${block.type}>...</${block.type}>`;
  }
}
