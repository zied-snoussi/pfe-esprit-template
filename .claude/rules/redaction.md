---
paths:
  - "rapport/**/*.tex"
  - "cahier/**/*.md"
  - "presentation/contenu.py"
  - "journal/**/*.md"
---

# Règles de rédaction (français académique, note pédagogique ESPRIT)

## Style
- Français correct, phrases courtes (une idée par phrase), voix active. « Nous » dans le rapport.
- Pas de jargon non défini : chaque sigle est développé à sa première occurrence et figure dans
  `rapport/pages/abreviations.tex` (ordre alphabétique).
- Termes anglais en italique (`\textit{pull request}`), sauf noms de produits et de technologies.
- Typographie française : espace insécable avant « : ; ? ! » (XeLaTeX + polyglossia la gère), guillemets « … »
  (pas `\og`/`\fg`, inexistants avec polyglossia), nombres « 1 500 », pourcentages « 84 % ».
- Pas de superlatifs ni d'affirmations non vérifiables (« révolutionnaire », « le meilleur »).
- Aucun chiffre inventé : un résultat non mesuré reste en `\todo{...}`.

## Structure attendue par ESPRIT
- Chaque chapitre commence par `\section*{Introduction}` et finit par `\section*{Conclusion}` ; la conclusion
  fait la transition vers le chapitre suivant.
- Chaque figure et chaque tableau a une légende et est **cité dans le texte avant** d'apparaître
  (`la figure~\ref{fig:x}`, `le tableau~\ref{tab:x}`).
- Pas de code dans le corps du rapport : le code va en annexe.
- Toute source citée (`\cite{}`) figure dans `bibliographie.bib`, avec la date de consultation pour un site web.
- Corps du rapport d'environ 40 pages hors annexes ; le résumé et l'abstract disent la même chose (≈ 10 lignes).
- Plan classique : contexte → état de l'art → besoins → conception → réalisation → tests et déploiement.

## Confidentialité
- Ne décrivez pas les secrets de l'entreprise d'accueil (clients, chiffres internes, code) sans son accord.
