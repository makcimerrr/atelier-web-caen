export function generateJS(): string {
  return `// Accordion toggle functionality
document.querySelectorAll('[data-accordion-toggle]').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var content = this.nextElementSibling;
    var icon = this.querySelector('[data-accordion-icon]');

    // Toggle content visibility
    content.classList.toggle('hidden');

    // Rotate icon
    if (content.classList.contains('hidden')) {
      icon.style.transform = 'rotate(0deg)';
    } else {
      icon.style.transform = 'rotate(180deg)';
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var targetId = this.getAttribute('href');
    if (targetId && targetId !== '#') {
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Initialize first accordion item as open
document.querySelectorAll('.accordion-item').forEach(function(item, index) {
  var content = item.querySelector('.accordion-content');
  var icon = item.querySelector('[data-accordion-icon]');

  if (index === 0 && content && icon) {
    content.classList.remove('hidden');
    icon.style.transform = 'rotate(180deg)';
  }
});

console.log('Site charge avec succes !');
`;
}

export function generateReadme(siteName: string, studentName: string): string {
  return `=====================================
  ${siteName}
  Cree par ${studentName}
=====================================

COMMENT VOIR MON SITE ?
-----------------------
1. Decompressez ce fichier ZIP
2. Ouvrez le fichier "index.html" dans votre navigateur
   (Double-cliquez dessus ou clic droit > Ouvrir avec > Chrome/Firefox/Edge)

CONTENU DU ZIP
--------------
- index.html : La page principale de votre site
- styles.css : Les styles visuels (couleurs, polices, espacements)
- script.js  : Les interactions (accordeons, defilement)
- README.txt : Ce fichier d'instructions

MODIFIER MON SITE
-----------------
Vous pouvez modifier ces fichiers avec n'importe quel editeur de texte :
- Notepad (Windows)
- TextEdit (Mac)
- Visual Studio Code (recommande pour les plus avances)

CONSEILS
--------
- Ne renommez pas les fichiers (le lien entre eux pourrait casser)
- Les images proviennent d'URLs externes (besoin d'internet pour les voir)
- Pour heberger votre site en ligne, vous pouvez utiliser :
  - GitHub Pages (gratuit)
  - Netlify (gratuit)
  - Vercel (gratuit)

BESOIN D'AIDE ?
---------------
Contactez l'equipe Atelier Web !

---
Cree avec Atelier Web Decouverte
`;
}
