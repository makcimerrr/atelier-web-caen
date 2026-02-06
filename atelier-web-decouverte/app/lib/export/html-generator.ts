import { Block, SiteSettings } from "@/app/types/builder";

interface GeneratorContext {
  usedClasses: Set<string>;
  settings: SiteSettings;
}

function addClasses(ctx: GeneratorContext, classes: string): void {
  classes.split(/\s+/).filter(Boolean).forEach(c => ctx.usedClasses.add(c));
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// === HEADING ===
function generateHeadingHTML(block: Extract<Block, { type: "heading" }>, ctx: GeneratorContext): string {
  const sizeClasses: Record<string, string> = {
    h1: "text-4xl font-bold",
    h2: "text-3xl font-bold",
    h3: "text-2xl font-semibold",
    h4: "text-xl font-semibold",
  };
  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  addClasses(ctx, `${sizeClasses[block.level]} ${alignClasses[block.textAlign]}`);

  return `<${block.level} class="${sizeClasses[block.level]} ${alignClasses[block.textAlign]}" style="color: ${block.textColor};">${escapeHtml(block.content)}</${block.level}>`;
}

// === TEXT ===
function generateTextHTML(block: Extract<Block, { type: "text" }>, ctx: GeneratorContext): string {
  const sizeClasses: Record<string, string> = {
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
  };
  const weightClasses: Record<string, string> = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };
  const alignClasses: Record<string, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const classes = `${sizeClasses[block.fontSize]} ${weightClasses[block.fontWeight]} ${alignClasses[block.textAlign]} leading-relaxed`;
  addClasses(ctx, classes);

  return `<p class="${classes}" style="color: ${block.textColor};">${escapeHtml(block.content)}</p>`;
}

// === IMAGE ===
function generateImageHTML(block: Extract<Block, { type: "image" }>, ctx: GeneratorContext): string {
  const roundedClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
    full: "rounded-full",
  };
  const shadowClasses: Record<string, string> = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };
  const aspectClasses: Record<string, string> = {
    auto: "",
    square: "aspect-square object-cover",
    video: "aspect-video object-cover",
    wide: "aspect-[21/9] object-cover",
  };

  const classes = `w-full h-auto ${roundedClasses[block.rounded]} ${shadowClasses[block.shadow]} ${aspectClasses[block.aspectRatio]}`.trim();
  addClasses(ctx, classes);

  return `<img src="${escapeHtml(block.src)}" alt="${escapeHtml(block.alt)}" class="${classes}">`;
}

// === BUTTON ===
function generateButtonHTML(block: Extract<Block, { type: "button" }>, ctx: GeneratorContext): string {
  const sizeClasses: Record<string, string> = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-8 py-3 text-lg",
  };
  const roundedClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    full: "rounded-full",
  };

  const baseClass = `${sizeClasses[block.size]} ${roundedClasses[block.rounded]} font-medium transition-all ${block.fullWidth ? "w-full" : "inline-block"}`;
  addClasses(ctx, baseClass);

  let style = "";
  if (block.variant === "filled") {
    style = `background-color: ${block.color}; color: white;`;
  } else if (block.variant === "outline") {
    style = `border: 2px solid ${block.color}; color: ${block.color}; background: transparent;`;
  } else {
    style = `color: ${block.color}; background: transparent;`;
  }

  return `<button class="${baseClass}" style="${style}">${escapeHtml(block.text)}</button>`;
}

// === SPACER ===
function generateSpacerHTML(block: Extract<Block, { type: "spacer" }>, ctx: GeneratorContext): string {
  const sizeClasses: Record<string, string> = {
    xs: "h-2",
    sm: "h-4",
    md: "h-8",
    lg: "h-12",
    xl: "h-16",
    "2xl": "h-24",
  };
  addClasses(ctx, `w-full ${sizeClasses[block.size]}`);
  return `<div class="w-full ${sizeClasses[block.size]}"></div>`;
}

