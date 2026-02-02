"use client";

import { useBuilder } from "../../context/BuilderContext";

export default function SiteNavbar() {
  const { state } = useBuilder();
  const { settings, previewMode, viewMode } = state;

  return (
    <nav
      className="sticky top-0 z-50 border-b backdrop-blur-md"
      style={{
        backgroundColor: `${settings.backgroundColor}ee`,
        borderColor: `${settings.textColor}15`,
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Site name */}
          <div className="flex-shrink-0">
            <span
              className="text-xl font-bold"
              style={{ color: settings.primaryColor }}
            >
              {settings.siteName}
            </span>
          </div>

          {/* Navigation links */}
          <div className={`flex items-center ${viewMode === "mobile" ? "gap-3" : "gap-6"}`}>
            {settings.navLinks.map((link) => (
              <a
                key={link.id}
                href={previewMode ? link.href : "#"}
                className={`font-medium transition-colors hover:opacity-70 ${
                  viewMode === "mobile" ? "text-sm" : "text-base"
                }`}
                style={{ color: settings.textColor }}
                onClick={(e) => !previewMode && e.preventDefault()}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
