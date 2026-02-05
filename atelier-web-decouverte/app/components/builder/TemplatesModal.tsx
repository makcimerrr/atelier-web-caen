"use client";

import { useState, useEffect } from "react";
import { useBuilder } from "../../context/BuilderContext";

interface TemplateSummary {
  id: string;
  name: string;
  description: string;
  emoji: string;
  difficulty: "facile" | "moyen" | "difficile";
  tasks: string[];
}

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TemplatesModal({ isOpen, onClose }: TemplatesModalProps) {
  const { loadConfiguration } = useBuilder();
  const [templates, setTemplates] = useState<TemplateSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [showTasks, setShowTasks] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/templates");
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectTemplate = async (templateId: string) => {
    try {
      setIsLoadingTemplate(true);
      setSelectedTemplate(templateId);
      const res = await fetch(`/api/templates/${templateId}`);
      if (res.ok) {
        const data = await res.json();
        loadConfiguration(data.blocks, data.settings);
        onClose();
      }
    } catch (err) {
      console.error("Error loading template:", err);
    } finally {
      setIsLoadingTemplate(false);
      setSelectedTemplate(null);
    }
  };

  const difficultyColors = {
    facile: "bg-green-100 text-green-700",
    moyen: "bg-yellow-100 text-yellow-700",
    difficile: "bg-red-100 text-red-700",
  };

  const difficultyLabels = {
    facile: "Facile",
    moyen: "Moyen",
    difficile: "Difficile",
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎮</span>
            <div>
              <h2 className="text-xl font-bold text-white">Choisis ton template</h2>
              <p className="text-sm text-white/80">Des sites a trous sur tes jeux preferes !</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info banner */}
        <div className="flex-shrink-0 px-6 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-sm text-blue-700 flex items-center gap-2">
            <span>💡</span>
            <span>
              <strong>Comment ca marche ?</strong> Choisis un theme, puis remplace les textes entre [crochets] par tes propres infos !
            </span>
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-5xl mb-4 block">📭</span>
              <p className="text-zinc-500">Aucun template disponible</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`relative group rounded-xl border-2 transition-all overflow-hidden ${
                    selectedTemplate === template.id
                      ? "border-purple-500 shadow-lg shadow-purple-200"
                      : "border-zinc-200 hover:border-purple-300 hover:shadow-md"
                  }`}
                >
                  {/* Card header */}
                  <div className="p-4 bg-gradient-to-br from-zinc-50 to-zinc-100">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-4xl">{template.emoji}</span>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${difficultyColors[template.difficulty]}`}>
                        {difficultyLabels[template.difficulty]}
                      </span>
                    </div>
                    <h3 className="font-bold text-zinc-800 text-lg">{template.name}</h3>
                    <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{template.description}</p>
                  </div>

                  {/* Tasks preview */}
                  <div className="px-4 pb-2">
                    <button
                      onClick={() => setShowTasks(showTasks === template.id ? null : template.id)}
                      className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    >
                      <span>{showTasks === template.id ? "▼" : "▶"}</span>
                      {template.tasks.length} corrections a faire
                    </button>
                    {showTasks === template.id && (
                      <ul className="mt-2 space-y-1">
                        {template.tasks.map((task, i) => (
                          <li key={i} className="text-xs text-zinc-600 flex items-start gap-2">
                            <span className="text-purple-400">•</span>
                            {task}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="p-4 pt-2">
                    <button
                      onClick={() => handleSelectTemplate(template.id)}
                      disabled={isLoadingTemplate}
                      className={`w-full py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                        selectedTemplate === template.id
                          ? "bg-purple-500 text-white"
                          : "bg-zinc-100 text-zinc-700 hover:bg-purple-500 hover:text-white"
                      }`}
                    >
                      {selectedTemplate === template.id && isLoadingTemplate ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          Utiliser ce template
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 bg-zinc-50 border-t border-zinc-200">
          <p className="text-xs text-zinc-500 text-center">
            Tu peux aussi partir de zero en fermant cette fenetre et en utilisant les elements a gauche !
          </p>
        </div>
      </div>
    </div>
  );
}
