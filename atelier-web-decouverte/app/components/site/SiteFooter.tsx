"use client";

import { useBuilder } from "../../context/BuilderContext";

export default function SiteFooter() {
  const { state } = useBuilder();
  const { settings } = state;

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t py-8"
      style={{
        backgroundColor: settings.backgroundColor,
        borderColor: `${settings.textColor}15`,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <span
            className="text-lg font-semibold"
            style={{ color: settings.primaryColor }}
          >
            {settings.siteName}
          </span>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            {settings.navLinks.slice(0, 3).map((link) => (
              <span
                key={link.id}
                className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                style={{ color: settings.textColor }}
              >
                {link.label}
              </span>
            ))}
          </div>

          {/* Copyright */}
          <p
            className="text-sm opacity-50"
            style={{ color: settings.textColor }}
          >
            © {currentYear} {settings.siteName}
          </p>
        </div>

        {/* Made with Zone01 */}
        <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: `${settings.textColor}10` }}>
          <p className="text-xs opacity-40" style={{ color: settings.textColor }}>
            Créé avec Zone01 Site Builder
          </p>
        </div>
      </div>
    </footer>
  );
}