// === DIVIDER ===
function generateDividerHTML(block: Extract<Block, { type: "divider" }>, ctx: GeneratorContext): string {
  const styleClasses: Record<string, string> = {
    solid: "border-solid",
    dashed: "border-dashed",
    dotted: "border-dotted",
  };
  const thicknessClasses: Record<string, string> = {
    thin: "border-t",
    medium: "border-t-2",
    thick: "border-t-4",
  };

  const classes = `w-full my-2 ${styleClasses[block.style]} ${thicknessClasses[block.thickness]}`;
  addClasses(ctx, classes);

  return `<hr class="${classes}" style="border-color: ${block.color};">`;
}

// === HEADER ===
function generateHeaderHTML(block: Extract<Block, { type: "header" }>, ctx: GeneratorContext): string {
  addClasses(ctx, "w-full py-4 px-6 flex items-center gap-6 font-bold text-xl text-sm opacity-70 transition-opacity ml-3 flex-col gap-2 mt-2");

  const styleClasses: Record<string, string> = {
    simple: "justify-between",
    centered: "justify-center",
    split: "justify-between",
  };

  let navContent = "";
  if (block.style === "centered") {
    navContent = `
    <div class="flex flex-col items-center gap-2 w-full">
      <span class="font-bold text-xl" style="color: ${block.textColor};">${escapeHtml(block.title)}</span>
      ${block.subtitle ? `<span class="text-sm opacity-70" style="color: ${block.textColor};">${escapeHtml(block.subtitle)}</span>` : ""}
      ${block.showNav && block.navLinks.length > 0 ? `
        <div class="flex gap-6 mt-2">
          ${block.navLinks.map(link => `<a href="${escapeHtml(link.href)}" class="text-sm transition-opacity" style="color: ${block.textColor};">${escapeHtml(link.label)}</a>`).join("")}
        </div>
      ` : ""}
    </div>`;
  } else {
    navContent = `
    <div>
      <span class="font-bold text-xl" style="color: ${block.textColor};">${escapeHtml(block.title)}</span>
      ${block.subtitle ? `<span class="ml-3 text-sm opacity-70" style="color: ${block.textColor};">${escapeHtml(block.subtitle)}</span>` : ""}
    </div>
    ${block.showNav && block.navLinks.length > 0 ? `
      <div class="flex gap-6">
        ${block.navLinks.map(link => `<a href="${escapeHtml(link.href)}" class="text-sm transition-opacity" style="color: ${block.textColor};">${escapeHtml(link.label)}</a>`).join("")}
      </div>
    ` : ""}`;
  }

  return `<header class="w-full py-4 px-6 ${block.sticky ? "sticky top-0 z-50" : ""}" style="background-color: ${block.backgroundColor};">
  <nav class="flex items-center gap-6 ${styleClasses[block.style]}">
    ${navContent}
  </nav>
</header>`;
}

// === FOOTER ===
function generateFooterHTML(block: Extract<Block, { type: "footer" }>, ctx: GeneratorContext): string {
  const styleClasses: Record<string, string> = {
    simple: "text-left",
    centered: "text-center",
    columns: "text-center",
  };

  const socialIcons: Record<string, string> = {
    facebook: "f",
    twitter: "\u{1D54F}",
    instagram: "\u{1F4F7}",
    linkedin: "in",
    youtube: "\u{25B6}",
  };

  addClasses(ctx, `w-full py-8 px-6 ${styleClasses[block.style]} text-sm flex flex-col items-center gap-4 mt-4 w-8 h-8 rounded-full transition-opacity`);

  const socialsHtml = block.showSocials && block.socials.length > 0 ? `
    <div class="flex gap-4 mt-4">
      ${block.socials.map(social => `
        <a href="${escapeHtml(social.url)}" class="w-8 h-8 rounded-full flex items-center justify-center transition-opacity" style="background-color: ${block.textColor}20; color: ${block.textColor};">
          ${socialIcons[social.icon] || social.icon[0]}
        </a>
      `).join("")}
    </div>
  ` : "";

  return `<footer class="w-full py-8 px-6 ${styleClasses[block.style]}" style="background-color: ${block.backgroundColor};">
  <div class="${block.style === "centered" ? "flex flex-col items-center gap-4" : ""}">
    <p class="text-sm" style="color: ${block.textColor};">${escapeHtml(block.text)}</p>
    ${socialsHtml}
  </div>
</footer>`;
}

