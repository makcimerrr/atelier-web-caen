"use client";

import { useBuilder } from "../../context/BuilderContext";
import { Block, RowBlock, HeaderBlock, FooterBlock, HeroBlock, FeaturesBlock, TestimonialBlock, CtaBlock, GalleryBlock, CardBlock } from "../../types/builder";
import DropIndicator from "../builder/DropIndicator";

interface BlockWrapperProps {
  block: Block;
  isInRow?: boolean;
}

export default function BlockWrapper({ block, isInRow = false }: BlockWrapperProps) {
  const { state, selectBlock, startDrag, deleteBlock, duplicateBlock, moveBlock } = useBuilder();
  const isSelected = state.selectedBlockId === block.id;
  const isPreview = state.previewMode;
  const isDragging = state.dragState.isDragging &&
    state.dragState.draggedItem?.type === "existing" &&
    state.dragState.draggedItem.blockId === block.id;

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    selectBlock(block.id);
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isPreview) return;
    e.stopPropagation();
    startDrag({ type: "existing", blockId: block.id });
    // Set drag image
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", block.id);
  };

  const handleDragEnd = () => {
    // endDrag is called by the drop handler
  };

  // Width classes for blocks inside rows
  const widthClasses: Record<Block["width"], string> = {
    "auto": "",
    "1/4": "w-1/4",
    "1/3": "w-1/3",
    "1/2": "w-1/2",
    "2/3": "w-2/3",
    "3/4": "w-3/4",
    "full": "w-full",
  };

  const wrapperClass = isPreview
    ? ""
    : `relative group transition-all cursor-pointer ${
        isDragging ? "opacity-50" : ""
      } ${
        isSelected
          ? "ring-2 ring-blue-500 ring-offset-2 rounded-lg"
          : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 rounded-lg"
      }`;

  const blockTypeLabels: Record<Block["type"], string> = {
    text: "Texte",
    heading: "Titre",
    image: "Image",
    button: "Bouton",
    row: "Colonnes",
    spacer: "Espace",
    divider: "Séparateur",
    header: "En-tête",
    footer: "Pied de page",
    hero: "Hero",
    features: "Fonctionnalités",
    testimonial: "Témoignage",
    cta: "Appel à l'action",
    gallery: "Galerie",
    card: "Carte",
  };

  return (
    <div
      className={`${wrapperClass} ${isInRow ? widthClasses[block.width] : ""}`}
      onClick={handleClick}
      draggable={!isPreview}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {/* Block type label */}
      {!isPreview && isSelected && (
        <div className="absolute -top-7 left-0 z-20 flex items-center gap-1">
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-t font-medium">
            {blockTypeLabels[block.type]}
          </span>
        </div>
      )}

      {/* Quick actions toolbar */}
      {!isPreview && isSelected && (
        <div className="absolute -top-7 right-0 z-20 flex items-center gap-0.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateBlock(block.id);
            }}
            className="p-1.5 bg-zinc-700 hover:bg-zinc-600 text-white rounded-t text-xs"
            title="Dupliquer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteBlock(block.id);
            }}
            className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-t text-xs"
            title="Supprimer"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}

      {/* Drag handle indicator */}
      {!isPreview && (
        <div className="absolute left-1/2 -translate-x-1/2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="flex gap-0.5">
            <span className="w-1 h-1 bg-zinc-400 rounded-full" />
            <span className="w-1 h-1 bg-zinc-400 rounded-full" />
            <span className="w-1 h-1 bg-zinc-400 rounded-full" />
          </div>
        </div>
      )}

      {/* Block content */}
      <div className={!isPreview && isSelected ? "p-2" : ""}>
        <BlockContent block={block} />
      </div>
    </div>
  );
}

function BlockContent({ block }: { block: Block }) {
  const { state } = useBuilder();

  switch (block.type) {
    case "heading":
      return <HeadingBlock block={block} />;
    case "text":
      return <TextBlock block={block} />;
    case "image":
      return <ImageBlock block={block} />;
    case "button":
      return <ButtonBlock block={block} />;
    case "row":
      return <RowBlockComponent block={block} />;
    case "spacer":
      return <SpacerBlock block={block} />;
    case "divider":
      return <DividerBlock block={block} />;
    case "header":
      return <HeaderBlockComponent block={block} />;
    case "footer":
      return <FooterBlockComponent block={block} />;
    case "hero":
      return <HeroBlockComponent block={block} />;
    case "features":
      return <FeaturesBlockComponent block={block} />;
    case "testimonial":
      return <TestimonialBlockComponent block={block} />;
    case "cta":
      return <CtaBlockComponent block={block} />;
    case "gallery":
      return <GalleryBlockComponent block={block} />;
    case "card":
      return <CardBlockComponent block={block} />;
    default:
      return null;
  }
}

