---
name: pfe-design-thinking
description: Crée ou met à jour les planches Excalidraw de Design Thinking du PFE (tableau de brainstorming en post-it, prototype basse fidélité / maquettes fil de fer mobile et web, et toute nouvelle planche comme personas ou carte d'empathie), les rend en PNG et en scène Excalidraw éditable, vérifie le rendu et les insère dans le rapport et la présentation. À utiliser pour « fais le brainstorming de mon projet », « dessine les maquettes », « prototype des écrans », « ajoute une carte d'empathie ».
---

# Design Thinking : brainstorming et prototype (Excalidraw)

Sources : `design-thinking/_source/` (une planche = une fonction exportée sous le nom du fichier de sortie,
déclarée dans `index.js`). Rendu : `npm run design` → `design-thinking/<nom>.excalidraw.md` (scène éditable dans
Obsidian Excalidraw), `design-thinking/png/<nom>.png`, et copie dans `rapport/figures/design-thinking/`.
Un seul : `node design-thinking/_source/render.js design-thinking <nom>`.

## Brainstorming (`brainstorm.js`)
- Idée centrale (ellipse) + 8 à 10 groupes (`clusters`) : titre coloré + 4 à 6 post-it de 2 lignes courtes.
- Thèmes utiles : problème, utilisateurs, objectifs et indicateurs, fonctions, pistes techniques, expérience,
  risques, concurrence, mesure du succès, idées bonus.
- Les idées viennent de l'étudiant (séance réelle, entretiens, `journal/`) : demandez-les ; ne présentez pas comme
  « issues de la séance » des idées inventées.
- Police manuscrite (Virgil) appliquée à la fin de la fonction : gardez cette boucle.

## Prototype basse fidélité (`prototype.js`)
- Aides : `phone(code, titre, sous-titre, x, y)` (cadre mobile 300×600), `webScreen(code, titre, sous-titre, x, y,
  marque, menu, actif, sélecteur)` (cadre web 680×440 avec menu latéral), `btn` (`primary`, `ok`, `danger`),
  `pill`, `table`, `line`, `flow` (flèche de parcours entre deux écrans), `R` (rectangle), `T` (texte).
- Un écran = un code (A1, A2, B1...) + un titre + une phrase qui dit à quoi il sert.
- Organisez par rangées : A = parcours principal de l'utilisateur final (avec flèches `flow`), B = back-office,
  C = pilotage / administration. Montrez aussi un cas d'erreur (encadré orange pointillé).
- Données fictives et cohérentes avec `PROJET.md` (mêmes acteurs, mêmes fonctions que le backlog).

## Vérifier
Ouvrez le PNG produit (outil Read ; recadrez une zone avec PIL si la planche est grande) et corrigez :
textes qui débordent d'un cadre, éléments superposés, flèches qui traversent un écran, rangées trop serrées.

## Intégrer
- Rapport : `rapport/annexes/annexe-c-design-thinking.tex` (`\insererfigurepaysage` pour le brainstorming,
  `\insererfigure` pour le prototype) ; citez l'annexe au chapitre 1 et le prototype au chapitre 5.
- Présentation : diapositives `image` avec `design-thinking/png/<nom>.png` dans `presentation/contenu.py`.
- Nouvelle planche (personas, carte d'empathie, parcours utilisateur) : nouveau module dans `_source/`, ajouté à
  `index.js`, en réutilisant `createDiagram()` de `lib.js` (`box`, `zone`, `arrow`, `path`, `text`, `legend`).