// === HERO ===
function generateHeroHTML(block: Extract<Block, { type: "hero" }>, ctx: GeneratorContext): string {
  const alignClasses: Record<string, string> = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  addClasses(ctx, "relative w-full min-h-[400px] flex flex-col justify-center py-16 px-8 rounded-xl overflow-hidden absolute inset-0 z-10 max-w-2xl mx-auto ml-auto text-4xl font-bold mb-4 text-lg opacity-90 mb-8 py-3 rounded-lg font-semibold transition-opacity");

  const marginClass = block.alignment === "center" ? "mx-auto" : block.alignment === "right" ? "ml-auto" : "";

  return `<div class="relative w-full min-h-[400px] flex flex-col justify-center py-16 px-8 rounded-xl overflow-hidden" style="background-color: ${block.backgroundColor}; ${block.backgroundImage ? `background-image: url('${block.backgroundImage}'); background-size: cover; background-position: center;` : ""}">
  ${block.overlay && block.backgroundImage ? `<div class="absolute inset-0" style="background: rgba(0,0,0,0.5);"></div>` : ""}
  <div class="relative z-10 flex flex-col ${alignClasses[block.alignment]} max-w-2xl ${marginClass}">
    <h1 class="text-4xl font-bold mb-4" style="color: ${block.textColor};">${escapeHtml(block.title)}</h1>
    <p class="text-lg opacity-90 mb-8" style="color: ${block.textColor};">${escapeHtml(block.subtitle)}</p>
    ${block.buttonText ? `<button class="px-8 py-3 rounded-lg font-semibold text-white transition-opacity" style="background-color: ${block.buttonColor};">${escapeHtml(block.buttonText)}</button>` : ""}
  </div>
</div>`;
}

// === FEATURES ===
function generateFeaturesHTML(block: Extract<Block, { type: "features" }>, ctx: GeneratorContext): string {
  const columnsClasses: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  addClasses(ctx, `w-full py-12 px-6 rounded-xl grid ${columnsClasses[block.columns]} gap-8 text-2xl font-bold text-center mb-10 flex flex-col items-center p-4 text-4xl mb-4 text-lg font-semibold mb-2 text-sm opacity-70`);

  const featuresHtml = block.features.map(f => `
    <div class="flex flex-col items-center text-center p-4">
      <span class="text-4xl mb-4">${f.icon}</span>
      <h3 class="text-lg font-semibold mb-2" style="color: ${block.textColor};">${escapeHtml(f.title)}</h3>
      <p class="text-sm opacity-70" style="color: ${block.textColor};">${escapeHtml(f.description)}</p>
    </div>
  `).join("");

  return `<div class="w-full py-12 px-6 rounded-xl" style="background-color: ${block.backgroundColor};">
  <h2 class="text-2xl font-bold text-center mb-10" style="color: ${block.textColor};">${escapeHtml(block.title)}</h2>
  <div class="grid ${columnsClasses[block.columns]} gap-8">
    ${featuresHtml}
  </div>
</div>`;
}

// === GALLERY ===
function generateGalleryHTML(block: Extract<Block, { type: "gallery" }>, ctx: GeneratorContext): string {
  const columnsClasses: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-2 sm:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };
  const gapClasses: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };
  const roundedClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
  };

  addClasses(ctx, `grid ${columnsClasses[block.columns]} ${gapClasses[block.gap]} w-full aspect-square object-cover ${roundedClasses[block.rounded]}`);

  const imagesHtml = block.images.map(img =>
    `<img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" class="w-full aspect-square object-cover ${roundedClasses[block.rounded]}">`
  ).join("");

  return `<div class="grid ${columnsClasses[block.columns]} ${gapClasses[block.gap]} w-full">${imagesHtml}</div>`;
}

