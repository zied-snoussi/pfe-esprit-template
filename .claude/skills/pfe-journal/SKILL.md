---
name: pfe-journal
description: Écrit l'entrée hebdomadaire du journal de bord du stage (exigé par ESPRIT) à partir de ce que l'étudiant raconte, des commits de la semaine et des tickets, dans journal/AAAA-MM-JJ.md. À utiliser pour « fais mon journal de la semaine », « résume ma semaine de stage ».
---

# Journal de bord hebdomadaire

ESPRIT demande un journal de bord mis à jour chaque semaine ; il sert aussi à rédiger le chapitre 5 du rapport
et les bilans périodiques.

## 1. Rassembler la matière
- Demandez à l'étudiant ce qu'il a fait, appris et bloqué cette semaine (s'il ne l'a pas déjà dit).
- Si le dépôt du projet de stage est accessible et que l'étudiant donne son chemin :
  `git -C <chemin> log --since="7 days ago" --author="<nom>" --oneline`.
- Les jalons de la semaine viennent de `PROJET.md` (tableau des jalons ESPRIT).

## 2. Écrire `journal/AAAA-MM-JJ.md` (date du lundi de la semaine)
```markdown
---
semaine: 7
du: 2027-03-16
au: 2027-03-20
sprint: Release 1 · sprint 3
---

# Semaine 7

## Travail réalisé
- ...
## Difficultés et solutions
- ...
## Apprentissages
- ...
## Prochaine semaine
- ...
## Jalons ESPRIT
- (le cas échéant)
```
Phrases factuelles et courtes ; pas d'informations confidentielles de l'entreprise si le dépôt est public.

## 3. Après l'écriture
Si la semaine termine un sprint ou une release, proposez d'en reporter l'essentiel dans
`rapport/chapitres/ch5-realisation.tex` (`/pfe-rapport`).
