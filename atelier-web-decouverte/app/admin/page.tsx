"use client";

import { useState, useEffect } from "react";
import { SavedSiteSummary, SavedSite } from "../types/builder";

export default function AdminPage() {
  const [sites, setSites] = useState<SavedSiteSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<SavedSite | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/sites");
      if (res.ok) {
        const data = await res.json();
        setSites(data);
      }
    } catch (err) {
      console.error("Error fetching sites:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSitePreview = async (id: string) => {
    try {
      setIsLoadingPreview(true);
      setSelectedSite(id);
      const res = await fetch(`/api/sites/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPreviewData(data);
      }
    } catch (err) {
      console.error("Error loading site:", err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const loadInEditor = () => {
    if (previewData) {
      localStorage.setItem("loadConfig", JSON.stringify({
        blocks: previewData.blocks,
        settings: previewData.settings,
      }));
      window.location.href = "/";
    }
  };

  const getBlockTypeCounts = (blocks: SavedSite["blocks"]) => {
    const counts: Record<string, number> = {};
    blocks.forEach(block => {
      counts[block.type] = (counts[block.type] || 0) + 1;
    });
    return counts;
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            <div>
              <h1 className="font-bold text-zinc-800">Administration</h1>
              <p className="text-xs text-zinc-500">Sites enregistres par les etudiants</p>
            </div>
          </div>
          <a
            href="/"
            className="px-4 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-800 hover:bg-zinc-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au builder
          </a>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sites List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
              <div className="p-4 border-b border-zinc-200 flex items-center justify-between">
                <h2 className="font-semibold text-zinc-800">
                  Sites enregistres ({sites.length})
                </h2>
                <button
                  onClick={fetchSites}
                  className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                  title="Actualiser"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : sites.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl mb-4 block">📭</span>
                  <p className="text-zinc-500 font-medium">Aucun site enregistre</p>
                  <p className="text-sm text-zinc-400 mt-1">Les sites des etudiants apparaitront ici</p>
                </div>
              ) : (
                <div className="divide-y divide-zinc-100">
                  {sites.map((site) => (
                    <div
                      key={site.id}
                      onClick={() => loadSitePreview(site.id)}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedSite === site.id
                          ? "bg-purple-50 border-l-4 border-purple-500"
                          : "hover:bg-zinc-50 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                            selectedSite === site.id
                              ? "bg-purple-500 text-white"
                              : "bg-purple-100 text-purple-600"
                          }`}>
                            {site.studentInfo.prenom.charAt(0).toUpperCase()}
                            {site.studentInfo.nom.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-zinc-800">
                              {site.studentInfo.prenom} {site.studentInfo.nom}
                            </div>
                            <div className="text-sm text-zinc-500">
                              {site.studentInfo.email}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-zinc-400">
                            {formatDate(site.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden sticky top-6">
              <div className="p-4 border-b border-zinc-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h2 className="font-semibold text-zinc-800">Details du site</h2>
              </div>

              {isLoadingPreview ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                </div>
              ) : previewData ? (
                <div className="p-4 space-y-4">
                  {/* Student Info */}
                  <div className="p-3 bg-zinc-50 rounded-lg">
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                      Etudiant
                    </div>
                    <div className="font-medium text-zinc-800">
                      {previewData.studentInfo.prenom} {previewData.studentInfo.nom}
                    </div>
                    <a
                      href={`mailto:${previewData.studentInfo.email}`}
                      className="text-sm text-purple-600 hover:underline"
                    >
                      {previewData.studentInfo.email}
                    </a>
                  </div>

                  {/* Site Info */}
                  <div>
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                      Nom du site
                    </div>
                    <div className="text-zinc-800 font-medium">
                      {previewData.settings.siteName}
                    </div>
                  </div>

                  {/* Block Count */}
                  <div>
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                      Elements ({previewData.blocks.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(getBlockTypeCounts(previewData.blocks)).map(([type, count]) => (
                        <span
                          key={type}
                          className="px-2 py-1 text-xs bg-zinc-100 text-zinc-600 rounded-full"
                        >
                          {type}: {count}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                      Couleurs
                    </div>
                    <div className="flex gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm"
                        style={{ backgroundColor: previewData.settings.primaryColor }}
                        title="Couleur principale"
                      />
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm"
                        style={{ backgroundColor: previewData.settings.backgroundColor }}
                        title="Fond"
                      />
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm"
                        style={{ backgroundColor: previewData.settings.textColor }}
                        title="Texte"
                      />
                    </div>
                  </div>

                  {/* Font */}
                  <div>
                    <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                      Police
                    </div>
                    <div className="text-sm text-zinc-600 capitalize">
                      {previewData.settings.fontFamily}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={loadInEditor}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-lg shadow-purple-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Ouvrir dans l'editeur
                  </button>
                </div>
              ) : (
                <div className="p-8 text-center text-zinc-400">
                  <span className="text-4xl mb-3 block">👆</span>
                  <p className="text-sm font-medium">Selectionnez un site</p>
                  <p className="text-xs mt-1">pour voir les details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
