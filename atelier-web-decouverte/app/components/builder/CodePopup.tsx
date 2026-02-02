"use client";

import { useBuilder } from "../../context/BuilderContext";
import { useEffect, useState } from "react";

export default function CodePopup() {
  const { state, hideCodePopup, toggleCodePopup } = useBuilder();
  const { showCodePopup, lastCodeChange, codePopupEnabled } = state;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showCodePopup && lastCodeChange) {
      setIsVisible(true);
      // Auto-hide after 8 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(hideCodePopup, 300);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showCodePopup, lastCodeChange, hideCodePopup]);

  if (!showCodePopup || !lastCodeChange) return null;

  const getActionLabel = () => {
    switch (lastCodeChange.action) {
      case "add":
        return "Ajouté";
      case "update":
        return "Modifié";
      case "delete":
        return "Supprimé";
      default:
        return "Action";
    }
  };

  const getActionColor = () => {
    switch (lastCodeChange.action) {
      case "add":
        return "bg-green-500";
      case "update":
        return "bg-blue-500";
      case "delete":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = () => {
    switch (lastCodeChange.type) {
      case "text":
        return "📝";
      case "style":
        return "🎨";
      case "section":
        return "📦";
      case "component":
        return "🧩";
      default:
        return "💡";
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(hideCodePopup, 300);
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <span className="text-xl">{getTypeIcon()}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${getActionColor()}`}>
                  {getActionLabel()}
                </span>
                <span className="text-white font-medium text-sm">
                  {lastCodeChange.elementName}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Code */}
        <div className="p-4 max-h-48 overflow-y-auto custom-scrollbar">
          <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
            <CodeHighlighter code={lastCodeChange.code} />
          </pre>
        </div>

        {/* Explanation */}
        <div className="px-4 py-3 bg-slate-800/50 border-t border-slate-700">
          <p className="text-xs text-slate-400 leading-relaxed">
            💡 {lastCodeChange.explanation}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-500">En lecture seule</span>
          </div>
          <button
            onClick={() => {
              toggleCodePopup();
              handleClose();
            }}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            Désactiver les pop-ups
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-slate-800">
          <div
            className="h-full bg-blue-500 transition-all duration-100"
            style={{
              animation: isVisible ? "shrink 8s linear forwards" : "none",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}

// Simple syntax highlighter
function CodeHighlighter({ code }: { code: string }) {
  // Highlight keywords, strings, comments, etc.
  const highlighted = code
    // Comments
    .replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, '<span class="text-slate-500 italic">$1</span>')
    // Strings
    .replace(/("[^"]*"|'[^']*')/g, '<span class="text-green-400">$1</span>')
    // HTML/JSX tags
    .replace(/(&lt;\/?\w+|<\/?\w+)/g, '<span class="text-pink-400">$1</span>')
    // Attributes
    .replace(/(\s)(\w+)(=)/g, '$1<span class="text-orange-400">$2</span>$3')
    // CSS properties
    .replace(/([\w-]+)(:)(\s)/g, '<span class="text-cyan-400">$1</span>$2$3')
    // Keywords
    .replace(/\b(const|let|var|function|return|import|export|from|className|style)\b/g, '<span class="text-purple-400">$1</span>');

  return <span dangerouslySetInnerHTML={{ __html: highlighted }} />;
}
