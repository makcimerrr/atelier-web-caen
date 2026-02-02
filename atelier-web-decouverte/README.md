# Site Builder Pédagogique Avancé

Un **mini constructeur de site web** pour découvrir le développement web en 15-20 minutes.
Les participants créent et personnalisent leur site **entièrement dans le navigateur**, sans toucher au code.

---

## Lancement rapide

```bash
cd atelier-web-decouverte
pnpm install   # ou npm install
pnpm dev       # ou npm run dev
```

Ouvrir **http://localhost:3000**

---

## Fonctionnalités

### 🖥️ Interface en deux colonnes
- **Gauche** : Panneau d'édition (mini-IDE visuel)
- **Droite** : Aperçu en temps réel du site

### 📝 Onglet Contenu
- Modifier le nom du site et les liens de navigation
- Éditer les textes (titres, descriptions, boutons)
- Changer les images parmi une sélection
- Sections : Hero, Texte, Features, CTA, Image

### 🎨 Onglet Style
- 8 couleurs principales
- 6 couleurs de fond
- 3 polices (Moderne, Classique, Code)
- 3 espacements (Compact, Normal, Large)

### 🧱 Onglet Structure
- Ajouter/supprimer des sections
- Réorganiser les sections (monter/descendre)
- Afficher/masquer des sections (toggle)
- Réinitialiser le site

### 💬 Onglet Commentaires
- Laisser un message avec un pseudo
- Choisir un tag (Web, Cyber, Créatif, Découverte)
- Les commentaires sont sauvegardés localement

### 💡 Popups pédagogiques "Voir le code"
- Chaque section a un bouton "</> Code"
- Montre un extrait de code simplifié
- Explique ce qui se passe "sous le capot"

### 📱 Vue responsive
- Basculer entre Desktop et Mobile
- Le site s'adapte automatiquement
- Illustre le concept de responsive design

### 🖨️ Export
- Bouton "Voir mon site final"
- Vue plein écran sans éditeur
- Option d'impression

### 💬 Mur des participants
- Page dédiée `/comments`
- Affiche tous les commentaires
- Filtrage par tag
- Design visuel attrayant

---

## Architecture

```
app/
├── components/
│   ├── editor/           # Panneau d'édition
│   │   ├── EditorPanel.tsx
│   │   ├── EditorTabs.tsx
│   │   ├── ContentEditor.tsx
│   │   ├── StyleEditor.tsx
│   │   ├── StructureEditor.tsx
│   │   └── CommentEditor.tsx
│   ├── preview/          # Aperçu du site
│   │   ├── SitePreview.tsx
│   │   ├── Navbar.tsx
│   │   ├── Section.tsx
│   │   └── Footer.tsx
│   ├── ui/               # Composants UI
│   │   ├── CodePopup.tsx
│   │   ├── ViewToggle.tsx
│   │   └── CodeButton.tsx
│   └── FinalView.tsx     # Vue finale/impression
├── context/
│   └── SiteContext.tsx   # État global React
├── types/
│   └── site.ts           # Types TypeScript
├── comments/
│   └── page.tsx          # Page mur des commentaires
├── globals.css
├── layout.tsx
└── page.tsx              # Page principale
```

---

## Guide de l'animateur

### Concept pédagogique

Ce projet illustre les **3 piliers du web** :

| Pilier | Onglet | Ce qu'on apprend |
|--------|--------|------------------|
| **Contenu** | 📝 | Ce qu'on veut dire |
| **Style** | 🎨 | Comment ça apparaît |
| **Structure** | 🧱 | Comment c'est organisé |

### Déroulement suggéré (15-20 min)

| Temps | Activité |
|-------|----------|
| 2 min | **Accueil** : "Vous allez créer votre propre site web !" |
| 2 min | **Démo** : Montrer l'interface (éditeur + aperçu) |
| 3 min | **Contenu** : Changer le titre, les textes |
| 3 min | **Style** : Personnaliser les couleurs |
| 3 min | **Structure** : Ajouter/réorganiser des sections |
| 2 min | **Code** : Montrer les popups pédagogiques |
| 2 min | **Mobile** : Basculer en vue mobile |
| 2 min | **Commentaire** : Laisser un message |
| 2 min | **Final** : Voir le site final, impression |

### Points clés à expliquer

1. **Tout dans le navigateur** — Pas besoin de coder !
2. **3 onglets = 3 concepts** — Contenu / Style / Structure
3. **Résultat instantané** — Chaque modification visible immédiatement
4. **Le code existe** — Les popups montrent ce qui se passe vraiment
5. **Responsive** — Le site s'adapte aux écrans

### Messages pédagogiques

> "Le **contenu**, c'est CE QUE tu veux dire"

> "Le **style**, c'est COMMENT ça apparaît"

> "La **structure**, c'est l'ORGANISATION de ta page"

> "Un développeur web travaille sur ces trois aspects chaque jour !"

### Astuces d'animation

- Commencer par des modifications simples (titre, couleur)
- Encourager l'expérimentation libre
- Montrer le bouton "reset" pour rassurer
- Proposer des défis ("Qui fait le site le plus original ?")
- Terminer par le mur des commentaires (effet social)

---

## Personnalisations disponibles

### Couleurs
🔵 Bleu • 🟣 Violet • 🩷 Rose • 🔴 Rouge • 🟠 Orange • 🟢 Vert • 🩵 Cyan • 🪻 Indigo

### Fonds
Blanc • Gris clair • Bleu clair • Rose clair • Vert clair • Jaune clair

### Polices
- **Moderne** (sans-serif)
- **Classique** (serif)
- **Code** (monospace)

### Types de sections
- 🌟 **Hero** — Section d'accueil avec image
- 📝 **Texte** — Paragraphe avec titre
- 🖼️ **Image** — Image avec légende
- ⭐ **Features** — Liste de points forts
- 🎯 **CTA** — Appel à l'action

---

## Technologies

- **Next.js 15** (App Router)
- **React 19**
- **Tailwind CSS 4**
- **TypeScript**
- **localStorage** pour les commentaires

---

## Licence

Projet éducatif — Libre utilisation pour les ateliers pédagogiques.

---

*Créé pour le Salon de l'Orientation — Atelier découverte des métiers du web*