// === CARD ===
function generateCardHTML(block: Extract<Block, { type: "card" }>, ctx: GeneratorContext): string {
  const roundedClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  };
  const shadowClasses: Record<string, string> = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
  };

  addClasses(ctx, `w-full overflow-hidden ${roundedClasses[block.rounded]} ${shadowClasses[block.shadow]} h-48 object-cover p-6 text-xl font-bold mb-2 text-sm opacity-70 mb-4 px-6 py-2 rounded-lg font-medium transition-opacity`);

  return `<div class="w-full overflow-hidden ${roundedClasses[block.rounded]} ${shadowClasses[block.shadow]}" style="background-color: ${block.backgroundColor};">
  ${block.image ? `<img src="${escapeHtml(block.image)}" alt="${escapeHtml(block.title)}" class="w-full h-48 object-cover">` : ""}
  <div class="p-6">
    <h3 class="text-xl font-bold mb-2" style="color: ${block.textColor};">${escapeHtml(block.title)}</h3>
    <p class="text-sm opacity-70 mb-4" style="color: ${block.textColor};">${escapeHtml(block.description)}</p>
    ${block.buttonText ? `<button class="px-6 py-2 rounded-lg font-medium text-white text-sm transition-opacity" style="background-color: ${block.buttonColor};">${escapeHtml(block.buttonText)}</button>` : ""}
  </div>
</div>`;
}

// === VIDEO ===
function generateVideoHTML(block: Extract<Block, { type: "video" }>, ctx: GeneratorContext): string {
  const roundedClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  };
  const aspectClasses: Record<string, string> = {
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "1/1": "aspect-square",
  };

  addClasses(ctx, `w-full ${aspectClasses[block.aspectRatio]} ${roundedClasses[block.rounded]} overflow-hidden h-full`);

  let embedUrl = block.url;
  const youtubeMatch = block.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  if (youtubeMatch) {
    embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}${block.autoplay ? "?autoplay=1" : ""}`;
  } else {
    const vimeoMatch = block.url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}${block.autoplay ? "?autoplay=1" : ""}`;
    }
  }

  return `<div class="w-full ${aspectClasses[block.aspectRatio]} ${roundedClasses[block.rounded]} overflow-hidden" style="background-color: #18181b;">
  <iframe src="${embedUrl}" class="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`;
}

// === LIST ===
function generateListHTML(block: Extract<Block, { type: "list" }>, ctx: GeneratorContext): string {
  addClasses(ctx, "space-y-2 flex items-start gap-3 flex-shrink-0 font-bold");

  const icons: Record<string, string | null> = {
    bullet: "\u2022",
    number: null,
    check: "\u2713",
    arrow: "\u2192",
  };

  const itemsHtml = block.items.map((item, i) => {
    const icon = block.style === "number" ? `${i + 1}.` : icons[block.style];
    return `<li class="flex items-start gap-3">
      <span class="flex-shrink-0 font-bold" style="color: ${block.iconColor};">${icon}</span>
      <span style="color: ${block.textColor};">${escapeHtml(item)}</span>
    </li>`;
  }).join("");

  return `<ul class="space-y-2">${itemsHtml}</ul>`;
}

// === QUOTE ===
function generateQuoteHTML(block: Extract<Block, { type: "quote" }>, ctx: GeneratorContext): string {
  const styleClasses: Record<string, string> = {
    simple: "pl-4",
    bordered: "border-l-4 pl-6 py-2",
    filled: "p-6 rounded-xl",
  };

  addClasses(ctx, `${styleClasses[block.style]} text-xl italic mb-3 leading-relaxed text-sm font-medium not-italic block`);

  return `<blockquote class="${styleClasses[block.style]}" style="${block.style === "bordered" ? `border-color: ${block.accentColor};` : ""} ${block.style === "filled" ? `background-color: ${block.backgroundColor};` : ""}">
  <p class="text-xl italic mb-3 leading-relaxed" style="color: ${block.textColor};">"${escapeHtml(block.content)}"</p>
  ${block.author ? `<cite class="text-sm font-medium not-italic block" style="color: ${block.accentColor};">\u2014 ${escapeHtml(block.author)}</cite>` : ""}
</blockquote>`;
}

