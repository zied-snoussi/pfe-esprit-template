---
name: pfe-coherence
description: Vérifie que tous les livrables du PFE (fiche projet, rapport LaTeX, cahier des charges, diagrammes, présentation) disent la même chose (noms, dates, encadrants, technologies, acteurs, exigences, chiffres, planning) et propose les corrections. À utiliser après un changement de fait, avant d'envoyer un livrable aux encadrants, ou sur « vérifie la cohérence ».
---

# Vérifier la cohérence des livrables

La référence est `PROJET.md`. Quand une autre source contredit la fiche, signalez-le ; ne tranchez pas seul
si la fiche paraît elle-même dépassée : demandez à l'étudiant.

## 1. Extraire les faits de chaque source
| Fait | Où le chercher |
|---|---|
| Étudiant, encadrants, entreprise, dates, titre | `rapport/config/infos.tex`, front matter du cahier, `META` et diapo de titre de `presentation/contenu.py` |
| Technologies | ch. 2 (tableau des choix), ch. 4, cahier § contraintes, diapositives architecture, diagramme de déploiement |
| Acteurs | ch. 3 (tableau des acteurs), cahier § acteurs, diagramme de cas d'utilisation |
| Exigences | cahier (EF/ENF), ch. 3 (besoins, backlog) |
| Planning et jalons | ch. 1 (Gantt), annexe A, cahier § planning, diapo frise |
| Résultats chiffrés | ch. 6, résumé/abstract, conclusion, diapo chiffres |

Utilisez Grep (par ex. le nom de chaque technologie, chaque acteur, chaque chiffre) plutôt que de tout relire.

## 2. Contrôles systématiques
- Aucune trace du projet d'exemple si l'étudiant a personnalisé : `grep -rni "medibook\|nova solutions"`.
- Noms en dur dans le LaTeX au lieu des macros (`\etudiant`, `\entreprise`, `\nomprojet`).
- Chaque diagramme de `diagrammes/png/` utilisé dans le rapport, et chaque `\insererfigure` pointant vers un
  fichier existant (sinon cadre rouge).
- Chaque acteur du tableau des acteurs présent dans le diagramme de cas d'utilisation, et inversement.
- Résumé français et abstract anglais équivalents.
- `\todo` restants (`grep -rn "\\todo" rapport/`) : à lister, pas à inventer.

## 3. Rapport
Rendez un tableau : *fait · valeur de référence · source divergente (fichier:ligne) · correction proposée*.
Appliquez les corrections validées, puis régénérez ce qui dépend des fichiers modifiés (rapport, cahier,
présentation, diagrammes).
