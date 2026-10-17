# Guide pratique du PFE ESPRIT

Résumé des points utiles pour rédiger les livrables. **Référez-vous toujours aux documents officiels
transmis par ESPRIT** (guide de l'étudiant, note pédagogique du rapport, grilles d'évaluation) : ils priment sur
ce résumé et peuvent changer d'une année à l'autre.

## Calendrier type (stage de 26 semaines)

| Semaine | Échéance | Livrable du dépôt |
|---|---|---|
| 1–2 | Prise en main, étude de l'existant | `journal/`, `PROJET.md` |
| 3 | Plan de travail validé par les deux encadrants | `cahier/` v0.x, Gantt du chapitre 1 |
| 6 | Bilan périodique de début de stage | `journal/` |
| 9 | 1re restitution (présentation orale) | `presentation/` |
| 13–14 | Visite de mi-parcours de l'encadrant académique | rapport : chapitres 1 à 3 |
| 15 | Bilan périodique de milieu de stage | `journal/` |
| 18 | Version 0 du rapport | `rapport/main.pdf` |
| 21 | 2e restitution, évaluation par l'expert | `presentation/` |
| 23 | Bilan périodique de fin de stage | `journal/` |
| 26 | Version finale du rapport | `rapport/main.pdf` sans `\todo` |
| Chaque semaine | Journal de bord | `journal/AAAA-MM-JJ.md` |

## Mise en forme du rapport (appliquée par `rapport/config/preamble.tex`)

| Règle | Où |
|---|---|
| Times New Roman 12 pt, interligne 1,15, texte justifié | `\setmainfont`, `\setstretch` |
| Marges 2,5 cm | `geometry` |
| Alinéa de 0,5 cm | `\parindent` |
| Titres numérotés 1, 1.1, 1.1.1 en gras | `titlesec` |
| Légendes « Fig. 1.1 » et « Tab. 1.1 », citées dans le texte | `\captionsfrench` |
| Pagination « x/N » en bas à droite | `fancyhdr` + `lastpage` |
| Introduction et conclusion dans chaque chapitre | structure des chapitres |
| Pas de code dans le corps (annexes) | `annexes/` |
| Bibliographie et netographie | `bibliographie.bib`, style `plainnat` |
| Environ 40 pages hors annexes | à vérifier en fin de rédaction |

La page de garde fournie est générique : si ESPRIT vous donne un modèle officiel, remplacez
`rapport/pages/page-de-garde.tex` (ou incluez le PDF du modèle avec `\includepdf`).

## Conseils
- Écrivez le chapitre 1 et l'état de l'art pendant le Sprint 0 ; ils sont demandés tôt.
- Tenez le journal chaque vendredi : le chapitre 5 et les bilans s'écrivent ensuite tout seuls.
- Gardez une seule source de vérité (`PROJET.md`) et vérifiez la cohérence avant chaque envoi.
- Demandez à l'entreprise ce que vous pouvez publier : en cas de doute, dépôt **privé**.
