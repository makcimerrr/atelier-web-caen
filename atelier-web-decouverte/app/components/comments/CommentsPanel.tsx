"use client";

import { useState, useEffect } from "react";
import { Comment, COMMENT_TAGS, CommentTag } from "../../types/builder";

interface CommentsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentsPanel({ isOpen, onClose }: CommentsPanelProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [pseudo, setPseudo] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTag, setSelectedTag] = useState<CommentTag>("web");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Fetch comments
  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-bounce-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <div>
              <h2 className="text-lg font-bold text-white">Mur des commentaires</h2>
              <p className="text-xs text-white/80">Laissez votre trace !</p>
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

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          {/* Success message */}
          {success && (
            <div className="m-4 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2 animate-slide-up">
              <span>✅</span>
              Merci pour votre commentaire !
            </div>
          )}

          {/* Form toggle */}
          {!showForm ? (
            <div className="p-4">
              <button
                onClick={() => setShowForm(true)}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <span>✍️</span>
                Laisser un commentaire
              </button>
            </div>
          ) : (
            /* Comment form */
            <form onSubmit={handleSubmit} className="p-4 border-b border-gray-100">
              <div className="space-y-4">
                {/* Pseudo */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Ton prénom ou pseudo
                  </label>
                  <input
                    type="text"
                    value={pseudo}
                    onChange={(e) => setPseudo(e.target.value)}
                    maxLength={30}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Alex"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Ton message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    maxLength={280}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Qu'as-tu pensé de cet atelier ?"
                  />
                  <div className="text-xs text-gray-400 mt-1 text-right">
                    {message.length}/280
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
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
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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

                {/* Error */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi...
                      </>
                    ) : (
                      <>Publier 🚀</>
                    )}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Comments list */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Commentaires récents ({comments.length})
            </h3>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-3" />
                <p className="text-sm text-gray-400">Chargement...</p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl mb-3 block">🌟</span>
                <p className="text-gray-500">Soyez le premier à commenter !</p>
              </div>
            ) : (
              <div className="space-y-3">
                {comments.map((comment) => {
                  const tagInfo = COMMENT_TAGS.find((t) => t.value === comment.tag);
                  return (
                    <div
                      key={comment.id}
                      className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                            style={{ backgroundColor: tagInfo?.color || "#64748b" }}
                          >
                            {comment.pseudo.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{comment.pseudo}</div>
                            <div className="text-xs text-gray-400">{formatDate(comment.createdAt)}</div>
                          </div>
                        </div>
                        <span
                          className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                          style={{ backgroundColor: tagInfo?.color }}
                        >
                          {tagInfo?.icon} {tagInfo?.label}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{comment.message}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
