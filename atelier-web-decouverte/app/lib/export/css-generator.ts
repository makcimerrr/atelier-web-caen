import { SiteSettings } from "@/app/types/builder";

const tailwindToCSS: Record<string, string> = {
  // Typography
  "text-xs": "font-size: 0.75rem; line-height: 1rem;",
  "text-sm": "font-size: 0.875rem; line-height: 1.25rem;",
  "text-base": "font-size: 1rem; line-height: 1.5rem;",
  "text-lg": "font-size: 1.125rem; line-height: 1.75rem;",
  "text-xl": "font-size: 1.25rem; line-height: 1.75rem;",
  "text-2xl": "font-size: 1.5rem; line-height: 2rem;",
  "text-3xl": "font-size: 1.875rem; line-height: 2.25rem;",
  "text-4xl": "font-size: 2.25rem; line-height: 2.5rem;",
  "text-5xl": "font-size: 3rem; line-height: 1;",
  "text-white": "color: white;",

  // Font weight
  "font-normal": "font-weight: 400;",
  "font-medium": "font-weight: 500;",
  "font-semibold": "font-weight: 600;",
  "font-bold": "font-weight: 700;",

  // Text align
  "text-left": "text-align: left;",
  "text-center": "text-align: center;",
  "text-right": "text-align: right;",

  // Leading
  "leading-relaxed": "line-height: 1.625;",

  // Flex
  "flex": "display: flex;",
  "flex-1": "flex: 1 1 0%;",
  "flex-col": "flex-direction: column;",
  "flex-wrap": "flex-wrap: wrap;",
  "flex-nowrap": "flex-wrap: nowrap;",
  "flex-shrink-0": "flex-shrink: 0;",

  // Align
  "items-start": "align-items: flex-start;",
  "items-center": "align-items: center;",
  "items-end": "align-items: flex-end;",
  "items-stretch": "align-items: stretch;",

  // Justify
  "justify-start": "justify-content: flex-start;",
  "justify-center": "justify-content: center;",
  "justify-end": "justify-content: flex-end;",
  "justify-between": "justify-content: space-between;",
  "justify-around": "justify-content: space-around;",

  // Gap
  "gap-2": "gap: 0.5rem;",
  "gap-3": "gap: 0.75rem;",
  "gap-4": "gap: 1rem;",
  "gap-5": "gap: 1.25rem;",
  "gap-6": "gap: 1.5rem;",
  "gap-8": "gap: 2rem;",

  // Padding
  "p-2": "padding: 0.5rem;",
  "p-4": "padding: 1rem;",
  "p-6": "padding: 1.5rem;",
  "p-8": "padding: 2rem;",
  "px-4": "padding-left: 1rem; padding-right: 1rem;",
  "px-6": "padding-left: 1.5rem; padding-right: 1.5rem;",
  "px-8": "padding-left: 2rem; padding-right: 2rem;",
  "py-2": "padding-top: 0.5rem; padding-bottom: 0.5rem;",
  "py-3": "padding-top: 0.75rem; padding-bottom: 0.75rem;",
  "py-4": "padding-top: 1rem; padding-bottom: 1rem;",
  "py-6": "padding-top: 1.5rem; padding-bottom: 1.5rem;",
  "py-8": "padding-top: 2rem; padding-bottom: 2rem;",
  "py-12": "padding-top: 3rem; padding-bottom: 3rem;",
  "py-16": "padding-top: 4rem; padding-bottom: 4rem;",
  "py-20": "padding-top: 5rem; padding-bottom: 5rem;",
  "pb-4": "padding-bottom: 1rem;",
  "pl-4": "padding-left: 1rem;",
  "pl-6": "padding-left: 1.5rem;",

  // Margin
  "mx-auto": "margin-left: auto; margin-right: auto;",
  "mb-2": "margin-bottom: 0.5rem;",
  "mb-4": "margin-bottom: 1rem;",
  "mb-6": "margin-bottom: 1.5rem;",
  "mb-8": "margin-bottom: 2rem;",
  "mt-2": "margin-top: 0.5rem;",
  "mt-4": "margin-top: 1rem;",
  "my-4": "margin-top: 1rem; margin-bottom: 1rem;",
  "my-6": "margin-top: 1.5rem; margin-bottom: 1.5rem;",

  // Width/Height
  "w-full": "width: 100%;",
  "w-8": "width: 2rem;",
  "w-10": "width: 2.5rem;",
  "w-12": "width: 3rem;",
  "h-2": "height: 0.5rem;",
  "h-4": "height: 1rem;",
  "h-8": "height: 2rem;",
  "h-12": "height: 3rem;",
  "h-16": "height: 4rem;",
  "h-24": "height: 6rem;",
  "h-48": "height: 12rem;",
  "h-auto": "height: auto;",
  "h-full": "height: 100%;",
  "min-h-[400px]": "min-height: 400px;",
  "min-h-[80px]": "min-height: 80px;",
  "min-w-0": "min-width: 0;",

  // Max width
  "max-w-xl": "max-width: 36rem;",
  "max-w-2xl": "max-width: 42rem;",
  "max-w-3xl": "max-width: 48rem;",
  "max-w-4xl": "max-width: 56rem;",
  "max-w-5xl": "max-width: 64rem;",
  "max-w-6xl": "max-width: 72rem;",
  "max-w-full": "max-width: 100%;",

  // Aspect ratio
  "aspect-square": "aspect-ratio: 1 / 1;",
  "aspect-video": "aspect-ratio: 16 / 9;",
  "aspect-[4/3]": "aspect-ratio: 4 / 3;",
  "aspect-[21/9]": "aspect-ratio: 21 / 9;",

  // Border radius
  "rounded-none": "border-radius: 0;",
  "rounded": "border-radius: 0.25rem;",
  "rounded-sm": "border-radius: 0.125rem;",
  "rounded-md": "border-radius: 0.375rem;",
  "rounded-lg": "border-radius: 0.5rem;",
  "rounded-xl": "border-radius: 0.75rem;",
  "rounded-2xl": "border-radius: 1rem;",
  "rounded-full": "border-radius: 9999px;",

  // Shadow
  "shadow-sm": "box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);",
  "shadow-md": "box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);",
  "shadow-lg": "box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);",
  "shadow-xl": "box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);",

  // Border
  "border": "border-width: 1px;",
  "border-t": "border-top-width: 1px;",
  "border-t-2": "border-top-width: 2px;",
  "border-t-4": "border-top-width: 4px;",
  "border-b": "border-bottom-width: 1px;",
  "border-l-4": "border-left-width: 4px;",
  "border-solid": "border-style: solid;",
  "border-dashed": "border-style: dashed;",
  "border-dotted": "border-style: dotted;",
  "divide-y": "",

  // Position
  "relative": "position: relative;",
  "absolute": "position: absolute;",
  "sticky": "position: sticky;",
  "top-0": "top: 0;",
  "inset-0": "inset: 0;",
  "z-10": "z-index: 10;",
  "z-50": "z-index: 50;",

  // Display
  "block": "display: block;",
  "inline-block": "display: inline-block;",
  "hidden": "display: none;",

  // Grid
  "grid": "display: grid;",
  "grid-cols-1": "grid-template-columns: repeat(1, minmax(0, 1fr));",
  "grid-cols-2": "grid-template-columns: repeat(2, minmax(0, 1fr));",
  "grid-cols-3": "grid-template-columns: repeat(3, minmax(0, 1fr));",
  "grid-cols-4": "grid-template-columns: repeat(4, minmax(0, 1fr));",
  "col-span-full": "grid-column: 1 / -1;",

  // Object fit
  "object-cover": "object-fit: cover;",

  // Overflow
  "overflow-hidden": "overflow: hidden;",

  // Opacity
  "opacity-30": "opacity: 0.3;",
  "opacity-60": "opacity: 0.6;",
  "opacity-80": "opacity: 0.8;",
  "opacity-90": "opacity: 0.9;",

  // Transition
  "transition-opacity": "transition-property: opacity; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",
  "transition-transform": "transition-property: transform; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",
  "transition-colors": "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",
  "transition-all": "transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",
  "transition": "transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;",

  // Transform
  "transform": "transform: var(--tw-transform);",
  "scale-105": "transform: scale(1.05);",
  "rotate-180": "transform: rotate(180deg);",

  // Space (handled via CSS below)
  "space-y-2": "",
  "space-y-3": "",

  // Italic
  "italic": "font-style: italic;",
  "not-italic": "font-style: normal;",

  // Cursor & Selection
  "cursor-default": "cursor: default;",
  "cursor-pointer": "cursor: pointer;",
  "select-none": "user-select: none;",

  // Padding (more)
  "p-0": "padding: 0;",
  "py-10": "padding-top: 2.5rem; padding-bottom: 2.5rem;",

  // Margin (more)
  "ml-3": "margin-left: 0.75rem;",
  "ml-auto": "margin-left: auto;",
  "mb-1": "margin-bottom: 0.25rem;",
  "mb-3": "margin-bottom: 0.75rem;",
  "mb-10": "margin-bottom: 2.5rem;",

  // Gap (more)
  "gap-0": "gap: 0;",
};

