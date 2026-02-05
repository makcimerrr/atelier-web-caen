// Types pour le Site Builder WordPress-like

// === BLOCS ===
export type BlockType =
  | "text" | "heading" | "image" | "button" | "row" | "spacer" | "divider"
  | "header" | "footer" | "hero" | "features" | "testimonial" | "cta" | "gallery" | "card"
  | "video" | "list" | "quote" | "socials" | "stats" | "accordion" | "pricing";

export interface BlockBase {
  id: string;
  type: BlockType;
  width: "auto" | "1/4" | "1/3" | "1/2" | "2/3" | "3/4" | "full";
  visible?: boolean;
}

export interface TextBlock extends BlockBase {
  type: "text";
  content: string;
  fontSize: "sm" | "base" | "lg" | "xl" | "2xl";
  fontWeight: "normal" | "medium" | "semibold" | "bold";
  textAlign: "left" | "center" | "right";
  textColor: string;
}

export interface HeadingBlock extends BlockBase {
  type: "heading";
  content: string;
  level: "h1" | "h2" | "h3" | "h4";
  textAlign: "left" | "center" | "right";
  textColor: string;
}

export interface ImageBlock extends BlockBase {
  type: "image";
  src: string;
  alt: string;
  rounded: "none" | "sm" | "md" | "lg" | "xl" | "full";
  shadow: "none" | "sm" | "md" | "lg" | "xl";
  aspectRatio: "auto" | "square" | "video" | "wide";
}

export interface ButtonBlock extends BlockBase {
  type: "button";
  text: string;
  variant: "filled" | "outline" | "ghost";
  size: "sm" | "md" | "lg";
  color: string;
  fullWidth: boolean;
  rounded: "none" | "sm" | "md" | "lg" | "full";
}

// Row = container for side-by-side elements
export interface RowBlock extends BlockBase {
  type: "row";
  children: Block[];
  gap: "none" | "sm" | "md" | "lg" | "xl";
  align: "start" | "center" | "end" | "stretch";
  justify: "start" | "center" | "end" | "between" | "around";
  padding: "none" | "sm" | "md" | "lg";
  background: string;
  rounded: "none" | "sm" | "md" | "lg" | "xl";
  wrap: boolean;
}