// === HEADING ===
function HeadingBlock({ block }: { block: Extract<Block, { type: "heading" }> }) {
  const sizeClasses = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-semibold",
    h4: "text-xl font-semibold",
  };
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const Tag = block.level;

  return (
    <Tag
      className={`${sizeClasses[block.level]} ${alignClasses[block.textAlign]}`}
      style={{ color: block.textColor }}
    >
      {block.content}
    </Tag>
  );
}

// === TEXT ===
function TextBlock({ block }: { block: Extract<Block, { type: "text" }> }) {
  const sizeClasses = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };
  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <p
      className={`${sizeClasses[block.fontSize]} ${weightClasses[block.fontWeight]} ${alignClasses[block.textAlign]} leading-relaxed`}
      style={{ color: block.textColor }}
    >
      {block.content}
    </p>
  );
}

// === IMAGE ===
function ImageBlock({ block }: { block: Extract<Block, { type: "image" }> }) {
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-full",
  };
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };
  const aspectClasses = {
    auto: "",
    square: "aspect-square object-cover",
    video: "aspect-video object-cover",
    wide: "aspect-[21/9] object-cover",
  };

  return (
    <img
      src={block.src}
      alt={block.alt}
      className={`w-full h-auto ${roundedClasses[block.rounded]} ${shadowClasses[block.shadow]} ${aspectClasses[block.aspectRatio]}`}
    />
  );
}

// === BUTTON ===
function ButtonBlock({ block }: { block: Extract<Block, { type: "button" }> }) {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3 text-lg",
  };
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  const baseClass = `${sizeClasses[block.size]} ${roundedClasses[block.rounded]} font-medium transition-all hover:opacity-90 ${
    block.fullWidth ? "w-full" : "inline-block"
  }`;

  if (block.variant === "filled") {
    return (
      <button
        className={`${baseClass} text-white`}
        style={{ backgroundColor: block.color }}
      >
        {block.text}
      </button>
    );
  }

  if (block.variant === "outline") {
    return (
      <button
        className={`${baseClass} bg-transparent border-2`}
        style={{ borderColor: block.color, color: block.color }}
      >
        {block.text}
      </button>
    );
  }

  // ghost
  return (
    <button
      className={`${baseClass} bg-transparent hover:bg-zinc-100`}
      style={{ color: block.color }}
    >
      {block.text}
    </button>
  );
}

