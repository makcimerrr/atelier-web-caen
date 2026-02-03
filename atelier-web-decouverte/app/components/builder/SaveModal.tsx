"use client";

import { useState } from "react";
import { useBuilder } from "../../context/BuilderContext";

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaveModal({ isOpen, onClose }: SaveModalProps) {
  const { state } = useBuilder();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nom.trim() || !prenom.trim() || !email.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse email valide");
      return;
    }

    if (state.blocks.length === 0) {
      setError("Votre site est vide ! Ajoutez des elements avant d'enregistrer.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentInfo: { nom, prenom, email },
          blocks: state.blocks,
          settings: state.settings,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setNom("");
          setPrenom("");
          setEmail("");
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'enregistrement");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setError("");
      setSuccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in">
        {/* Header */}
        <div className="relative h-24 bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
              backgroundSize: "20px 20px"
            }} />
          </div>
          <div className="text-center relative">
            <span className="text-4xl mb-2 block">💾</span>
            <h2 className="text-xl font-bold text-white">Enregistrer mon site</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-zinc-800 mb-2">Site enregistre !</h3>
              <p className="text-sm text-zinc-500">Ton site a ete sauvegarde avec succes.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-zinc-500 mb-4">
                Remplis tes informations pour sauvegarder ton site. On t'enverra le resultat par email !
              </p>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                  Prenom *
                </label>
                <input
                  type="text"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="Ex: Marie"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                  Nom *
                </label>
                <input
                  type="text"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="Ex: Dupont"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  placeholder="Ex: marie.dupont@email.com"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-zinc-100 text-zinc-700 font-medium rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 px-4 bg-green-500 text-white font-medium rounded-xl hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>Enregistrer</>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