export interface SpacerBlock extends BlockBase {
  type: "spacer";
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export interface DividerBlock extends BlockBase {
  type: "divider";
  style: "solid" | "dashed" | "dotted";
  color: string;
  thickness: "thin" | "medium" | "thick";
}

export interface HeaderBlock extends BlockBase {
  type: "header";
  title: string;
  subtitle: string;
  showNav: boolean;
  navLinks: { label: string; href: string }[];
  backgroundColor: string;
  textColor: string;
  sticky: boolean;
  style: "simple" | "centered" | "split";
}

export interface FooterBlock extends BlockBase {
  type: "footer";
  text: string;
  showSocials: boolean;
  socials: { icon: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube"; url: string }[];
  backgroundColor: string;
  textColor: string;
  style: "simple" | "centered" | "columns";
}

// === SECTIONS PRE-FAITES ===
export interface HeroBlock extends BlockBase {
  type: "hero";
  title: string;
  subtitle: string;
  buttonText: string;
  buttonColor: string;
  backgroundImage: string;
  backgroundColor: string;
  textColor: string;
  alignment: "left" | "center" | "right";
  overlay: boolean;
}

export interface FeaturesBlock extends BlockBase {
  type: "features";
  title: string;
  features: { icon: string; title: string; description: string }[];
  columns: 2 | 3 | 4;
  backgroundColor: string;
  textColor: string;
}

export interface TestimonialBlock extends BlockBase {
  type: "testimonial";
  quote: string;
  author: string;
  role: string;
  avatar: string;
  backgroundColor: string;
  textColor: string;
  style: "simple" | "card" | "centered";
}

export interface CtaBlock extends BlockBase {
  type: "cta";
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
}

export interface GalleryBlock extends BlockBase {
  type: "gallery";
  images: { src: string; alt: string }[];
  columns: 2 | 3 | 4;
  gap: "none" | "sm" | "md" | "lg";
  rounded: "none" | "sm" | "md" | "lg";
}

export interface CardBlock extends BlockBase {
  type: "card";
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  rounded: "none" | "sm" | "md" | "lg" | "xl";
  shadow: "none" | "sm" | "md" | "lg";
}

// === NEW BLOCK TYPES ===
export interface VideoBlock extends BlockBase {
  type: "video";
  url: string;
  aspectRatio: "16/9" | "4/3" | "1/1";
  autoplay: boolean;
  rounded: "none" | "sm" | "md" | "lg" | "xl";
}

export interface ListBlock extends BlockBase {
  type: "list";
  items: string[];
  style: "bullet" | "number" | "check" | "arrow";
  textColor: string;
  iconColor: string;
}

export interface QuoteBlock extends BlockBase {
  type: "quote";
  content: string;
  author: string;
  style: "simple" | "bordered" | "filled";
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface SocialsBlock extends BlockBase {
  type: "socials";
  links: { platform: "facebook" | "twitter" | "instagram" | "linkedin" | "youtube" | "tiktok" | "github"; url: string }[];
  style: "filled" | "outline" | "minimal";
  size: "sm" | "md" | "lg";
  color: string;
}

export interface StatsBlock extends BlockBase {
  type: "stats";
  stats: { value: string; label: string; icon?: string }[];
  columns: 2 | 3 | 4;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface AccordionBlock extends BlockBase {
  type: "accordion";
  items: { question: string; answer: string }[];
  style: "simple" | "bordered" | "filled";
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

export interface PricingBlock extends BlockBase {
  type: "pricing";
  title: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  highlighted: boolean;
}

export type Block =
  | TextBlock
  | HeadingBlock
  | ImageBlock
  | ButtonBlock
  | RowBlock
  | SpacerBlock
  | DividerBlock
  | HeaderBlock
  | FooterBlock
  | HeroBlock
  | FeaturesBlock
  | TestimonialBlock
  | CtaBlock
  | GalleryBlock
  | CardBlock
  | VideoBlock
  | ListBlock
  | QuoteBlock
  | SocialsBlock
  | StatsBlock
  | AccordionBlock
  | PricingBlock;

// === DRAG & DROP ===
export interface DropPosition {
  targetId: string | null; // null = root canvas
  position: "before" | "after" | "inside";
  index?: number;
}

export interface DragState {
  isDragging: boolean;
  draggedItem: { type: "new"; blockType: BlockType } | { type: "existing"; blockId: string } | null;
  dropPosition: DropPosition | null;
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
  siteDescription: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: "inter" | "poppins" | "space" | "mono";
  maxWidth: "sm" | "md" | "lg" | "xl" | "full";
  navLinks: NavLink[];
  showNav: boolean;
  showFooter: boolean;
}

// === CODE CHANGE (pour popup pédagogique) ===
export interface CodeChange {
  type: "text" | "style" | "layout" | "component";
  action: "add" | "update" | "delete" | "move";
  elementName: string;
  code: string;
  explanation: string;
}

// === EDITOR STATE ===
export interface EditorState {
  blocks: Block[];
  settings: SiteSettings;
  selectedBlockId: string | null;
  dragState: DragState;
  previewMode: boolean;
  viewMode: "desktop" | "mobile";
  activePanel: "elements" | "layers" | "style" | "settings";
  showCodePopup: boolean;
  lastCodeChange: CodeChange | null;
  codePopupEnabled: boolean;
  history: Block[][];
  historyIndex: number;
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

// === SITES SAUVEGARDES ===
export interface StudentInfo {
  nom: string;
  prenom: string;
  email: string;
}

export interface SavedSite {
  id: string;
  studentInfo: StudentInfo;
  blocks: Block[];
  settings: SiteSettings;
  createdAt: string;
}

export interface SavedSiteSummary {
  id: string;
  studentInfo: StudentInfo;
  createdAt: string;
}

// === CONSTANTES ===
export const PRIMARY_COLORS = [
  { name: "Bleu", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#ec4899" },
  { name: "Rouge", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Vert", value: "#16a34a" },
  { name: "Cyan", value: "#0891b2" },
  { name: "Gris", value: "#6b7280" },
  { name: "Noir", value: "#18181b" },
];

export const BACKGROUND_COLORS = [
  { name: "Blanc", value: "#ffffff" },
  { name: "Gris très clair", value: "#fafafa" },
  { name: "Gris clair", value: "#f4f4f5" },
  { name: "Crème", value: "#fefce8" },
  { name: "Bleu très clair", value: "#eff6ff" },
  { name: "Violet très clair", value: "#faf5ff" },
  { name: "Vert très clair", value: "#f0fdf4" },
  { name: "Gris foncé", value: "#27272a" },
];

export const TEXT_COLORS = [
  { name: "Noir", value: "#18181b" },
  { name: "Gris foncé", value: "#3f3f46" },
  { name: "Gris", value: "#71717a" },
  { name: "Gris clair", value: "#a1a1aa" },
  { name: "Blanc", value: "#ffffff" },
  { name: "Bleu", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Rose", value: "#ec4899" },
  { name: "Rouge", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Vert", value: "#16a34a" },
  { name: "Cyan", value: "#0891b2" },
];

export const DIVIDER_COLORS = [
  { name: "Gris très clair", value: "#e4e4e7" },
  { name: "Gris clair", value: "#d4d4d8" },
  { name: "Gris", value: "#a1a1aa" },
  { name: "Noir", value: "#18181b" },
];

export const FONTS = [
  { id: "inter", name: "Inter", class: "font-sans" },
  { id: "poppins", name: "Poppins", class: "font-poppins" },
  { id: "space", name: "Space Grotesk", class: "font-space" },
  { id: "mono", name: "Roboto Mono", class: "font-mono" },
];

export const SAMPLE_IMAGES = [
  { name: "Paysage", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop" },
  { name: "Nature", url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop" },
  { name: "Ville", url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=500&fit=crop" },
  { name: "Tech", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop" },
  { name: "Bureau", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop" },
  { name: "Abstrait", url: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=500&fit=crop" },
  { name: "Minimal", url: "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&h=500&fit=crop" },
  { name: "Café", url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=500&fit=crop" },
];

export const COMMENT_TAGS: { value: CommentTag; label: string; icon: string; color: string }[] = [
  { value: "web", label: "Web", icon: "🌐", color: "#2563eb" },
  { value: "design", label: "Design", icon: "🎨", color: "#ec4899" },
  { value: "code", label: "Code", icon: "💻", color: "#16a34a" },
  { value: "decouverte", label: "Découverte", icon: "🔍", color: "#f59e0b" },
];

export const BLOCK_TYPES: { type: BlockType; name: string; icon: string; description: string; category: "basic" | "layout" | "structure" | "sections" | "interactive" }[] = [
  // Basic
  { type: "heading", name: "Titre", icon: "H", description: "Titre de section", category: "basic" },
  { type: "text", name: "Texte", icon: "T", description: "Paragraphe de texte", category: "basic" },
  { type: "image", name: "Image", icon: "🖼️", description: "Image ou photo", category: "basic" },
  { type: "button", name: "Bouton", icon: "▢", description: "Bouton d'action", category: "basic" },
  { type: "video", name: "Vidéo", icon: "▶️", description: "Vidéo YouTube/Vimeo", category: "basic" },
  { type: "list", name: "Liste", icon: "📝", description: "Liste à puces", category: "basic" },
  { type: "quote", name: "Citation", icon: "❝", description: "Citation stylée", category: "basic" },
  // Layout
  { type: "row", name: "Colonnes", icon: "⊞", description: "Conteneur côte à côte", category: "layout" },
  { type: "spacer", name: "Espace", icon: "↕", description: "Espace vertical", category: "layout" },
  { type: "divider", name: "Séparateur", icon: "—", description: "Ligne de séparation", category: "layout" },
  // Structure
  { type: "header", name: "En-tête", icon: "🏠", description: "Barre de navigation", category: "structure" },
  { type: "footer", name: "Pied de page", icon: "📋", description: "Pied de page du site", category: "structure" },
  // Sections prédéfinies
  { type: "hero", name: "Hero", icon: "🚀", description: "Section d'accueil", category: "sections" },
  { type: "features", name: "Fonctionnalités", icon: "✨", description: "Liste de caractéristiques", category: "sections" },
  { type: "testimonial", name: "Témoignage", icon: "💬", description: "Avis client", category: "sections" },
  { type: "cta", name: "Appel à l'action", icon: "📣", description: "Incitation à agir", category: "sections" },
  { type: "gallery", name: "Galerie", icon: "🖼️", description: "Grille d'images", category: "sections" },
  { type: "card", name: "Carte", icon: "🃏", description: "Carte avec image", category: "sections" },
  // Interactive
  { type: "socials", name: "Réseaux sociaux", icon: "🔗", description: "Liens sociaux", category: "interactive" },
  { type: "stats", name: "Statistiques", icon: "📊", description: "Chiffres clés", category: "interactive" },
  { type: "accordion", name: "Accordéon", icon: "📂", description: "FAQ dépliable", category: "interactive" },
  { type: "pricing", name: "Tarif", icon: "💰", description: "Carte de prix", category: "interactive" },
];

export const WIDTH_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "1/4", label: "25%" },
  { value: "1/3", label: "33%" },
  { value: "1/2", label: "50%" },
  { value: "2/3", label: "66%" },
  { value: "3/4", label: "75%" },
  { value: "full", label: "100%" },
];

// === HELPERS ===
export function createBlock(type: BlockType): Block {
  const id = `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const baseBlock = { id, width: "full" as const };

  switch (type) {
    case "text":
      return {
        ...baseBlock,
        type: "text",
        content: "Cliquez pour modifier ce texte. Ajoutez votre contenu ici.",
        fontSize: "base",
        fontWeight: "normal",
        textAlign: "left",
        textColor: "#3f3f46",
      };
    case "heading":
      return {
        ...baseBlock,
        type: "heading",
        content: "Titre de section",
        level: "h2",
        textAlign: "left",
        textColor: "#18181b",
      };
    case "image":
      return {
        ...baseBlock,
        type: "image",
        src: SAMPLE_IMAGES[0].url,
        alt: "Image",
        rounded: "md",
        shadow: "md",
        aspectRatio: "auto",
      };
    case "button":
      return {
        ...baseBlock,
        type: "button",
        text: "Cliquez ici",
        variant: "filled",
        size: "md",
        color: "#2563eb",
        fullWidth: false,
        rounded: "md",
        width: "auto",
      };
    case "row":
      return {
        ...baseBlock,
        type: "row",
        children: [],
        gap: "md",
        align: "stretch",
        justify: "start",
        padding: "none",
        background: "transparent",
        rounded: "none",
        wrap: false,
      };
    case "spacer":
      return {
        ...baseBlock,
        type: "spacer",
        size: "md",
      };
    case "divider":
      return {
        ...baseBlock,
        type: "divider",
        style: "solid",
        color: "#e4e4e7",
        thickness: "thin",
      };
    case "header":
      return {
        ...baseBlock,
        type: "header",
        title: "Mon Site",
        subtitle: "",
        showNav: true,
        navLinks: [
          { label: "Accueil", href: "#" },
          { label: "À propos", href: "#about" },
          { label: "Contact", href: "#contact" },
        ],
        backgroundColor: "#ffffff",
        textColor: "#18181b",
        sticky: false,
        style: "simple",
      };
    case "footer":
      return {
        ...baseBlock,
        type: "footer",
        text: "© 2024 Mon Site. Tous droits réservés.",
        showSocials: false,
        socials: [],
        backgroundColor: "#18181b",
        textColor: "#ffffff",
        style: "simple",
      };
    case "hero":
      return {
        ...baseBlock,
        type: "hero",
        title: "Bienvenue sur mon site",
        subtitle: "Découvrez nos services et laissez-nous vous accompagner dans vos projets.",
        buttonText: "En savoir plus",
        buttonColor: "#2563eb",
        backgroundImage: SAMPLE_IMAGES[0].url,
        backgroundColor: "#1e293b",
        textColor: "#ffffff",
        alignment: "center",
        overlay: true,
      };
    case "features":
      return {
        ...baseBlock,
        type: "features",
        title: "Nos avantages",
        features: [
          { icon: "⚡", title: "Rapide", description: "Performance optimisée pour une expérience fluide" },
          { icon: "🛡️", title: "Sécurisé", description: "Vos données sont protégées en permanence" },
          { icon: "🎨", title: "Design", description: "Interface moderne et intuitive" },
        ],
        columns: 3,
        backgroundColor: "#ffffff",
        textColor: "#18181b",
      };
    case "testimonial":
      return {
        ...baseBlock,
        type: "testimonial",
        quote: "Ce service a transformé notre façon de travailler. Je le recommande vivement !",
        author: "Marie Dupont",
        role: "Directrice Marketing",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        backgroundColor: "#f4f4f5",
        textColor: "#18181b",
        style: "card",
      };
    case "cta":
      return {
        ...baseBlock,
        type: "cta",
        title: "Prêt à commencer ?",
        description: "Rejoignez des milliers d'utilisateurs satisfaits dès aujourd'hui.",
        buttonText: "Commencer maintenant",
        buttonColor: "#2563eb",
        backgroundColor: "#2563eb",
        textColor: "#ffffff",
      };
    case "gallery":
      return {
        ...baseBlock,
        type: "gallery",
        images: [
          { src: SAMPLE_IMAGES[0].url, alt: "Image 1" },
          { src: SAMPLE_IMAGES[1].url, alt: "Image 2" },
          { src: SAMPLE_IMAGES[2].url, alt: "Image 3" },
          { src: SAMPLE_IMAGES[3].url, alt: "Image 4" },
        ],
        columns: 2,
        gap: "md",
        rounded: "md",
      };
    case "card":
      return {
        ...baseBlock,
        type: "card",
        image: SAMPLE_IMAGES[4].url,
        title: "Titre de la carte",
        description: "Une description courte et attrayante pour cette carte.",
        buttonText: "Voir plus",
        buttonColor: "#2563eb",
        backgroundColor: "#ffffff",
        textColor: "#18181b",
        rounded: "lg",
        shadow: "md",
        width: "auto",
      };
    case "video":
      return {
        ...baseBlock,
        type: "video",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        aspectRatio: "16/9",
        autoplay: false,
        rounded: "lg",
      };
    case "list":
      return {
        ...baseBlock,
        type: "list",
        items: ["Premier élément de la liste", "Deuxième élément", "Troisième élément"],
        style: "bullet",
        textColor: "#18181b",
        iconColor: "#2563eb",
      };
    case "quote":
      return {
        ...baseBlock,
        type: "quote",
        content: "La créativité, c'est l'intelligence qui s'amuse.",
        author: "Albert Einstein",
        style: "bordered",
        backgroundColor: "#f8fafc",
        textColor: "#18181b",
        accentColor: "#2563eb",
      };
    case "socials":
      return {
        ...baseBlock,
        type: "socials",
        links: [
          { platform: "facebook", url: "#" },
          { platform: "twitter", url: "#" },
          { platform: "instagram", url: "#" },
          { platform: "linkedin", url: "#" },
        ],
        style: "filled",
        size: "md",
        color: "#2563eb",
        width: "auto",
      };
    case "stats":
      return {
        ...baseBlock,
        type: "stats",
        stats: [
          { value: "100+", label: "Clients satisfaits", icon: "😊" },
          { value: "50+", label: "Projets réalisés", icon: "🚀" },
          { value: "5 ans", label: "D'expérience", icon: "⭐" },
        ],
        columns: 3,
        backgroundColor: "#ffffff",
        textColor: "#18181b",
        accentColor: "#2563eb",
      };
    case "accordion":
      return {
        ...baseBlock,
        type: "accordion",
        items: [
          { question: "Comment ça fonctionne ?", answer: "C'est très simple ! Il suffit de glisser-déposer les éléments." },
          { question: "Est-ce gratuit ?", answer: "Oui, l'outil est entièrement gratuit pour l'atelier." },
          { question: "Puis-je exporter mon site ?", answer: "Votre site sera sauvegardé et vous recevrez le résultat par email." },
        ],
        style: "bordered",
        backgroundColor: "#ffffff",
        textColor: "#18181b",
        accentColor: "#2563eb",
      };
    case "pricing":
      return {
        ...baseBlock,
        type: "pricing",
        title: "Formule Pro",
        price: "29€",
        period: "/mois",
        features: ["Fonctionnalité 1", "Fonctionnalité 2", "Fonctionnalité 3", "Support prioritaire"],
        buttonText: "Choisir",
        buttonColor: "#2563eb",
        backgroundColor: "#ffffff",
        textColor: "#18181b",
        highlighted: false,
        width: "auto",
      };
  }
}

// Generate code representation of a block
export function generateBlockCode(block: Block): string {
  switch (block.type) {
    case "heading":
      return `<${block.level} className="text-${
        block.level === "h1" ? "4xl" : block.level === "h2" ? "3xl" : block.level === "h3" ? "2xl" : "xl"
      } font-bold text-${block.textAlign}">
  ${block.content}
</${block.level}>`;

    case "text":
      return `<p className="text-${block.fontSize} font-${block.fontWeight} text-${block.textAlign}">
  ${block.content}
</p>`;

    case "button":
      return `<button className="px-${block.size === "sm" ? 4 : block.size === "md" ? 6 : 8} py-${
        block.size === "sm" ? 2 : block.size === "md" ? 3 : 4
      } bg-[${block.color}] text-white rounded-${block.rounded}${block.fullWidth ? " w-full" : ""}">
  ${block.text}
</button>`;

    case "image":
      return `<img
  src="${block.src.substring(0, 50)}..."
  alt="${block.alt}"
  className="rounded-${block.rounded} shadow-${block.shadow}"
/>`;

    case "row":
      return `<div className="flex gap-${block.gap} items-${block.align}">
  {/* ${block.children.length} éléments */}
</div>`;

    case "spacer":
      return `<div className="h-${
        block.size === "xs" ? 2 : block.size === "sm" ? 4 : block.size === "md" ? 8 : block.size === "lg" ? 12 : block.size === "xl" ? 16 : 24
      }" />`;

    case "divider":
      return `<hr className="border-${block.style} border-[${block.color}]" />`;

    case "header":
      return `<header className="py-4 px-6 ${block.sticky ? "sticky top-0" : ""}">
  <nav className="flex items-center justify-between">
    <span className="font-bold">${block.title}</span>
    <div className="flex gap-4">
      {/* ${block.navLinks.length} liens */}
    </div>
  </nav>
</header>`;

    case "footer":
      return `<footer className="py-8 px-6 text-center">
  <p>${block.text}</p>
</footer>`;

    case "hero":
      return `<section className="py-20 text-center bg-gradient-to-r from-blue-500 to-purple-600">
  <h1 className="text-5xl font-bold text-white mb-4">${block.title}</h1>
  <p className="text-xl text-white/90 mb-8">${block.subtitle}</p>
  <button className="px-8 py-3 bg-white text-blue-600 rounded-full">${block.buttonText}</button>
</section>`;

    case "features":
      return `<section className="py-16 px-6">
  <h2 className="text-3xl font-bold text-center mb-12">${block.title}</h2>
  <div className="grid grid-cols-3 gap-8">
    {/* ${block.features.length} fonctionnalités */}
  </div>
</section>`;

    case "testimonial":
      return `<blockquote className="max-w-2xl mx-auto p-8 text-center">
  <p className="text-xl italic mb-6">"${block.quote}"</p>
  <cite className="font-semibold">${block.author}</cite>
  <p className="text-sm text-gray-500">${block.role}</p>
</blockquote>`;

    case "cta":
      return `<section className="py-16 px-6 text-center bg-[${block.backgroundColor}]">
  <h2 className="text-3xl font-bold mb-4">${block.title}</h2>
  <p className="text-lg mb-8">${block.description}</p>
  <button className="px-8 py-3 bg-[${block.buttonColor}] text-white rounded-lg">${block.buttonText}</button>
</section>`;

    case "gallery":
      return `<div className="grid grid-cols-${block.columns} gap-${block.gap}">
  {/* ${block.images.length} images */}
</div>`;

    case "card":
      return `<div className="rounded-${block.rounded} shadow-${block.shadow} overflow-hidden">
  <img src="${block.image}" alt="${block.title}" />
  <div className="p-6">
    <h3 className="text-xl font-bold mb-2">${block.title}</h3>
    <p className="text-gray-600">${block.description}</p>
  </div>
</div>`;

    case "video":
      return `<div className="aspect-[${block.aspectRatio}] rounded-${block.rounded} overflow-hidden">
  <iframe src="${block.url}" className="w-full h-full" allowFullScreen />
</div>`;

    case "list":
      return `<ul className="list-${block.style === "bullet" ? "disc" : block.style === "number" ? "decimal" : "none"} pl-5 space-y-2">
  {/* ${block.items.length} éléments */}
</ul>`;

    case "quote":
      return `<blockquote className="border-l-4 border-[${block.accentColor}] pl-6 py-4 italic">
  <p className="text-lg">${block.content}</p>
  <cite className="text-sm mt-2 block">— ${block.author}</cite>
</blockquote>`;

    case "socials":
      return `<div className="flex gap-4">
  {/* ${block.links.length} réseaux sociaux */}
</div>`;

    case "stats":
      return `<div className="grid grid-cols-${block.columns} gap-8 text-center">
  {/* ${block.stats.length} statistiques */}
</div>`;

    case "accordion":
      return `<div className="space-y-2">
  {/* ${block.items.length} questions */}
</div>`;

    case "pricing":
      return `<div className="rounded-xl shadow-lg p-8 text-center${block.highlighted ? " ring-2 ring-[" + block.buttonColor + "]" : ""}">
  <h3 className="text-xl font-bold">${block.title}</h3>
  <div className="text-4xl font-bold my-4">${block.price}<span className="text-lg">${block.period}</span></div>
  <ul className="space-y-2 my-6">{/* ${block.features.length} features */}</ul>
  <button className="w-full py-3 bg-[${block.buttonColor}] text-white rounded-lg">${block.buttonText}</button>
</div>`;
  }
}
