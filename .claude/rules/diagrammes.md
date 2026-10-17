---
paths:
  - "diagrammes/**"
  - "rapport/figures/_source/**"
---

# Règles des diagrammes

- Les diagrammes UML sont **générés** par `diagrammes/_source/build_diagrams.py` (aides dans `drawio.py`).
  Modifiez le script, jamais le `.drawio` ni le PNG. Rendu : `npm run diagrammes` (PNG dans `diagrammes/png/` et
  copie dans `rapport/figures/uml/`).
- Les figures « croquis » du rapport (architecture, CI/CD, flux) sont dans `rapport/figures/_source/diagrams.js`
  (Excalidraw). Rendu : `npm run figures` (PNG dans `rapport/figures/`, scène éditable dans
  `rapport/figures/excalidraw/`).
- Nommage : `NN-type-sujet` (`03-sequence-prise-rdv`). Le numéro fixe l'ordre dans le cahier des charges.
- UML correct : cas d'utilisation avec `«include»` (flèche vers le cas inclus) et `«extend»` (flèche vers le cas
  de base) ; multiplicités sur toutes les associations ; messages de séquence numérotés ; fragments `alt`/`opt`/
  `loop` avec gardes entre crochets ; diagrammes d'états avec état initial et final.
- Couleurs : bleu = élément du projet, gris = existant réutilisé, orange (`pfe=True` / `NEW`) = ce que le stage
  ajoute. Chaque diagramme qui utilise ces couleurs a une légende ou une note.
- Libellés en français, verbes à l'infinitif pour les cas d'utilisation et les actions.
- **Toujours ouvrir le PNG produit** et corriger : flèche qui traverse une boîte, étiquettes superposées, texte
  coupé, boîtes qui se chevauchent. Ajustez les coordonnées, les points de passage (`points=`) ou les ancrages
  (`exitX/exitY/entryX/entryY`).
- Un diagramme ajouté doit aussi être inséré dans le rapport (`\insererfigure`) et, si besoin, légendé dans
  `CAPTIONS` de `cahier/build_cahier_docx.py`.
