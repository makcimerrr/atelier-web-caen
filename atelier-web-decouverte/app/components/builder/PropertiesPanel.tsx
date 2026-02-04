"use client";

import { useBuilder } from "../../context/BuilderContext";
import {
  Block,
  TextBlock,
  HeadingBlock,
  ImageBlock,
  ButtonBlock,
  RowBlock,
  SpacerBlock,
  DividerBlock,
  HeaderBlock,
  FooterBlock,
  HeroBlock,
  FeaturesBlock,
  TestimonialBlock,
  CtaBlock,
  GalleryBlock,
  CardBlock,
  VideoBlock,
  ListBlock,
  QuoteBlock,
  SocialsBlock,
  StatsBlock,
  AccordionBlock,
  PricingBlock,
  TEXT_COLORS,
  PRIMARY_COLORS,
  BACKGROUND_COLORS,
  DIVIDER_COLORS,
  SAMPLE_IMAGES,
  WIDTH_OPTIONS,
} from "../../types/builder";

export default function PropertiesPanel() {
  const { getSelectedBlock, selectBlock } = useBuilder();
  const selectedBlock = getSelectedBlock();

  if (!selectedBlock) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="text-5xl mb-4 opacity-30">👆</div>
          <p className="text-sm text-zinc-500 mb-2">
            Aucun élément sélectionné
          </p>
          <p className="text-xs text-zinc-400">
            Cliquez sur un élément dans le canvas pour modifier ses propriétés
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <h3 className="font-semibold text-zinc-800 flex items-center gap-2">
          <BlockIcon type={selectedBlock.type} />
          <span>{getBlockName(selectedBlock.type)}</span>
        </h3>
        <button
          onClick={() => selectBlock(null)}
          className="p-1 text-zinc-400 hover:text-zinc-600 rounded"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Block Actions */}
      <BlockActions block={selectedBlock} />

      {/* Block Properties */}
      <div className="space-y-4 pt-2">
        {selectedBlock.type === "text" && <TextProperties block={selectedBlock} />}
        {selectedBlock.type === "heading" && <HeadingProperties block={selectedBlock} />}
        {selectedBlock.type === "image" && <ImageProperties block={selectedBlock} />}
        {selectedBlock.type === "button" && <ButtonProperties block={selectedBlock} />}
        {selectedBlock.type === "row" && <RowProperties block={selectedBlock} />}
        {selectedBlock.type === "spacer" && <SpacerProperties block={selectedBlock} />}
        {selectedBlock.type === "divider" && <DividerProperties block={selectedBlock} />}
        {selectedBlock.type === "header" && <HeaderProperties block={selectedBlock} />}
        {selectedBlock.type === "footer" && <FooterProperties block={selectedBlock} />}
        {selectedBlock.type === "hero" && <HeroProperties block={selectedBlock} />}
        {selectedBlock.type === "features" && <FeaturesProperties block={selectedBlock} />}
        {selectedBlock.type === "testimonial" && <TestimonialProperties block={selectedBlock} />}
        {selectedBlock.type === "cta" && <CtaProperties block={selectedBlock} />}
        {selectedBlock.type === "gallery" && <GalleryProperties block={selectedBlock} />}
        {selectedBlock.type === "card" && <CardProperties block={selectedBlock} />}
        {selectedBlock.type === "video" && <VideoProperties block={selectedBlock} />}
        {selectedBlock.type === "list" && <ListProperties block={selectedBlock} />}
        {selectedBlock.type === "quote" && <QuoteProperties block={selectedBlock} />}
        {selectedBlock.type === "socials" && <SocialsProperties block={selectedBlock} />}
        {selectedBlock.type === "stats" && <StatsProperties block={selectedBlock} />}
        {selectedBlock.type === "accordion" && <AccordionProperties block={selectedBlock} />}
        {selectedBlock.type === "pricing" && <PricingProperties block={selectedBlock} />}
      </div>
    </div>
  );
}

function BlockIcon({ type }: { type: Block["type"] }) {
  const icons: Record<Block["type"], string> = {
    heading: "H",
    text: "T",
    image: "🖼",
    button: "▢",
    row: "⊞",
    spacer: "↕",
    divider: "—",
    header: "🏠",
    footer: "📋",
    hero: "🚀",
    features: "✨",
    testimonial: "💬",
    cta: "📣",
    gallery: "🖼️",
    card: "🃏",
    video: "▶️",
    list: "📝",
    quote: "❝",
    socials: "🔗",
    stats: "📊",
    accordion: "📂",
    pricing: "💰",
  };
  return <span className="text-lg">{icons[type]}</span>;
}

function getBlockName(type: Block["type"]): string {
  const names: Record<Block["type"], string> = {
    heading: "Titre",
    text: "Texte",
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
    video: "Vidéo",
    list: "Liste",
    quote: "Citation",
    socials: "Réseaux sociaux",
    stats: "Statistiques",
    accordion: "Accordéon",
    pricing: "Tarif",
  };
  return names[type];
}