export function generateFullCSS(usedClasses: Set<string>, settings: SiteSettings): string {
  const fontFamily =
    settings.fontFamily === "poppins"
      ? "'Poppins', sans-serif"
      : settings.fontFamily === "space"
      ? "'Space Grotesk', sans-serif"
      : settings.fontFamily === "mono"
      ? "'Roboto Mono', monospace"
      : "'Inter', sans-serif";

  let css = `/* Reset CSS */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: ${fontFamily};
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, video {
  max-width: 100%;
  height: auto;
  display: block;
}

button {
  cursor: pointer;
  border: none;
  font-family: inherit;
}

a {
  text-decoration: none;
  color: inherit;
}

ul, ol {
  list-style: none;
}

/* Utility Classes */
`;

  // Generate used utility classes
  usedClasses.forEach((className) => {
    const rules = tailwindToCSS[className];
    if (rules) {
      css += `.${className.replace(/[/:[\]]/g, "\\$&")} { ${rules} }\n`;
    }
  });

  // Add space-y utilities with CSS
  css += `
/* Space utilities */
.space-y-2 > * + * { margin-top: 0.5rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }

/* Hover states */
.hover\\:opacity-80:hover { opacity: 0.8; }
.hover\\:opacity-90:hover { opacity: 0.9; }

/* Responsive utilities */
@media (min-width: 640px) {
  .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .sm\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .sm\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .md\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .md\\:text-5xl { font-size: 3rem; line-height: 1; }
  .md\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* Divide utilities */
.divide-y > * + * { border-top-width: 1px; }

/* Accordion animation */
.accordion-content {
  overflow: hidden;
  transition: all 0.3s ease;
}

.accordion-content.hidden {
  display: none;
}

[data-accordion-icon] {
  transition: transform 0.3s ease;
}
`;

  return css;
}