// === SOCIALS ===
function generateSocialsHTML(block: Extract<Block, { type: "socials" }>, ctx: GeneratorContext): string {
  const sizeClasses: Record<string, string> = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
  };

  const platformIcons: Record<string, string> = {
    facebook: "f",
    twitter: "\u{1D54F}",
    instagram: "\u{1F4F7}",
    linkedin: "in",
    youtube: "\u{25B6}",
    tiktok: "\u266A",
    github: "\u2318",
  };

  addClasses(ctx, `flex gap-3 flex-wrap ${sizeClasses[block.size]} items-center justify-center rounded-full font-bold cursor-default select-none`);

  const linksHtml = block.links.map(link => {
    const style = block.style === "filled"
      ? `background-color: ${block.color}; color: #fff;`
      : block.style === "outline"
      ? `border: 2px solid ${block.color}; color: ${block.color}; background: transparent;`
      : `color: ${block.color}; background: transparent;`;

    return `<span class="${sizeClasses[block.size]} flex items-center justify-center rounded-full font-bold cursor-default select-none" style="${style}" title="${link.platform}">${platformIcons[link.platform] || link.platform[0]}</span>`;
  }).join("");

  return `<div class="flex gap-3 flex-wrap">${linksHtml}</div>`;
}

// === STATS ===
function generateStatsHTML(block: Extract<Block, { type: "stats" }>, ctx: GeneratorContext): string {
  const colClasses: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  addClasses(ctx, `grid ${colClasses[block.columns]} gap-8 p-8 rounded-xl text-center text-3xl mb-2 block text-4xl font-bold mb-1 text-sm opacity-70`);

  const statsHtml = block.stats.map(stat => `
    <div class="text-center">
      ${stat.icon ? `<span class="text-3xl mb-2 block">${stat.icon}</span>` : ""}
      <div class="text-4xl font-bold mb-1" style="color: ${block.accentColor};">${escapeHtml(stat.value)}</div>
      <div class="text-sm opacity-70" style="color: ${block.textColor};">${escapeHtml(stat.label)}</div>
    </div>
  `).join("");

  return `<div class="grid ${colClasses[block.columns]} gap-8 p-8 rounded-xl" style="background-color: ${block.backgroundColor};">${statsHtml}</div>`;
}

// === ACCORDION ===
function generateAccordionHTML(block: Extract<Block, { type: "accordion" }>, ctx: GeneratorContext): string {
  const styleClasses: Record<string, string> = {
    simple: "",
    bordered: "border rounded-lg divide-y",
    filled: "rounded-lg overflow-hidden",
  };

  addClasses(ctx, `${styleClasses[block.style]} w-full flex items-center justify-between p-4 text-left font-medium transition-colors border-t border-b transform transition-transform rotate-180 text-sm leading-relaxed`);

  const itemsHtml = block.items.map((item, i) => `
    <div class="${block.style === "filled" && i > 0 ? "border-t" : ""}">
      <button data-accordion-toggle class="w-full flex items-center justify-between p-4 text-left font-medium transition-colors ${block.style === "simple" ? "border-b" : ""}" style="color: ${block.textColor}; border-color: ${block.accentColor}20;">
        <span>${escapeHtml(item.question)}</span>
        <span data-accordion-icon class="transform transition-transform ${i === 0 ? "rotate-180" : ""}" style="color: ${block.accentColor};">\u25BC</span>
      </button>
      <div class="accordion-content p-4 text-sm leading-relaxed ${i === 0 ? "" : "hidden"}" style="color: ${block.textColor}; opacity: 0.8;">
        ${escapeHtml(item.answer)}
      </div>
    </div>
  `).join("");

  const containerStyle = block.style === "bordered"
    ? `border-color: ${block.accentColor}30;`
    : block.style === "filled"
    ? `background-color: ${block.backgroundColor};`
    : "";

  return `<div class="${styleClasses[block.style]}" style="${containerStyle}">${itemsHtml}</div>`;
}

// === PRICING ===
function generatePricingHTML(block: Extract<Block, { type: "pricing" }>, ctx: GeneratorContext): string {
  addClasses(ctx, "rounded-2xl p-8 text-center transition-all scale-105 shadow-xl shadow-lg text-xl font-bold mb-4 mb-6 text-5xl font-bold text-sm opacity-60 space-y-3 mb-8 flex items-center justify-center gap-2 w-full py-3 rounded-xl");

  const featuresHtml = block.features.map(f =>
    `<li class="flex items-center justify-center gap-2 text-sm" style="color: ${block.textColor};"><span style="color: ${block.buttonColor};">\u2713</span>${escapeHtml(f)}</li>`
  ).join("");

  const highlightStyle = block.highlighted
    ? `box-shadow: 0 0 0 2px ${block.buttonColor}; transform: scale(1.05);`
    : "";

  return `<div class="rounded-2xl p-8 text-center transition-all ${block.highlighted ? "scale-105 shadow-xl" : "shadow-lg"}" style="background-color: ${block.backgroundColor}; ${highlightStyle}">
  <h3 class="text-xl font-bold mb-4" style="color: ${block.textColor};">${escapeHtml(block.title)}</h3>
  <div class="mb-6">
    <span class="text-5xl font-bold" style="color: ${block.buttonColor};">${escapeHtml(block.price)}</span>
    <span class="text-sm opacity-60" style="color: ${block.textColor};">${escapeHtml(block.period)}</span>
  </div>
  <ul class="space-y-3 mb-8">${featuresHtml}</ul>
  <button class="w-full py-3 rounded-xl font-bold text-white transition-opacity ${block.highlighted ? "" : "opacity-90"}" style="background-color: ${block.buttonColor};">${escapeHtml(block.buttonText)}</button>
</div>`;
}