// === ROW ===
function RowBlockComponent({ block }: { block: RowBlock }) {
  const { state, updateDropPosition, endDrag } = useBuilder();
  const { dragState } = state;

  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };
  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };
  const paddingClasses = {
    none: "p-0",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
  };
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (dragState.isDragging) {
      e.preventDefault();
      e.stopPropagation();
      updateDropPosition({ targetId: block.id, position: "inside" });
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear if leaving the row container itself
    if (e.currentTarget === e.target) {
      // Don't clear if moving to a child element
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    endDrag();
  };

  const isDropTarget =
    dragState.isDragging &&
    dragState.dropPosition?.targetId === block.id &&
    dragState.dropPosition?.position === "inside";

  // Check if we're trying to drag a row into itself (prevent nesting)
  const isDraggingThis = dragState.isDragging &&
    dragState.draggedItem?.type === "existing" &&
    dragState.draggedItem.blockId === block.id;

  return (
    <div
      className={`flex flex-wrap ${gapClasses[block.gap]} ${alignClasses[block.align]} ${justifyClasses[block.justify]} ${paddingClasses[block.padding]} ${roundedClasses[block.rounded]} min-h-[80px] transition-all ${
        isDropTarget && !isDraggingThis ? "ring-2 ring-blue-400 ring-dashed bg-blue-50/50" : ""
      }`}
      style={{
        backgroundColor: block.background === "transparent" ? undefined : block.background,
      }}
      onDragOver={!isDraggingThis ? handleDragOver : undefined}
      onDragLeave={handleDragLeave}
      onDrop={!isDraggingThis ? handleDrop : undefined}
    >
      {block.children.length === 0 && !state.previewMode ? (
        <div
          className={`flex-1 flex flex-col items-center justify-center text-sm border-2 border-dashed rounded-lg p-6 min-h-[80px] transition-all ${
            isDropTarget && !isDraggingThis
              ? "border-blue-400 bg-blue-50 text-blue-600"
              : "border-zinc-300 bg-zinc-50 text-zinc-400"
          }`}
        >
          <span className="text-2xl mb-2">📥</span>
          <span>{isDropTarget ? "Déposez ici !" : "Glissez des éléments ici"}</span>
        </div>
      ) : (
        <>
          {/* Drop indicator at the start */}
          {block.children.length > 0 && !state.previewMode && (
            <DropIndicator
              targetId={block.children[0].id}
              position="before"
              isFirst={true}
              isInRow={true}
            />
          )}

          {block.children.map((child, index) => (
            <div key={child.id} className="flex items-stretch">
              <BlockWrapper block={child} isInRow={true} />
              {!state.previewMode && (
                <DropIndicator
                  targetId={child.id}
                  position="after"
                  isLast={index === block.children.length - 1}
                  isInRow={true}
                />
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// === SPACER ===
function SpacerBlock({ block }: { block: Extract<Block, { type: "spacer" }> }) {
  const { state } = useBuilder();

  const sizeClasses = {
    xs: "h-2",
    sm: "h-4",
    md: "h-8",
    lg: "h-12",
    xl: "h-16",
    "2xl": "h-24",
  };

  return (
    <div className={`w-full ${sizeClasses[block.size]} ${!state.previewMode ? "bg-zinc-50 border border-dashed border-zinc-200 rounded flex items-center justify-center" : ""}`}>
      {!state.previewMode && (
        <span className="text-xs text-zinc-400">↕ Espace</span>
      )}
    </div>
  );
}

// === DIVIDER ===
function DividerBlock({ block }: { block: Extract<Block, { type: "divider" }> }) {
  const styleClasses = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };
  const thicknessClasses = {
    thin: "border-t",
    medium: "border-t-2",
    thick: "border-t-4",
  };

  return (
    <hr
      className={`w-full my-2 ${styleClasses[block.style]} ${thicknessClasses[block.thickness]}`}
      style={{ borderColor: block.color }}
    />
  );
}

// === HEADER ===
function HeaderBlockComponent({ block }: { block: HeaderBlock }) {
  const { state } = useBuilder();

  const styleClasses = {
    simple: "justify-between",
    centered: "justify-center",
    split: "justify-between",
  };

  return (
    <header
      className={`w-full py-4 px-6 ${block.sticky && !state.previewMode ? "border-2 border-dashed border-amber-300" : ""}`}
      style={{ backgroundColor: block.backgroundColor }}
    >
      <nav className={`flex items-center gap-6 ${styleClasses[block.style]}`}>
        {block.style === "centered" ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <span className="font-bold text-xl" style={{ color: block.textColor }}>
              {block.title}
            </span>
            {block.subtitle && (
              <span className="text-sm opacity-70" style={{ color: block.textColor }}>
                {block.subtitle}
              </span>
            )}
            {block.showNav && block.navLinks.length > 0 && (
              <div className="flex gap-6 mt-2">
                {block.navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="text-sm hover:opacity-70 transition-opacity"
                    style={{ color: block.textColor }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            <div>
              <span className="font-bold text-xl" style={{ color: block.textColor }}>
                {block.title}
              </span>
              {block.subtitle && (
                <span className="ml-3 text-sm opacity-70" style={{ color: block.textColor }}>
                  {block.subtitle}
                </span>
              )}
            </div>
            {block.showNav && block.navLinks.length > 0 && (
              <div className="flex gap-6">
                {block.navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    className="text-sm hover:opacity-70 transition-opacity"
                    style={{ color: block.textColor }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </nav>
      {!state.previewMode && block.sticky && (
        <div className="absolute top-1 right-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded">
          Sticky
        </div>
      )}
    </header>
  );
}

// === FOOTER ===
function FooterBlockComponent({ block }: { block: FooterBlock }) {
  const styleClasses = {
    simple: "text-left",
    centered: "text-center",
    columns: "text-center",
  };

  const socialIcons: Record<string, string> = {
    facebook: "f",
    twitter: "𝕏",
    instagram: "📷",
    linkedin: "in",
    youtube: "▶",
  };

  return (
    <footer
      className={`w-full py-8 px-6 ${styleClasses[block.style]}`}
      style={{ backgroundColor: block.backgroundColor }}
    >
      <div className={`${block.style === "centered" ? "flex flex-col items-center gap-4" : ""}`}>
        <p className="text-sm" style={{ color: block.textColor }}>
          {block.text}
        </p>
        {block.showSocials && block.socials.length > 0 && (
          <div className="flex gap-4 mt-4">
            {block.socials.map((social, i) => (
              <a
                key={i}
                href={social.url}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:opacity-70 transition-opacity"
                style={{
                  backgroundColor: block.textColor + "20",
                  color: block.textColor
                }}
              >
                {socialIcons[social.icon]}
              </a>
            ))}
          </div>
        )}
      </div>
    </footer>
  );
}

// === HERO ===
function HeroBlockComponent({ block }: { block: HeroBlock }) {
  const alignClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  return (
    <div
      className="relative w-full min-h-[400px] flex flex-col justify-center py-16 px-8 rounded-xl overflow-hidden"
      style={{
        backgroundColor: block.backgroundColor,
        backgroundImage: block.backgroundImage ? `url(${block.backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {block.overlay && block.backgroundImage && (
        <div className="absolute inset-0 bg-black/50" />
      )}
      <div className={`relative z-10 flex flex-col ${alignClasses[block.alignment]} max-w-2xl ${block.alignment === "center" ? "mx-auto" : block.alignment === "right" ? "ml-auto" : ""}`}>
        <h1 className="text-4xl font-bold mb-4" style={{ color: block.textColor }}>
          {block.title}
        </h1>
        <p className="text-lg opacity-90 mb-8" style={{ color: block.textColor }}>
          {block.subtitle}
        </p>
        <button
          className="px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: block.buttonColor }}
        >
          {block.buttonText}
        </button>
      </div>
    </div>
  );
}

// === FEATURES ===
function FeaturesBlockComponent({ block }: { block: FeaturesBlock }) {
  const columnsClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className="w-full py-12 px-6 rounded-xl" style={{ backgroundColor: block.backgroundColor }}>
      <h2 className="text-2xl font-bold text-center mb-10" style={{ color: block.textColor }}>
        {block.title}
      </h2>
      <div className={`grid ${columnsClasses[block.columns]} gap-8`}>
        {block.features.map((feature, i) => (
          <div key={i} className="flex flex-col items-center text-center p-4">
            <span className="text-4xl mb-4">{feature.icon}</span>
            <h3 className="text-lg font-semibold mb-2" style={{ color: block.textColor }}>
              {feature.title}
            </h3>
            <p className="text-sm opacity-70" style={{ color: block.textColor }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// === TESTIMONIAL ===
function TestimonialBlockComponent({ block }: { block: TestimonialBlock }) {
  const styleClasses = {
    simple: "",
    card: "shadow-lg",
    centered: "",
  };

  return (
    <div
      className={`w-full py-10 px-8 rounded-xl ${styleClasses[block.style]}`}
      style={{ backgroundColor: block.backgroundColor }}
    >
      <div className={`flex flex-col ${block.style === "centered" ? "items-center text-center" : ""} max-w-2xl ${block.style === "centered" ? "mx-auto" : ""}`}>
        <div className="text-4xl mb-4 opacity-30" style={{ color: block.textColor }}>"</div>
        <p className="text-lg italic mb-6 leading-relaxed" style={{ color: block.textColor }}>
          {block.quote}
        </p>
        <div className={`flex items-center gap-4 ${block.style === "centered" ? "flex-col" : ""}`}>
          <img
            src={block.avatar}
            alt={block.author}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className={block.style === "centered" ? "text-center" : ""}>
            <p className="font-semibold" style={{ color: block.textColor }}>{block.author}</p>
            <p className="text-sm opacity-70" style={{ color: block.textColor }}>{block.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// === CTA ===
function CtaBlockComponent({ block }: { block: CtaBlock }) {
  return (
    <div
      className="w-full py-16 px-8 rounded-xl text-center"
      style={{ backgroundColor: block.backgroundColor }}
    >
      <h2 className="text-3xl font-bold mb-4" style={{ color: block.textColor }}>
        {block.title}
      </h2>
      <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto" style={{ color: block.textColor }}>
        {block.description}
      </p>
      <button
        className="px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
        style={{ backgroundColor: block.buttonColor }}
      >
        {block.buttonText}
      </button>
    </div>
  );
}

// === GALLERY ===
function GalleryBlockComponent({ block }: { block: GalleryBlock }) {
  const columnsClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };
  const gapClasses = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
  };

  return (
    <div className={`grid ${columnsClasses[block.columns]} ${gapClasses[block.gap]} w-full`}>
      {block.images.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt}
          className={`w-full aspect-square object-cover ${roundedClasses[block.rounded]}`}
        />
      ))}
    </div>
  );
}

// === CARD ===
function CardBlockComponent({ block }: { block: CardBlock }) {
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  };
  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  return (
    <div
      className={`w-full overflow-hidden ${roundedClasses[block.rounded]} ${shadowClasses[block.shadow]}`}
      style={{ backgroundColor: block.backgroundColor }}
    >
      <img
        src={block.image}
        alt={block.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2" style={{ color: block.textColor }}>
          {block.title}
        </h3>
        <p className="text-sm opacity-70 mb-4" style={{ color: block.textColor }}>
          {block.description}
        </p>
        <button
          className="px-6 py-2 rounded-lg font-medium text-white text-sm hover:opacity-90 transition-opacity"
          style={{ backgroundColor: block.buttonColor }}
        >
          {block.buttonText}
        </button>
      </div>
    </div>
  );
}
