"use client";

import { useState, useEffect } from "react";
import { useBuilder } from "../../context/BuilderContext";
import { SavedSiteSummary, SavedSite } from "../../types/builder";

interface MySitesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MySitesModal({ isOpen, onClose }: MySitesModalProps) {
  const { loadConfiguration } = useBuilder();
  const [sites, setSites] = useState<SavedSiteSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<SavedSite | null>(null);
  const [isLoadingSite, setIsLoadingSite] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchSites();
    }
  }, [isOpen]);

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

  const loadSiteDetails = async (id: string) => {
    try {
      setIsLoadingSite(true);
      const res = await fetch(`/api/sites/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedSite(data);
      }
    } catch (err) {
      console.error("Error loading site:", err);
    } finally {
      setIsLoadingSite(false);
    }
  };

  const handleLoadSite = () => {
    if (selectedSite) {
      loadConfiguration(selectedSite.blocks, selectedSite.settings);
      onClose();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredSites = sites.filter((site) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      site.studentInfo.prenom.toLowerCase().includes(searchLower) ||
      site.studentInfo.nom.toLowerCase().includes(searchLower) ||
      site.studentInfo.email.toLowerCase().includes(searchLower)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📚</span>
            <div>
              <h2 className="text-xl font-bold text-white">Sites enregistres</h2>
              <p className="text-sm text-white/80">Retrouve et charge un site existant</p>
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

        {/* Search bar */}
        <div className="flex-shrink-0 px-6 py-3 border-b border-zinc-200 bg-zinc-50">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Rechercher par nom, prenom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Sites list */}
          <div className="w-1/2 border-r border-zinc-200 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : filteredSites.length === 0 ? (
              <div className="text-center py-12 px-4">
                <span className="text-4xl mb-3 block">🔍</span>
                <p className="text-zinc-500 font-medium">
                  {searchTerm ? "Aucun resultat" : "Aucun site enregistre"}
                </p>
                <p className="text-sm text-zinc-400 mt-1">
                  {searchTerm ? "Essaie avec d'autres termes" : "Les sites sauvegardes apparaitront ici"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {filteredSites.map((site) => (
                  <div
                    key={site.id}
                    onClick={() => loadSiteDetails(site.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedSite?.id === site.id
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : "hover:bg-zinc-50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                          selectedSite?.id === site.id
                            ? "bg-blue-500 text-white"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {site.studentInfo.prenom.charAt(0).toUpperCase()}
                        {site.studentInfo.nom.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-zinc-800 truncate">
                          {site.studentInfo.prenom} {site.studentInfo.nom}
                        </div>
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

          {/* Site preview */}
          <div className="w-1/2 overflow-y-auto bg-zinc-50">
            {isLoadingSite ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
              </div>
            ) : selectedSite ? (
              <div className="p-6 space-y-4">
                {/* Site name */}
                <div className="text-center pb-4 border-b border-zinc-200">
                  <h3 className="text-xl font-bold text-zinc-800">{selectedSite.settings.siteName}</h3>
                  <p className="text-sm text-zinc-500">{selectedSite.settings.siteDescription}</p>
                </div>

                {/* Student info */}
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                    Createur
                  </div>
                  <div className="font-medium text-zinc-800">
                    {selectedSite.studentInfo.prenom} {selectedSite.studentInfo.nom}
                  </div>
                  <div className="text-sm text-blue-600">
                    {selectedSite.studentInfo.email}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-blue-500">{selectedSite.blocks.length}</div>
                    <div className="text-xs text-zinc-500">Elements</div>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm text-center">
                    <div className="text-2xl font-bold text-purple-500 capitalize">{selectedSite.settings.fontFamily}</div>
                    <div className="text-xs text-zinc-500">Police</div>
                  </div>
                </div>

                {/* Colors */}
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                    Couleurs
                  </div>
                  <div className="flex gap-2">
                    <div
                      className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm"
                      style={{ backgroundColor: selectedSite.settings.primaryColor }}
                      title="Principale"
                    />
                    <div
                      className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm"
                      style={{ backgroundColor: selectedSite.settings.backgroundColor }}
                      title="Fond"
                    />
                    <div
                      className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm"
                      style={{ backgroundColor: selectedSite.settings.textColor }}
                      title="Texte"
                    />
                  </div>
                </div>

                {/* Load button */}
                <button
                  onClick={handleLoadSite}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Charger ce site
                </button>

                <p className="text-xs text-zinc-400 text-center">
                  Attention : cela remplacera ton travail actuel
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400">
                <span className="text-4xl mb-3">👈</span>
                <p className="text-sm font-medium">Selectionne un site</p>
                <p className="text-xs mt-1">pour voir les details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