// === CTA ===
function generateCtaHTML(block: Extract<Block, { type: "cta" }>, ctx: GeneratorContext): string {
  addClasses(ctx, "w-full py-16 px-8 rounded-xl text-center text-3xl font-bold mb-4 text-lg opacity-90 mb-8 max-w-xl mx-auto py-3 rounded-lg font-semibold transition-opacity");

  return `<div class="w-full py-16 px-8 rounded-xl text-center" style="background-color: ${block.backgroundColor};">
  <h2 class="text-3xl font-bold mb-4" style="color: ${block.textColor};">${escapeHtml(block.title)}</h2>
  <p class="text-lg opacity-90 mb-8 max-w-xl mx-auto" style="color: ${block.textColor};">${escapeHtml(block.description)}</p>
  <button class="px-8 py-3 rounded-lg font-semibold text-white transition-opacity" style="background-color: ${block.buttonColor};">${escapeHtml(block.buttonText)}</button>
</div>`;
}

// === TESTIMONIAL ===
function generateTestimonialHTML(block: Extract<Block, { type: "testimonial" }>, ctx: GeneratorContext): string {
  const styleClasses: Record<string, string> = {
    simple: "",
    card: "shadow-lg",
    centered: "",
  };

  addClasses(ctx, `w-full py-10 px-8 rounded-xl ${styleClasses[block.style]} flex flex-col items-center text-center max-w-2xl mx-auto text-4xl mb-4 opacity-30 text-lg italic leading-relaxed mb-6 gap-4 w-12 h-12 rounded-full object-cover font-semibold text-sm opacity-70`);

  const alignClass = block.style === "centered" ? "items-center text-center" : "";
  const marginClass = block.style === "centered" ? "mx-auto" : "";

  return `<div class="w-full py-10 px-8 rounded-xl ${styleClasses[block.style]}" style="background-color: ${block.backgroundColor};">
  <div class="flex flex-col ${alignClass} max-w-2xl ${marginClass}">
    <div class="text-4xl mb-4 opacity-30" style="color: ${block.textColor};">"</div>
    <p class="text-lg italic mb-6 leading-relaxed" style="color: ${block.textColor};">${escapeHtml(block.quote)}</p>
    <div class="flex items-center gap-4 ${block.style === "centered" ? "flex-col" : ""}">
      ${block.avatar ? `<img src="${escapeHtml(block.avatar)}" alt="${escapeHtml(block.author)}" class="w-12 h-12 rounded-full object-cover">` : ""}
      <div class="${block.style === "centered" ? "text-center" : ""}">
        <p class="font-semibold" style="color: ${block.textColor};">${escapeHtml(block.author)}</p>
        <p class="text-sm opacity-70" style="color: ${block.textColor};">${escapeHtml(block.role)}</p>
      </div>
    </div>
  </div>
</div>`;
}

