"use client";

import { useState, useEffect } from "react";
import { SavedSiteSummary, SavedSite } from "../types/builder";
import Link from "next/link";

export default function AdminPage() {
  const [sites, setSites] = useState<SavedSiteSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSending, setIsSending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "sent" | "pending">("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [previewSite, setPreviewSite] = useState<SavedSite | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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
      setToast({ message: "Erreur lors du chargement des sites", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const loadSitePreview = async (id: string) => {
    try {
      setIsLoadingPreview(true);
      const res = await fetch(`/api/sites/${id}`);
      if (res.ok) {
        const data = await res.json();
        setPreviewSite(data);
      }
    } catch (err) {
      console.error("Error loading site:", err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredSites.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSites.map((s) => s.id)));
    }
  };

  const selectPending = () => {
    const pendingIds = filteredSites.filter((s) => !s.emailSent).map((s) => s.id);
    setSelectedIds(new Set(pendingIds));
  };

  const sendEmails = async () => {
    if (selectedIds.size === 0) {
      setToast({ message: "Selectionnez au moins un site", type: "error" });
      return;
    }

    try {
      setIsSending(true);
      const res = await fetch("/api/export/send-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteIds: Array.from(selectedIds) }),
      });

      const data = await res.json();

      if (res.ok) {
        setToast({
          message: data.message,
          type: data.failCount > 0 ? "error" : "success",
        });
        await fetchSites();
        setSelectedIds(new Set());
      } else {
        setToast({ message: data.error || "Erreur lors de l'envoi", type: "error" });
      }
    } catch (err) {
      console.error("Error sending emails:", err);
      setToast({ message: "Erreur de connexion", type: "error" });
    } finally {
      setIsSending(false);
    }
  };

  const deleteSites = async () => {
    if (selectedIds.size === 0) {
      setToast({ message: "Selectionnez au moins un site", type: "error" });
      return;
    }

    const confirmDelete = window.confirm(
      `Supprimer ${selectedIds.size} site(s) ? Cette action est irreversible.`
    );
    if (!confirmDelete) return;

    try {
      setIsDeleting(true);
      let successCount = 0;
      let failCount = 0;

      for (const id of selectedIds) {
        try {
          const res = await fetch(`/api/sites/${id}`, { method: "DELETE" });
          if (res.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch {
          failCount++;
        }
      }

      setToast({
        message: `${successCount} site(s) supprime(s)${failCount > 0 ? `, ${failCount} echec(s)` : ""}`,
        type: failCount > 0 ? "error" : "success",
      });

      await fetchSites();
      setSelectedIds(new Set());
      setPreviewSite(null);
    } catch (err) {
      console.error("Error deleting sites:", err);
      setToast({ message: "Erreur lors de la suppression", type: "error" });
    } finally {
      setIsDeleting(false);
    }
  };

  const loadInEditor = () => {
    if (previewSite) {
      localStorage.setItem("loadConfig", JSON.stringify({
        blocks: previewSite.blocks,
        settings: previewSite.settings,
      }));
      window.location.href = "/";
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
    const matchesSearch =
      site.studentInfo.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.studentInfo.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.studentInfo.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "sent" && site.emailSent) ||
      (filterStatus === "pending" && !site.emailSent);

    return matchesSearch && matchesFilter;
  });

  const sentCount = sites.filter((s) => s.emailSent).length;
  const pendingCount = sites.filter((s) => !s.emailSent).length;

  return (
    <div className="min-h-screen bg-zinc-100">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              title="Retour au builder"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-zinc-800">Panel Admin</h1>
              <p className="text-sm text-zinc-500">Gestion des sites et envoi d'emails</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSites}
              className="p-2 rounded-lg hover:bg-zinc-100 transition-colors"
              title="Rafraichir"
            >
              <svg className="w-5 h-5 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-zinc-800">{sites.length}</div>
            <div className="text-sm text-zinc-500">Sites total</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{sentCount}</div>
            <div className="text-sm text-zinc-500">Emails envoyes</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="text-3xl font-bold text-orange-500">{pendingCount}</div>
            <div className="text-sm text-zinc-500">En attente</div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
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

            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filterStatus === "all"
                    ? "bg-zinc-800 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Tous ({sites.length})
              </button>
              <button
                onClick={() => setFilterStatus("sent")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filterStatus === "sent"
                    ? "bg-green-600 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                Envoyes ({sentCount})
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  filterStatus === "pending"
                    ? "bg-orange-500 text-white"
                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                }`}
              >
                En attente ({pendingCount})
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-100">
            <div className="flex items-center gap-3">
              <button
                onClick={selectAll}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedIds.size === filteredSites.length && filteredSites.length > 0
                  ? "Tout deselectionner"
                  : "Tout selectionner"}
              </button>
              <span className="text-zinc-300">|</span>
              <button
                onClick={selectPending}
                className="text-sm text-orange-600 hover:text-orange-800 font-medium"
              >
                Selectionner en attente
              </button>
              {selectedIds.size > 0 && (
                <span className="text-sm text-zinc-500">
                  ({selectedIds.size} selectionne{selectedIds.size > 1 ? "s" : ""})
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={deleteSites}
                disabled={selectedIds.size === 0 || isDeleting}
                className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  selectedIds.size === 0 || isDeleting
                    ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {isDeleting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Suppression...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </>
                )}
              </button>

              <button
                onClick={sendEmails}
                disabled={selectedIds.size === 0 || isSending}
                className={`px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all ${
                  selectedIds.size === 0 || isSending
                    ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
                }`}
              >
                {isSending ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Envoyer les emails
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Sites list */}
        <div className="flex gap-6">
          {/* List */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden max-h-[calc(100vh-380px)] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : filteredSites.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-4xl mb-3 block">🔍</span>
                  <p className="text-zinc-500 font-medium">
                    {searchTerm || filterStatus !== "all"
                      ? "Aucun resultat"
                      : "Aucun site enregistre"}
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-zinc-50 border-b border-zinc-200 sticky top-0 z-10">
                    <tr>
                      <th className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.size === filteredSites.length && filteredSites.length > 0}
                          onChange={selectAll}
                          className="w-4 h-4 rounded border-zinc-300"
                        />
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-zinc-600">Etudiant</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-zinc-600">Email</th>
                      <th className="text-left px-4 py-3 text-sm font-semibold text-zinc-600">Date</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold text-zinc-600">Statut</th>
                      <th className="w-20"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredSites.map((site) => (
                      <tr
                        key={site.id}
                        className={`transition-colors ${
                          selectedIds.has(site.id) ? "bg-blue-50" : "hover:bg-zinc-50"
                        } ${previewSite?.id === site.id ? "bg-purple-50" : ""}`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(site.id)}
                            onChange={() => toggleSelect(site.id)}
                            className="w-4 h-4 rounded border-zinc-300"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                              {site.studentInfo.prenom.charAt(0)}
                              {site.studentInfo.nom.charAt(0)}
                            </div>
                            <div>
                              <div className="font-medium text-zinc-800">
                                {site.studentInfo.prenom} {site.studentInfo.nom}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-zinc-600">{site.studentInfo.email}</td>
                        <td className="px-4 py-3 text-sm text-zinc-500">{formatDate(site.createdAt)}</td>
                        <td className="px-4 py-3 text-center">
                          {site.emailSent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Envoye
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => loadSitePreview(site.id)}
                            className="p-2 rounded-lg hover:bg-zinc-100 text-zinc-500 hover:text-zinc-700 transition-colors"
                            title="Voir les details"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Preview panel */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h3 className="font-semibold text-zinc-800 mb-4">Apercu du site</h3>
              {isLoadingPreview ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                </div>
              ) : previewSite ? (
                <div className="space-y-4">
                  <div className="text-center pb-4 border-b border-zinc-100">
                    <h4 className="font-bold text-lg text-zinc-800">{previewSite.settings.siteName}</h4>
                    <p className="text-sm text-zinc-500">{previewSite.settings.siteDescription}</p>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-lg">
                    <div className="text-xs font-medium text-zinc-400 uppercase mb-2">Createur</div>
                    <div className="font-medium text-zinc-800">
                      {previewSite.studentInfo.prenom} {previewSite.studentInfo.nom}
                    </div>
                    <div className="text-sm text-blue-600">{previewSite.studentInfo.email}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-zinc-50 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-600">{previewSite.blocks.length}</div>
                      <div className="text-xs text-zinc-500">Elements</div>
                    </div>
                    <div className="p-3 bg-zinc-50 rounded-lg text-center">
                      <div className="text-lg font-bold text-purple-600 capitalize">{previewSite.settings.fontFamily}</div>
                      <div className="text-xs text-zinc-500">Police</div>
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-50 rounded-lg">
                    <div className="text-xs font-medium text-zinc-400 uppercase mb-2">Couleurs</div>
                    <div className="flex gap-2">
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm"
                        style={{ backgroundColor: previewSite.settings.primaryColor }}
                        title="Principale"
                      />
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm"
                        style={{ backgroundColor: previewSite.settings.backgroundColor }}
                        title="Fond"
                      />
                      <div
                        className="w-8 h-8 rounded-lg border border-zinc-200 shadow-sm"
                        style={{ backgroundColor: previewSite.settings.textColor }}
                        title="Texte"
                      />
                    </div>
                  </div>

                  {previewSite.emailSent && previewSite.emailSentAt && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                      <div className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">Email envoye</span>
                      </div>
                      <div className="text-xs text-green-600 mt-1">{formatDate(previewSite.emailSentAt)}</div>
                    </div>
                  )}

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
                <div className="text-center py-8 text-zinc-400">
                  <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p className="text-sm">Selectionnez un site pour voir les details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 animate-slide-up ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
