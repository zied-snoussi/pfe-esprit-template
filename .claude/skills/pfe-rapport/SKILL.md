---
name: pfe-rapport
description: Rédige, complète ou relit un chapitre du rapport de PFE en LaTeX selon la note pédagogique ESPRIT (structure, style, figures, tableaux, bibliographie), puis compile et corrige les erreurs. À utiliser pour « écris le chapitre 3 », « relis mon état de l'art », « ajoute une section », « mon rapport ne compile pas ».
---

# Rédiger ou relire le rapport

## Avant d'écrire
1. Lisez `PROJET.md` (faits), `rapport/config/infos.tex` (macros) et le chapitre visé.
2. Lisez les sources utiles : `cahier/Cahier-des-charges.md` pour les besoins (chapitre 3), `diagrammes/_source/
   build_diagrams.py` pour la conception (chapitre 4), `journal/` pour la réalisation (chapitre 5).
3. Respectez `.claude/rules/redaction.md` et `.claude/rules/latex.md`.

## Contenu attendu par chapitre
| Chapitre | Contenu |
|---|---|
| Introduction générale | contexte, problème, objectif, annonce du plan (≈ 1,5 page, sans figure) |
| 1 Contexte | organisme d'accueil, cadre, existant et critique, problématique, solution, méthodologie, planning (Gantt) |
| 2 État de l'art | concepts (encadrés `definition`), comparaison des solutions (tableau de critères), choix technologiques justifiés |
| 3 Besoins | acteurs, besoins fonctionnels et non fonctionnels, cas d'utilisation, backlog |
| 4 Conception | architecture globale, choix d'architecture, classes, séquences, activités, états |
| 5 Réalisation | environnement, puis par release/sprint : backlog, interfaces (captures) |
| 6 Tests et déploiement | stratégie de test, résultats mesurés, CI/CD, déploiement |
| Conclusion générale | rappel, réalisations, apports, perspectives |

## Rédaction
- Intro et conclusion de chaque chapitre ; chaque figure/tableau cité avant d'apparaître.
- Paragraphes de 3 à 6 phrases ; pas de listes à la suite sans phrase d'introduction.
- Résultats : seulement des valeurs fournies par l'étudiant ; sinon `\todo{mesurer ...}`.
- Sigle nouveau → l'ajouter à `pages/abreviations.tex` ; source nouvelle → `bibliographie.bib` + `\cite`.

## Compiler et vérifier
```bash
sh rapport/build.sh        # ou : powershell -ExecutionPolicy Bypass -File rapport/build.ps1
```
- Code de retour non nul = erreur `!` ou référence indéfinie : lisez `rapport/main.log` autour de la ligne
  signalée et corrigez.
- Regardez les `Overfull \hbox` (texte qui dépasse la marge) et reformulez ou coupez les mots longs.
- Pour une relecture visuelle, rendez quelques pages en PNG (par ex. `pdftoppm -r 60 -f 10 -l 12 -png
  rapport/main.pdf /tmp/p`) et ouvrez-les.

## Relecture (quand l'étudiant demande une revue)
Rendez une liste de remarques classées : structure ESPRIT, cohérence avec `PROJET.md`, clarté, typographie,
figures non citées, sigles non définis, `\todo` restants (`grep -rn "\\todo" rapport/`). Proposez les
corrections, puis appliquez celles que l'étudiant valide.