// === ROW ===
function generateRowHTML(block: Extract<Block, { type: "row" }>, ctx: GeneratorContext): string {
  const gapClasses: Record<string, string> = {
    none: "gap-0",
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
    xl: "gap-8",
  };
  const alignClasses: Record<string, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };
  const justifyClasses: Record<string, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };
  const paddingClasses: Record<string, string> = {
    none: "p-0",
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
  };
  const roundedClasses: Record<string, string> = {
    none: "rounded-none",
    sm: "rounded",
    md: "rounded-lg",
    lg: "rounded-xl",
    xl: "rounded-2xl",
  };

  const wrapClass = block.wrap ? "flex-wrap" : "flex-nowrap";
  const classes = `flex ${wrapClass} ${gapClasses[block.gap]} ${alignClasses[block.align]} ${justifyClasses[block.justify]} ${paddingClasses[block.padding]} ${roundedClasses[block.rounded]} min-h-[80px]`;

  addClasses(ctx, classes);

  // Width classes mapping
  const widthStyles: Record<string, string> = {
    "auto": "flex: 1 1 0%; min-width: 0;",
    "1/4": "width: 25%; flex-shrink: 0;",
    "1/3": "width: 33.333%; flex-shrink: 0;",
    "1/2": "width: 50%; flex-shrink: 0;",
    "2/3": "width: 66.666%; flex-shrink: 0;",
    "3/4": "width: 75%; flex-shrink: 0;",
    "full": "width: 100%; flex-shrink: 0;",
  };

  const childrenHtml = block.children.map(child => {
    const widthStyle = widthStyles[child.width] || widthStyles["auto"];
    return `<div style="${widthStyle}">${generateBlockHTML(child, ctx)}</div>`;
  }).join("");

  const bgStyle = block.background && block.background !== "transparent" ? `background-color: ${block.background};` : "";

  return `<div class="${classes}" style="${bgStyle}">${childrenHtml}</div>`;
}

function generateBlockHTML(block: Block, ctx: GeneratorContext): string {
  if (block.visible === false) return "";

  switch (block.type) {
    case "heading": return generateHeadingHTML(block, ctx);
    case "text": return generateTextHTML(block, ctx);
    case "image": return generateImageHTML(block, ctx);
    case "button": return generateButtonHTML(block, ctx);
    case "spacer": return generateSpacerHTML(block, ctx);
    case "divider": return generateDividerHTML(block, ctx);
    case "header": return generateHeaderHTML(block, ctx);
    case "footer": return generateFooterHTML(block, ctx);
    case "hero": return generateHeroHTML(block, ctx);
    case "features": return generateFeaturesHTML(block, ctx);
    case "gallery": return generateGalleryHTML(block, ctx);
    case "card": return generateCardHTML(block, ctx);
    case "video": return generateVideoHTML(block, ctx);
    case "list": return generateListHTML(block, ctx);
    case "quote": return generateQuoteHTML(block, ctx);
    case "socials": return generateSocialsHTML(block, ctx);
    case "stats": return generateStatsHTML(block, ctx);
    case "accordion": return generateAccordionHTML(block, ctx);
    case "pricing": return generatePricingHTML(block, ctx);
    case "cta": return generateCtaHTML(block, ctx);
    case "testimonial": return generateTestimonialHTML(block, ctx);
    case "row": return generateRowHTML(block, ctx);
    default: return "";
  }
}

export function generateHTML(blocks: Block[], settings: SiteSettings): { html: string; usedClasses: Set<string> } {
  const ctx: GeneratorContext = {
    usedClasses: new Set(),
    settings,
  };

  const maxWidthClasses: Record<string, string> = {
    sm: "max-w-2xl",
    md: "max-w-4xl",
    lg: "max-w-5xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  addClasses(ctx, `${maxWidthClasses[settings.maxWidth]} mx-auto`);

  const bodyHtml = blocks.map(block => generateBlockHTML(block, ctx)).join("\n    ");

  return {
    html: `<main class="${maxWidthClasses[settings.maxWidth]} mx-auto" style="background-color: ${settings.backgroundColor}; color: ${settings.textColor};">
    ${bodyHtml}
  </main>`,
    usedClasses: ctx.usedClasses,
  };
}

export function wrapInDocument(bodyHTML: string, settings: SiteSettings): string {
  const fontLink = settings.fontFamily === "poppins"
    ? '<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">'
    : settings.fontFamily === "space"
    ? '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">'
    : settings.fontFamily === "mono"
    ? '<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">'
    : '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(settings.siteName)}</title>
  <meta name="description" content="${escapeHtml(settings.siteDescription)}">
  ${fontLink}
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${bodyHTML}
  <script src="script.js"></script>
</body>
</html>`;
}