function BlockActions({ block }: { block: Block }) {
  const { deleteBlock, duplicateBlock } = useBuilder();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => duplicateBlock(block.id)}
        className="flex-1 py-2 px-3 text-sm bg-zinc-100 hover:bg-zinc-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        Dupliquer
      </button>
      <button
        onClick={() => deleteBlock(block.id)}
        className="flex-1 py-2 px-3 text-sm bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Supprimer
      </button>
    </div>
  );
}

// === TEXT PROPERTIES ===
function TextProperties({ block }: { block: TextBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Contenu</label>
        <textarea
          value={block.content}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          rows={4}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Taille</label>
          <select
            value={block.fontSize}
            onChange={(e) => updateBlock(block.id, { fontSize: e.target.value as TextBlock["fontSize"] })}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
          >
            <option value="sm">Petit</option>
            <option value="base">Normal</option>
            <option value="lg">Grand</option>
            <option value="xl">Très grand</option>
            <option value="2xl">Énorme</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Poids</label>
          <select
            value={block.fontWeight}
            onChange={(e) => updateBlock(block.id, { fontWeight: e.target.value as TextBlock["fontWeight"] })}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
          >
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="semibold">Semi-gras</option>
            <option value="bold">Gras</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Alignement</label>
        <ButtonGroup
          options={[
            { value: "left", label: "←" },
            { value: "center", label: "↔" },
            { value: "right", label: "→" },
          ]}
          value={block.textAlign}
          onChange={(value) => updateBlock(block.id, { textAlign: value as TextBlock["textAlign"] })}
        />
      </div>

      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === HEADING PROPERTIES ===
function HeadingProperties({ block }: { block: HeadingBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Contenu</label>
        <input
          type="text"
          value={block.content}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Niveau</label>
        <ButtonGroup
          options={[
            { value: "h1", label: "H1" },
            { value: "h2", label: "H2" },
            { value: "h3", label: "H3" },
            { value: "h4", label: "H4" },
          ]}
          value={block.level}
          onChange={(value) => updateBlock(block.id, { level: value as HeadingBlock["level"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Alignement</label>
        <ButtonGroup
          options={[
            { value: "left", label: "←" },
            { value: "center", label: "↔" },
            { value: "right", label: "→" },
          ]}
          value={block.textAlign}
          onChange={(value) => updateBlock(block.id, { textAlign: value as HeadingBlock["textAlign"] })}
        />
      </div>

      <ColorPicker
        label="Couleur"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === IMAGE PROPERTIES ===
function ImageProperties({ block }: { block: ImageBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Image</label>
        <div className="grid grid-cols-4 gap-1.5">
          {SAMPLE_IMAGES.map((img) => (
            <button
              key={img.name}
              onClick={() => updateBlock(block.id, { src: img.url, alt: img.name })}
              className={`aspect-video rounded overflow-hidden border-2 transition-all ${
                block.src === img.url ? "border-blue-500 ring-1 ring-blue-300" : "border-zinc-200 hover:border-zinc-300"
              }`}
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Arrondi</label>
        <ButtonGroup
          options={[
            { value: "none", label: "Aucun" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
            { value: "xl", label: "XL" },
          ]}
          value={block.rounded}
          onChange={(value) => updateBlock(block.id, { rounded: value as ImageBlock["rounded"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Ombre</label>
        <ButtonGroup
          options={[
            { value: "none", label: "Aucune" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
          value={block.shadow}
          onChange={(value) => updateBlock(block.id, { shadow: value as ImageBlock["shadow"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Ratio</label>
        <ButtonGroup
          options={[
            { value: "auto", label: "Auto" },
            { value: "square", label: "1:1" },
            { value: "video", label: "16:9" },
            { value: "wide", label: "21:9" },
          ]}
          value={block.aspectRatio}
          onChange={(value) => updateBlock(block.id, { aspectRatio: value as ImageBlock["aspectRatio"] })}
        />
      </div>
    </>
  );
}

// === BUTTON PROPERTIES ===
function ButtonProperties({ block }: { block: ButtonBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Texte</label>
        <input
          type="text"
          value={block.text}
          onChange={(e) => updateBlock(block.id, { text: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Style</label>
        <ButtonGroup
          options={[
            { value: "filled", label: "Plein" },
            { value: "outline", label: "Contour" },
            { value: "ghost", label: "Texte" },
          ]}
          value={block.variant}
          onChange={(value) => updateBlock(block.id, { variant: value as ButtonBlock["variant"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Taille</label>
        <ButtonGroup
          options={[
            { value: "sm", label: "Petit" },
            { value: "md", label: "Moyen" },
            { value: "lg", label: "Grand" },
          ]}
          value={block.size}
          onChange={(value) => updateBlock(block.id, { size: value as ButtonBlock["size"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Arrondi</label>
        <ButtonGroup
          options={[
            { value: "none", label: "Aucun" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
            { value: "full", label: "Rond" },
          ]}
          value={block.rounded}
          onChange={(value) => updateBlock(block.id, { rounded: value as ButtonBlock["rounded"] })}
        />
      </div>

      <ColorPicker
        label="Couleur"
        colors={PRIMARY_COLORS}
        value={block.color}
        onChange={(color) => updateBlock(block.id, { color })}
      />

      <Toggle
        label="Pleine largeur"
        checked={block.fullWidth}
        onChange={(checked) => updateBlock(block.id, { fullWidth: checked })}
      />
    </>
  );
}

// === ROW PROPERTIES ===
function RowProperties({ block }: { block: RowBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Espacement</label>
        <ButtonGroup
          options={[
            { value: "none", label: "0" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
            { value: "xl", label: "XL" },
          ]}
          value={block.gap}
          onChange={(value) => updateBlock(block.id, { gap: value as RowBlock["gap"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Alignement vertical</label>
        <ButtonGroup
          options={[
            { value: "start", label: "↑" },
            { value: "center", label: "↕" },
            { value: "end", label: "↓" },
            { value: "stretch", label: "⇕" },
          ]}
          value={block.align}
          onChange={(value) => updateBlock(block.id, { align: value as RowBlock["align"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Distribution</label>
        <ButtonGroup
          options={[
            { value: "start", label: "← " },
            { value: "center", label: "↔" },
            { value: "end", label: " →" },
            { value: "between", label: "⇔" },
          ]}
          value={block.justify}
          onChange={(value) => updateBlock(block.id, { justify: value as RowBlock["justify"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Padding</label>
        <ButtonGroup
          options={[
            { value: "none", label: "0" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
          value={block.padding}
          onChange={(value) => updateBlock(block.id, { padding: value as RowBlock["padding"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Arrondi</label>
        <ButtonGroup
          options={[
            { value: "none", label: "0" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
          value={block.rounded}
          onChange={(value) => updateBlock(block.id, { rounded: value as RowBlock["rounded"] })}
        />
      </div>

      <Toggle
        label="Retour à la ligne automatique"
        checked={block.wrap}
        onChange={(checked) => updateBlock(block.id, { wrap: checked })}
      />

      <ColorPicker
        label="Couleur de fond"
        colors={[{ name: "Transparent", value: "transparent" }, ...BACKGROUND_COLORS]}
        value={block.background}
        onChange={(color) => updateBlock(block.id, { background: color })}
      />

      <div className="pt-2 mt-2 border-t border-zinc-200">
        <div className="text-xs text-zinc-500">
          {block.children.length} élément{block.children.length !== 1 ? "s" : ""} dans cette ligne
        </div>
      </div>
    </>
  );
}

// === SPACER PROPERTIES ===
function SpacerProperties({ block }: { block: SpacerBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 mb-1.5">Taille</label>
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: "xs", label: "XS", desc: "8px" },
          { value: "sm", label: "S", desc: "16px" },
          { value: "md", label: "M", desc: "32px" },
          { value: "lg", label: "L", desc: "48px" },
          { value: "xl", label: "XL", desc: "64px" },
          { value: "2xl", label: "2XL", desc: "96px" },
        ].map(({ value, label, desc }) => (
          <button
            key={value}
            onClick={() => updateBlock(block.id, { size: value as SpacerBlock["size"] })}
            className={`p-2 text-center rounded-lg border transition-all ${
              block.size === value
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white border-zinc-200 hover:border-zinc-300"
            }`}
          >
            <div className="font-medium text-sm">{label}</div>
            <div className={`text-xs ${block.size === value ? "text-blue-100" : "text-zinc-400"}`}>{desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// === DIVIDER PROPERTIES ===
function DividerProperties({ block }: { block: DividerBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Style</label>
        <ButtonGroup
          options={[
            { value: "solid", label: "Plein" },
            { value: "dashed", label: "Tirets" },
            { value: "dotted", label: "Points" },
          ]}
          value={block.style}
          onChange={(value) => updateBlock(block.id, { style: value as DividerBlock["style"] })}
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Épaisseur</label>
        <ButtonGroup
          options={[
            { value: "thin", label: "Fin" },
            { value: "medium", label: "Moyen" },
            { value: "thick", label: "Épais" },
          ]}
          value={block.thickness}
          onChange={(value) => updateBlock(block.id, { thickness: value as DividerBlock["thickness"] })}
        />
      </div>

      <ColorPicker
        label="Couleur"
        colors={DIVIDER_COLORS}
        value={block.color}
        onChange={(color) => updateBlock(block.id, { color })}
      />
    </>
  );
}

// === HEADER PROPERTIES ===
function HeaderProperties({ block }: { block: HeaderBlock }) {
  const { updateBlock } = useBuilder();

  const updateNavLink = (index: number, updates: Partial<{ label: string; href: string }>) => {
    const newLinks = [...block.navLinks];
    newLinks[index] = { ...newLinks[index], ...updates };
    updateBlock(block.id, { navLinks: newLinks });
  };

  const addNavLink = () => {
    updateBlock(block.id, { navLinks: [...block.navLinks, { label: "Lien", href: "#" }] });
  };

  const removeNavLink = (index: number) => {
    updateBlock(block.id, { navLinks: block.navLinks.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Titre du site</label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Sous-titre</label>
        <input
          type="text"
          value={block.subtitle}
          onChange={(e) => updateBlock(block.id, { subtitle: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Optionnel"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Style</label>
        <ButtonGroup
          options={[
            { value: "simple", label: "Simple" },
            { value: "centered", label: "Centré" },
            { value: "split", label: "Séparé" },
          ]}
          value={block.style}
          onChange={(value) => updateBlock(block.id, { style: value as HeaderBlock["style"] })}
        />
      </div>

      <Toggle
        label="Navigation visible"
        checked={block.showNav}
        onChange={(checked) => updateBlock(block.id, { showNav: checked })}
      />

      {block.showNav && (
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Liens de navigation</label>
          <div className="space-y-2">
            {block.navLinks.map((link, index) => (
              <div key={index} className="flex gap-1.5 items-center">
                <input
                  type="text"
                  value={link.label}
                  onChange={(e) => updateNavLink(index, { label: e.target.value })}
                  className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-zinc-200 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="Texte"
                />
                <input
                  type="text"
                  value={link.href}
                  onChange={(e) => updateNavLink(index, { href: e.target.value })}
                  className="w-16 px-2 py-1.5 text-sm border border-zinc-200 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="#"
                />
                <button
                  onClick={() => removeNavLink(index)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={addNavLink}
              className="w-full py-1.5 text-sm text-blue-500 hover:bg-blue-50 border border-dashed border-blue-200 rounded-lg"
            >
              + Ajouter un lien
            </button>
          </div>
        </div>
      )}

      <Toggle
        label="Sticky (fixe en haut)"
        checked={block.sticky}
        onChange={(checked) => updateBlock(block.id, { sticky: checked })}
      />

      <ColorPicker
        label="Couleur de fond"
        colors={BACKGROUND_COLORS}
        value={block.backgroundColor}
        onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
      />

      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === FOOTER PROPERTIES ===
function FooterProperties({ block }: { block: FooterBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Texte</label>
        <input
          type="text"
          value={block.text}
          onChange={(e) => updateBlock(block.id, { text: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Style</label>
        <ButtonGroup
          options={[
            { value: "simple", label: "Simple" },
            { value: "centered", label: "Centré" },
          ]}
          value={block.style}
          onChange={(value) => updateBlock(block.id, { style: value as FooterBlock["style"] })}
        />
      </div>

      <ColorPicker
        label="Couleur de fond"
        colors={[...BACKGROUND_COLORS, { name: "Noir", value: "#18181b" }]}
        value={block.backgroundColor}
        onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
      />

      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === HERO PROPERTIES ===
function HeroProperties({ block }: { block: HeroBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Titre</label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Sous-titre</label>
        <textarea
          value={block.subtitle}
          onChange={(e) => updateBlock(block.id, { subtitle: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Texte du bouton</label>
        <input
          type="text"
          value={block.buttonText}
          onChange={(e) => updateBlock(block.id, { buttonText: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Alignement</label>
        <ButtonGroup
          options={[
            { value: "left", label: "Gauche" },
            { value: "center", label: "Centre" },
            { value: "right", label: "Droite" },
          ]}
          value={block.alignment}
          onChange={(value) => updateBlock(block.id, { alignment: value as HeroBlock["alignment"] })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Image de fond</label>
        <div className="grid grid-cols-4 gap-1.5">
          {SAMPLE_IMAGES.map((img) => (
            <button
              key={img.name}
              onClick={() => updateBlock(block.id, { backgroundImage: img.url })}
              className={`aspect-video rounded overflow-hidden border-2 transition-all ${
                block.backgroundImage === img.url ? "border-blue-500 ring-1 ring-blue-300" : "border-zinc-200"
              }`}
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <Toggle
        label="Superposition sombre"
        checked={block.overlay}
        onChange={(checked) => updateBlock(block.id, { overlay: checked })}
      />
      <ColorPicker
        label="Couleur du bouton"
        colors={PRIMARY_COLORS}
        value={block.buttonColor}
        onChange={(color) => updateBlock(block.id, { buttonColor: color })}
      />
      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === FEATURES PROPERTIES ===
function FeaturesProperties({ block }: { block: FeaturesBlock }) {
  const { updateBlock } = useBuilder();

  const updateFeature = (index: number, updates: Partial<{ icon: string; title: string; description: string }>) => {
    const newFeatures = [...block.features];
    newFeatures[index] = { ...newFeatures[index], ...updates };
    updateBlock(block.id, { features: newFeatures });
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Titre</label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Colonnes</label>
        <ButtonGroup
          options={[
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
          value={String(block.columns)}
          onChange={(value) => updateBlock(block.id, { columns: Number(value) as 2 | 3 | 4 })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Fonctionnalités</label>
        <div className="space-y-3">
          {block.features.map((feature, index) => (
            <div key={index} className="p-3 bg-zinc-50 rounded-lg space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={feature.icon}
                  onChange={(e) => updateFeature(index, { icon: e.target.value })}
                  className="w-12 px-2 py-1 text-center text-sm border border-zinc-200 rounded"
                  placeholder="🔥"
                />
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => updateFeature(index, { title: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-zinc-200 rounded"
                  placeholder="Titre"
                />
              </div>
              <input
                type="text"
                value={feature.description}
                onChange={(e) => updateFeature(index, { description: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-zinc-200 rounded"
                placeholder="Description"
              />
            </div>
          ))}
        </div>
      </div>
      <ColorPicker
        label="Couleur de fond"
        colors={BACKGROUND_COLORS}
        value={block.backgroundColor}
        onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
      />
      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === TESTIMONIAL PROPERTIES ===
function TestimonialProperties({ block }: { block: TestimonialBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Citation</label>
        <textarea
          value={block.quote}
          onChange={(e) => updateBlock(block.id, { quote: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Auteur</label>
          <input
            type="text"
            value={block.author}
            onChange={(e) => updateBlock(block.id, { author: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Rôle</label>
          <input
            type="text"
            value={block.role}
            onChange={(e) => updateBlock(block.id, { role: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Style</label>
        <ButtonGroup
          options={[
            { value: "simple", label: "Simple" },
            { value: "card", label: "Carte" },
            { value: "centered", label: "Centré" },
          ]}
          value={block.style}
          onChange={(value) => updateBlock(block.id, { style: value as TestimonialBlock["style"] })}
        />
      </div>
      <ColorPicker
        label="Couleur de fond"
        colors={BACKGROUND_COLORS}
        value={block.backgroundColor}
        onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
      />
    </>
  );
}

// === CTA PROPERTIES ===
function CtaProperties({ block }: { block: CtaBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Titre</label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Description</label>
        <textarea
          value={block.description}
          onChange={(e) => updateBlock(block.id, { description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Texte du bouton</label>
        <input
          type="text"
          value={block.buttonText}
          onChange={(e) => updateBlock(block.id, { buttonText: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
        />
      </div>
      <ColorPicker
        label="Couleur du bouton"
        colors={PRIMARY_COLORS}
        value={block.buttonColor}
        onChange={(color) => updateBlock(block.id, { buttonColor: color })}
      />
      <ColorPicker
        label="Couleur de fond"
        colors={[...PRIMARY_COLORS, ...BACKGROUND_COLORS]}
        value={block.backgroundColor}
        onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
      />
      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === GALLERY PROPERTIES ===
function GalleryProperties({ block }: { block: GalleryBlock }) {
  const { updateBlock } = useBuilder();

  const updateImage = (index: number, src: string) => {
    const newImages = [...block.images];
    newImages[index] = { ...newImages[index], src };
    updateBlock(block.id, { images: newImages });
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Colonnes</label>
        <ButtonGroup
          options={[
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
          value={String(block.columns)}
          onChange={(value) => updateBlock(block.id, { columns: Number(value) as 2 | 3 | 4 })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Espacement</label>
        <ButtonGroup
          options={[
            { value: "none", label: "0" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
          value={block.gap}
          onChange={(value) => updateBlock(block.id, { gap: value as GalleryBlock["gap"] })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Arrondi</label>
        <ButtonGroup
          options={[
            { value: "none", label: "0" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
          value={block.rounded}
          onChange={(value) => updateBlock(block.id, { rounded: value as GalleryBlock["rounded"] })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Images</label>
        <div className="space-y-2">
          {block.images.map((img, index) => (
            <div key={index} className="flex gap-2 items-center">
              <img src={img.src} alt={img.alt} className="w-12 h-12 rounded object-cover" />
              <select
                value={img.src}
                onChange={(e) => updateImage(index, e.target.value)}
                className="flex-1 px-2 py-1.5 text-sm border border-zinc-200 rounded"
              >
                {SAMPLE_IMAGES.map((sample) => (
                  <option key={sample.name} value={sample.url}>{sample.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// === CARD PROPERTIES ===
function CardProperties({ block }: { block: CardBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Image</label>
        <div className="grid grid-cols-4 gap-1.5">
          {SAMPLE_IMAGES.map((img) => (
            <button
              key={img.name}
              onClick={() => updateBlock(block.id, { image: img.url })}
              className={`aspect-video rounded overflow-hidden border-2 transition-all ${
                block.image === img.url ? "border-blue-500" : "border-zinc-200"
              }`}
            >
              <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Titre</label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Description</label>
        <textarea
          value={block.description}
          onChange={(e) => updateBlock(block.id, { description: e.target.value })}
          rows={2}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Texte du bouton</label>
        <input
          type="text"
          value={block.buttonText}
          onChange={(e) => updateBlock(block.id, { buttonText: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
        />
      </div>
      <ColorPicker
        label="Couleur du bouton"
        colors={PRIMARY_COLORS}
        value={block.buttonColor}
        onChange={(color) => updateBlock(block.id, { buttonColor: color })}
      />
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Arrondi</label>
        <ButtonGroup
          options={[
            { value: "none", label: "0" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
          value={block.rounded}
          onChange={(value) => updateBlock(block.id, { rounded: value as CardBlock["rounded"] })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Ombre</label>
        <ButtonGroup
          options={[
            { value: "none", label: "0" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
          value={block.shadow}
          onChange={(value) => updateBlock(block.id, { shadow: value as CardBlock["shadow"] })}
        />
      </div>
    </>
  );
}

// === VIDEO PROPERTIES ===
function VideoProperties({ block }: { block: VideoBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">URL de la vidéo</label>
        <input
          type="text"
          value={block.url}
          onChange={(e) => updateBlock(block.id, { url: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="https://youtube.com/watch?v=..."
        />
        <p className="text-xs text-zinc-400 mt-1">YouTube, Vimeo, ou URL directe</p>
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Format</label>
        <ButtonGroup
          options={[
            { value: "16/9", label: "16:9" },
            { value: "4/3", label: "4:3" },
            { value: "1/1", label: "1:1" },
          ]}
          value={block.aspectRatio}
          onChange={(value) => updateBlock(block.id, { aspectRatio: value as VideoBlock["aspectRatio"] })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Arrondi</label>
        <ButtonGroup
          options={[
            { value: "none", label: "0" },
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
            { value: "xl", label: "XL" },
          ]}
          value={block.rounded}
          onChange={(value) => updateBlock(block.id, { rounded: value as VideoBlock["rounded"] })}
        />
      </div>
      <Toggle
        label="Lecture automatique"
        checked={block.autoplay}
        onChange={(checked) => updateBlock(block.id, { autoplay: checked })}
      />
    </>
  );
}

// === LIST PROPERTIES ===
function ListProperties({ block }: { block: ListBlock }) {
  const { updateBlock } = useBuilder();

  const updateItem = (index: number, value: string) => {
    const newItems = [...block.items];
    newItems[index] = value;
    updateBlock(block.id, { items: newItems });
  };

  const addItem = () => {
    updateBlock(block.id, { items: [...block.items, "Nouvel élément"] });
  };

  const removeItem = (index: number) => {
    updateBlock(block.id, { items: block.items.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Style</label>
        <ButtonGroup
          options={[
            { value: "bullet", label: "•" },
            { value: "number", label: "1." },
            { value: "check", label: "✓" },
            { value: "arrow", label: "→" },
          ]}
          value={block.style}
          onChange={(value) => updateBlock(block.id, { style: value as ListBlock["style"] })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Éléments</label>
        <div className="space-y-2">
          {block.items.map((item, index) => (
            <div key={index} className="flex gap-1.5 items-center">
              <input
                type="text"
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-zinc-200 rounded focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeItem(index)}
                className="p-1 text-zinc-400 hover:text-red-500 rounded"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addItem}
            className="w-full py-1.5 text-sm text-blue-500 hover:bg-blue-50 border border-dashed border-blue-200 rounded-lg"
          >
            + Ajouter un élément
          </button>
        </div>
      </div>
      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
      <ColorPicker
        label="Couleur des icônes"
        colors={PRIMARY_COLORS}
        value={block.iconColor}
        onChange={(color) => updateBlock(block.id, { iconColor: color })}
      />
    </>
  );
}

// === QUOTE PROPERTIES ===
function QuoteProperties({ block }: { block: QuoteBlock }) {
  const { updateBlock } = useBuilder();

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Citation</label>
        <textarea
          value={block.content}
          onChange={(e) => updateBlock(block.id, { content: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Auteur</label>
        <input
          type="text"
          value={block.author}
          onChange={(e) => updateBlock(block.id, { author: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Style</label>
        <ButtonGroup
          options={[
            { value: "simple", label: "Simple" },
            { value: "bordered", label: "Bordure" },
            { value: "filled", label: "Rempli" },
          ]}
          value={block.style}
          onChange={(value) => updateBlock(block.id, { style: value as QuoteBlock["style"] })}
        />
      </div>
      <ColorPicker
        label="Couleur d'accent"
        colors={PRIMARY_COLORS}
        value={block.accentColor}
        onChange={(color) => updateBlock(block.id, { accentColor: color })}
      />
      <ColorPicker
        label="Couleur de fond"
        colors={BACKGROUND_COLORS}
        value={block.backgroundColor}
        onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
      />
      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === SOCIALS PROPERTIES ===
function SocialsProperties({ block }: { block: SocialsBlock }) {
  const { updateBlock } = useBuilder();

  const platforms = ["facebook", "twitter", "instagram", "linkedin", "youtube", "tiktok", "github"] as const;
  const platformIcons: Record<typeof platforms[number], string> = {
    facebook: "📘",
    twitter: "🐦",
    instagram: "📷",
    linkedin: "💼",
    youtube: "▶️",
    tiktok: "🎵",
    github: "💻",
  };

  const updateLink = (index: number, updates: Partial<{ platform: typeof platforms[number]; url: string }>) => {
    const newLinks = [...block.links];
    newLinks[index] = { ...newLinks[index], ...updates };
    updateBlock(block.id, { links: newLinks });
  };

  const addLink = () => {
    updateBlock(block.id, { links: [...block.links, { platform: "facebook", url: "#" }] });
  };

  const removeLink = (index: number) => {
    updateBlock(block.id, { links: block.links.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Style</label>
        <ButtonGroup
          options={[
            { value: "filled", label: "Plein" },
            { value: "outline", label: "Contour" },
            { value: "minimal", label: "Minimal" },
          ]}
          value={block.style}
          onChange={(value) => updateBlock(block.id, { style: value as SocialsBlock["style"] })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Taille</label>
        <ButtonGroup
          options={[
            { value: "sm", label: "S" },
            { value: "md", label: "M" },
            { value: "lg", label: "L" },
          ]}
          value={block.size}
          onChange={(value) => updateBlock(block.id, { size: value as SocialsBlock["size"] })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Réseaux</label>
        <div className="space-y-2">
          {block.links.map((link, index) => (
            <div key={index} className="flex gap-1.5 items-center">
              <select
                value={link.platform}
                onChange={(e) => updateLink(index, { platform: e.target.value as typeof platforms[number] })}
                className="w-20 px-2 py-1.5 text-sm border border-zinc-200 rounded"
              >
                {platforms.map((p) => (
                  <option key={p} value={p}>{platformIcons[p]}</option>
                ))}
              </select>
              <input
                type="text"
                value={link.url}
                onChange={(e) => updateLink(index, { url: e.target.value })}
                className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-zinc-200 rounded focus:ring-2 focus:ring-blue-500"
                placeholder="URL"
              />
              <button
                onClick={() => removeLink(index)}
                className="p-1 text-zinc-400 hover:text-red-500 rounded"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addLink}
            className="w-full py-1.5 text-sm text-blue-500 hover:bg-blue-50 border border-dashed border-blue-200 rounded-lg"
          >
            + Ajouter un réseau
          </button>
        </div>
      </div>
      <ColorPicker
        label="Couleur"
        colors={PRIMARY_COLORS}
        value={block.color}
        onChange={(color) => updateBlock(block.id, { color })}
      />
    </>
  );
}

// === STATS PROPERTIES ===
function StatsProperties({ block }: { block: StatsBlock }) {
  const { updateBlock } = useBuilder();

  const updateStat = (index: number, updates: Partial<{ value: string; label: string; icon?: string }>) => {
    const newStats = [...block.stats];
    newStats[index] = { ...newStats[index], ...updates };
    updateBlock(block.id, { stats: newStats });
  };

  const addStat = () => {
    updateBlock(block.id, { stats: [...block.stats, { value: "0", label: "Nouveau", icon: "📊" }] });
  };

  const removeStat = (index: number) => {
    updateBlock(block.id, { stats: block.stats.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Colonnes</label>
        <ButtonGroup
          options={[
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ]}
          value={String(block.columns)}
          onChange={(value) => updateBlock(block.id, { columns: Number(value) as 2 | 3 | 4 })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Statistiques</label>
        <div className="space-y-3">
          {block.stats.map((stat, index) => (
            <div key={index} className="p-3 bg-zinc-50 rounded-lg space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={stat.icon || ""}
                  onChange={(e) => updateStat(index, { icon: e.target.value })}
                  className="w-12 px-2 py-1 text-center text-sm border border-zinc-200 rounded"
                  placeholder="🔥"
                />
                <input
                  type="text"
                  value={stat.value}
                  onChange={(e) => updateStat(index, { value: e.target.value })}
                  className="flex-1 px-2 py-1 text-sm border border-zinc-200 rounded font-bold"
                  placeholder="100+"
                />
                <button
                  onClick={() => removeStat(index)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(index, { label: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-zinc-200 rounded"
                placeholder="Label"
              />
            </div>
          ))}
          <button
            onClick={addStat}
            className="w-full py-1.5 text-sm text-blue-500 hover:bg-blue-50 border border-dashed border-blue-200 rounded-lg"
          >
            + Ajouter une stat
          </button>
        </div>
      </div>
      <ColorPicker
        label="Couleur d'accent"
        colors={PRIMARY_COLORS}
        value={block.accentColor}
        onChange={(color) => updateBlock(block.id, { accentColor: color })}
      />
      <ColorPicker
        label="Couleur de fond"
        colors={BACKGROUND_COLORS}
        value={block.backgroundColor}
        onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
      />
      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === ACCORDION PROPERTIES ===
function AccordionProperties({ block }: { block: AccordionBlock }) {
  const { updateBlock } = useBuilder();

  const updateItem = (index: number, updates: Partial<{ question: string; answer: string }>) => {
    const newItems = [...block.items];
    newItems[index] = { ...newItems[index], ...updates };
    updateBlock(block.id, { items: newItems });
  };

  const addItem = () => {
    updateBlock(block.id, { items: [...block.items, { question: "Nouvelle question ?", answer: "Réponse..." }] });
  };

  const removeItem = (index: number) => {
    updateBlock(block.id, { items: block.items.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Style</label>
        <ButtonGroup
          options={[
            { value: "simple", label: "Simple" },
            { value: "bordered", label: "Bordure" },
            { value: "filled", label: "Rempli" },
          ]}
          value={block.style}
          onChange={(value) => updateBlock(block.id, { style: value as AccordionBlock["style"] })}
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Questions / Réponses</label>
        <div className="space-y-3">
          {block.items.map((item, index) => (
            <div key={index} className="p-3 bg-zinc-50 rounded-lg space-y-2">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.question}
                    onChange={(e) => updateItem(index, { question: e.target.value })}
                    className="w-full px-2 py-1 text-sm border border-zinc-200 rounded font-medium"
                    placeholder="Question ?"
                  />
                  <textarea
                    value={item.answer}
                    onChange={(e) => updateItem(index, { answer: e.target.value })}
                    rows={2}
                    className="w-full px-2 py-1 text-sm border border-zinc-200 rounded resize-none"
                    placeholder="Réponse..."
                  />
                </div>
                <button
                  onClick={() => removeItem(index)}
                  className="p-1 text-zinc-400 hover:text-red-500 rounded flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={addItem}
            className="w-full py-1.5 text-sm text-blue-500 hover:bg-blue-50 border border-dashed border-blue-200 rounded-lg"
          >
            + Ajouter une question
          </button>
        </div>
      </div>
      <ColorPicker
        label="Couleur d'accent"
        colors={PRIMARY_COLORS}
        value={block.accentColor}
        onChange={(color) => updateBlock(block.id, { accentColor: color })}
      />
      <ColorPicker
        label="Couleur de fond"
        colors={BACKGROUND_COLORS}
        value={block.backgroundColor}
        onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
      />
      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === PRICING PROPERTIES ===
function PricingProperties({ block }: { block: PricingBlock }) {
  const { updateBlock } = useBuilder();

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...block.features];
    newFeatures[index] = value;
    updateBlock(block.id, { features: newFeatures });
  };

  const addFeature = () => {
    updateBlock(block.id, { features: [...block.features, "Nouvelle fonctionnalité"] });
  };

  const removeFeature = (index: number) => {
    updateBlock(block.id, { features: block.features.filter((_, i) => i !== index) });
  };

  return (
    <>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Titre du plan</label>
        <input
          type="text"
          value={block.title}
          onChange={(e) => updateBlock(block.id, { title: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Prix</label>
          <input
            type="text"
            value={block.price}
            onChange={(e) => updateBlock(block.id, { price: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
            placeholder="29€"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-500 mb-1.5">Période</label>
          <input
            type="text"
            value={block.period}
            onChange={(e) => updateBlock(block.id, { period: e.target.value })}
            className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
            placeholder="/mois"
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Fonctionnalités</label>
        <div className="space-y-2">
          {block.features.map((feature, index) => (
            <div key={index} className="flex gap-1.5 items-center">
              <span className="text-green-500">✓</span>
              <input
                type="text"
                value={feature}
                onChange={(e) => updateFeature(index, e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 text-sm border border-zinc-200 rounded focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => removeFeature(index)}
                className="p-1 text-zinc-400 hover:text-red-500 rounded"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={addFeature}
            className="w-full py-1.5 text-sm text-blue-500 hover:bg-blue-50 border border-dashed border-blue-200 rounded-lg"
          >
            + Ajouter une fonctionnalité
          </button>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-zinc-500 mb-1.5">Texte du bouton</label>
        <input
          type="text"
          value={block.buttonText}
          onChange={(e) => updateBlock(block.id, { buttonText: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg"
        />
      </div>
      <Toggle
        label="Mise en avant"
        checked={block.highlighted}
        onChange={(checked) => updateBlock(block.id, { highlighted: checked })}
      />
      <ColorPicker
        label="Couleur du bouton"
        colors={PRIMARY_COLORS}
        value={block.buttonColor}
        onChange={(color) => updateBlock(block.id, { buttonColor: color })}
      />
      <ColorPicker
        label="Couleur de fond"
        colors={BACKGROUND_COLORS}
        value={block.backgroundColor}
        onChange={(color) => updateBlock(block.id, { backgroundColor: color })}
      />
      <ColorPicker
        label="Couleur du texte"
        colors={TEXT_COLORS}
        value={block.textColor}
        onChange={(color) => updateBlock(block.id, { textColor: color })}
      />
    </>
  );
}

// === SHARED COMPONENTS ===
function ButtonGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-1">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 py-2 text-xs font-medium rounded-lg transition-all ${
            value === option.value
              ? "bg-blue-500 text-white"
              : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({
  label,
  colors,
  value,
  onChange,
}: {
  label: string;
  colors: { name: string; value: string }[];
  value: string;
  onChange: (color: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-500 mb-1.5">{label}</label>
      <div className="flex gap-1.5 flex-wrap">
        {colors.map((color) => (
          <button
            key={color.value}
            onClick={() => onChange(color.value)}
            className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
              value === color.value
                ? "border-blue-500 ring-2 ring-offset-1 ring-blue-300"
                : "border-zinc-200"
            }`}
            style={{
              backgroundColor: color.value === "transparent" ? "#fff" : color.value,
              backgroundImage: color.value === "transparent"
                ? "linear-gradient(45deg, #e4e4e7 25%, transparent 25%), linear-gradient(-45deg, #e4e4e7 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e4e4e7 75%), linear-gradient(-45deg, transparent 75%, #e4e4e7 75%)"
                : undefined,
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
            }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
      <span className="text-sm text-zinc-600">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          checked ? "bg-blue-500" : "bg-zinc-300"
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
