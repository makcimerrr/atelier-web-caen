"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Comment, COMMENT_TAGS, CommentTag } from "../types/builder";

// Générer une rotation aléatoire pour chaque commentaire
function getRandomRotation(seed: number): number {
  const rotations = [-3, -2, -1, 0, 1, 2, 3];
  return rotations[seed % rotations.length];
}

// Générer une couleur de fond aléatoire pour les post-its
function getRandomColor(seed: number): string {
  const colors = [
    "from-yellow-200 to-yellow-300",
    "from-pink-200 to-pink-300",
    "from-blue-200 to-blue-300",
    "from-green-200 to-green-300",
    "from-purple-200 to-purple-300",
    "from-orange-200 to-orange-300",
    "from-cyan-200 to-cyan-300",
    "from-rose-200 to-rose-300",
  ];
  return colors[seed % colors.length];
}

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState<CommentTag>("web");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/comments");
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!pseudo.trim() || !message.trim()) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, message, tag: selectedTag }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [newComment, ...prev]);
        setPseudo("");
        setMessage("");
        setShowForm(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError("Erreur lors de l'envoi");
      }
    } catch (err) {
      setError("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-zinc-900 overflow-auto">
      {/* Texture de mur */}
      <div
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 py-6 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour au builder
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-white/50 text-sm">{comments.length} messages</span>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/25 transition-all hover:scale-105"
            >
              + Laisser un message
            </button>
          </div>
        </div>
      </header>

      {/* Title */}
      <div className="relative z-10 text-center py-8">
        <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 mb-2"
            style={{ fontFamily: "var(--font-space), sans-serif" }}>
          Mur des messages
        </h1>
        <p className="text-white/60 text-lg">Laissez votre trace sur le mur !</p>
      </div>

      {/* Success notification */}
      {success && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-500 text-white rounded-full shadow-lg animate-bounce">
          Message ajouté au mur !
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div
            className="w-full max-w-md bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg shadow-2xl p-6 transform rotate-1"
            style={{ boxShadow: "8px 8px 0 rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-2xl">✍️</span>
                Nouveau message
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-black/10 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ton prénom ou pseudo
                </label>
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  maxLength={30}
                  className="w-full px-4 py-2 bg-white/70 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Ex: Alex"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ton message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={280}
                  rows={3}
                  className="w-full px-4 py-2 bg-white/70 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                  placeholder="Qu'as-tu pensé de cet atelier ?"
                />
                <div className="text-xs text-gray-500 mt-1 text-right">{message.length}/280</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choisis un tag
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMENT_TAGS.map((tag) => (
                    <button
                      key={tag.value}
                      type="button"
                      onClick={() => setSelectedTag(tag.value)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        selectedTag === tag.value
                          ? "text-white shadow-md scale-105"
                          : "bg-white/50 text-gray-600 hover:bg-white/70"
                      }`}
                      style={{
                        backgroundColor: selectedTag === tag.value ? tag.color : undefined,
                      }}
                    >
                      {tag.icon} {tag.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-100 border border-red-300 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>Coller sur le mur !</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Comments Wall */}
      <div className="relative z-10 px-4 pb-12">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-white/20 border-t-pink-500 rounded-full animate-spin mb-4" />
            <p className="text-white/60">Chargement du mur...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-24">
            <span className="text-6xl mb-4 block">🎨</span>
            <p className="text-white/60 text-xl">Le mur est vide...</p>
            <p className="text-white/40 mt-2">Soyez le premier à laisser votre trace !</p>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {/* Grille de post-its style graffiti */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
              {comments.map((comment, index) => {
                const tagInfo = COMMENT_TAGS.find((t) => t.value === comment.tag);
                const rotation = getRandomRotation(index + comment.id.charCodeAt(comment.id.length - 1));
                const bgColor = getRandomColor(index + comment.id.charCodeAt(0));

                return (
                  <div
                    key={comment.id}
                    className={`relative bg-gradient-to-br ${bgColor} p-5 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:z-10`}
                    style={{
                      transform: `rotate(${rotation}deg)`,
                      boxShadow: "4px 4px 0 rgba(0,0,0,0.2)",
                      animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    {/* Effet punaise */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-md" />

                    {/* Tag */}
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold text-white mb-3"
                      style={{ backgroundColor: tagInfo?.color }}
                    >
                      {tagInfo?.icon} {tagInfo?.label}
                    </div>

                    {/* Message */}
                    <p className="text-gray-800 font-medium leading-relaxed mb-4 text-sm">
                      "{comment.message}"
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm"
                          style={{ backgroundColor: tagInfo?.color || "#64748b" }}
                        >
                          {comment.pseudo.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-700 text-sm">{comment.pseudo}</span>
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>

                    {/* Effet tape */}
                    <div className="absolute -bottom-1 -right-1 w-8 h-3 bg-white/40 transform rotate-45" />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Floating graffiti elements */}
      <div className="fixed bottom-8 right-8 text-6xl opacity-20 pointer-events-none select-none">
        🎨
      </div>
      <div className="fixed top-32 left-8 text-4xl opacity-20 pointer-events-none select-none transform -rotate-12">
        ✨
      </div>
      <div className="fixed bottom-32 left-16 text-5xl opacity-20 pointer-events-none select-none transform rotate-6">
        💬
      </div>

      {/* CSS Animation */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) rotate(var(--rotation, 0deg));
          }
          to {
            opacity: 1;
            transform: translateY(0) rotate(var(--rotation, 0deg));
          }
        }
      `}</style>
    </div>
  );
}
