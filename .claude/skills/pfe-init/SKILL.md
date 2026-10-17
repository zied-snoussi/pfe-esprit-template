---
name: pfe-init
description: Personnalise le modèle de PFE ESPRIT avec le vrai projet de l'étudiant (remplace le projet d'exemple MediBook / Nova Solutions dans la fiche projet, le rapport LaTeX, le cahier des charges, les diagrammes et la présentation). À utiliser à la première ouverture du dépôt ou quand l'étudiant dit « mets mon projet », « initialise le template », « remplace l'exemple ».
---

# Initialiser le modèle avec le projet de l'étudiant

## 1. Recueillir les informations
Demandez (en une seule fois, avec AskUserQuestion ou en texte) ce qui manque :
- nom et prénom, spécialité / option, année universitaire ;
- entreprise d'accueil, encadrant entreprise (nom, fonction), encadrant académique ;
- dates de début et de fin du stage ;
- titre du sujet et nom court du projet ;
- 3 à 6 phrases sur le sujet : problème, utilisateurs, solution, technologies prévues ;
- couleur principale souhaitée (hexadécimal) ou celle du logo de l'entreprise.

Si l'étudiant ne sait pas encore, gardez « Prénom NOM » / `\todo{...}` : n'inventez rien.

## 2. Mettre à jour les sources, dans cet ordre
1. `PROJET.md` : front matter et sections (source unique).
2. `rapport/config/infos.tex` : toutes les macros.
3. `rapport/config/preamble.tex` : `\definecolor{principale}` si une couleur est donnée.
4. `cahier/Cahier-des-charges.md` : front matter (`projet`, `pied`), puis contexte, objectifs, acteurs, exigences.
5. `presentation/contenu.py` : `META`, diapositive de titre, puis contenu.
6. `cahier/build_cahier_docx.py` : `BLUE` = même couleur.

## 3. Remplacer le contenu d'exemple
Le contenu MediBook sert de **modèle de structure**. Pour chaque chapitre (`rapport/chapitres/*.tex`) :
- gardez la structure (introduction, sections, tableaux, figures, conclusion) ;
- remplacez le texte par celui du vrai projet à partir des informations données ;
- là où l'information manque, laissez une phrase courte + `\todo{ce qu'il faut compléter}`.
Faites de même pour les diagrammes (`diagrammes/_source/build_diagrams.py`, `rapport/figures/_source/diagrams.js`) :
adaptez acteurs, classes, séquences au vrai domaine, ou supprimez ceux qui ne s'appliquent pas encore
(et retirez leur `\insererfigure`).

## 4. Régénérer et vérifier
```bash
npm install && pip install -r requirements.txt
npm run diagrammes && npm run figures
sh rapport/build.sh
python cahier/build_cahier_docx.py
python presentation/build_deck.py
```
Ouvrez les PNG et le PDF produits pour vérifier le rendu, puis lancez `/pfe-coherence`.

## 5. Nettoyer
- `grep -rni "medibook\|nova solutions" --include=*.tex --include=*.md --include=*.py --include=*.js .`
  ne doit plus rien trouver (hors README qui présente l'exemple).
- Rappelez à l'étudiant de mettre le dépôt en **privé** s'il contient des informations de l'entreprise.
