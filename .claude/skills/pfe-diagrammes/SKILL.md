---
name: pfe-diagrammes
description: Ajoute ou modifie un diagramme UML (cas d'utilisation, classes, séquence, activité, états, déploiement) généré en draw.io, ou une figure Excalidraw du rapport (architecture, CI/CD, flux), puis le rend en PNG, vérifie visuellement le résultat et l'insère dans le rapport et le cahier. À utiliser pour « ajoute un diagramme de séquence », « corrige le diagramme de classes », « fais un schéma d'architecture ».
---

# Diagrammes UML et figures

Lisez d'abord `.claude/rules/diagrammes.md`.

## Diagramme UML (draw.io)
1. Ouvrez `diagrammes/_source/build_diagrams.py` : chaque diagramme est une fonction, déclarée dans `DIAGRAMS`.
   Les aides sont dans `drawio.py` :
   - cas d'utilisation : `actor`, `usecase`, `boundary`, liens `ASSOC`, `INCLUDE`, `GENERAL` ;
   - classes : `klass(nom, x, y, attrs, ops, stereotype, existing, w)` → `(id, hauteur)`, liens `ASSOCIATION`,
     `COMPOSITION`, `ends=("1", "0..*")` pour les multiplicités ;
   - séquence : `lifeline`, `activation`, `msg(x1, x2, y, label, "sync"|"async"|"return")`, `self_msg`, `frame`;
   - activité / états : `lane`, `initial`, `final`, `action`, `decision`, `merge`, `state`, style `FLOW` ;
   - déploiement : `node`, `artifact` ; et partout `note`, `text`, `edge(..., points=..., style="exitX=..")`.
2. Partez de la fonction existante la plus proche ; gardez une grille régulière (colonnes et lignes en listes).
3. Générez et rendez :
   ```bash
   npm run diagrammes                   # tous
   python diagrammes/_source/build_diagrams.py && node diagrammes/_source/render.js 03   # un seul (filtre)
   ```
4. **Ouvrez le PNG** (`diagrammes/png/NN-....png`) avec l'outil Read. Corrigez tant qu'il reste une flèche qui
   traverse une boîte, des étiquettes superposées ou un texte coupé. Recommencez le rendu.
5. Insérez-le dans le rapport : `\insererfigure{uml/NN-nom.png}{Légende}{fig:label}` (ou
   `\insererfigurepaysage` s'il est large), citez-le dans le texte, compilez.
6. Le cahier l'insère tout seul (`<!-- diagrammes -->`) ; ajoutez sa légende dans `CAPTIONS` de
   `cahier/build_cahier_docx.py`.

## Figure Excalidraw (style croquis)
1. `rapport/figures/_source/diagrams.js` : une fonction par figure, exportée par son nom de fichier.
   Aides (`lib.js`) : `box(id, x, y, w, h, texte, couleur, options)`, `zone(...)` (cadre pointillé titré),
   `arrow(de, vers, label, options)`, `text`, `legend`. Couleurs `C.blue`, `C.green`... ; `NEW` = orange.
2. `npm run figures` (ou `node rapport/figures/_source/render.js rapport/figures <nom>` pour une seule).
3. Ouvrez `rapport/figures/<nom>.png`, corrigez, recommencez. La scène éditable est dans
   `rapport/figures/excalidraw/<nom>.excalidraw.md` (Obsidian Excalidraw ou excalidraw.com après extraction du JSON).

## Problèmes fréquents
- `Error: browserType.launch: Executable doesn't exist` : définir `CHROME` (draw.io) / `CHROME_PATH`
  (Excalidraw) vers l'exécutable de Chrome ou Edge.
- Rendu vide : la machine doit accéder à `viewer.diagrams.net` et `unpkg.com` (scripts chargés en ligne).
