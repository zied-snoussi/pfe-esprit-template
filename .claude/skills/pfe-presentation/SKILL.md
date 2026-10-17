---
name: pfe-presentation
description: Prépare ou met à jour la présentation PowerPoint du PFE (restitution ESPRIT, soutenance) à partir du rapport et de la fiche projet, la génère en PPTX/PDF et vérifie chaque diapositive. À utiliser pour « prépare ma 1re restitution », « fais les slides de soutenance », « ajoute une diapo ».
---

# Présentation

Lisez `.claude/rules/presentation.md`. Le contenu est dans `presentation/contenu.py` (types : `titre`, `plan`,
`section`, `puces`, `image`, `cartes`, `chiffres`, `frise`, `fin`, décrits en tête du fichier).

## 1. Choisir le déroulé selon l'échéance
| Échéance | Durée | Contenu |
|---|---|---|
| 1re restitution (semaine 9) | 10–15 min | contexte, existant, problématique, solution, besoins, planning, avancement |
| 2e restitution (semaine 21) | 15–20 min | + architecture, conception, réalisation (captures), avancement, reste à faire |
| Soutenance | 20–25 min | déroulé complet + tests, résultats chiffrés, démo, perspectives |
Demandez la durée si elle n'est pas connue.

## 2. Écrire le contenu
- Reprenez les faits de `PROJET.md` et les figures déjà produites (`diagrammes/png/`, `rapport/figures/`,
  `rapport/figures/captures/`) : pas de nouveau chiffre, pas de nouveau schéma qui contredise le rapport.
- Titre = message ; 3 à 5 puces courtes ; une figure par diapositive au plus.
- Ajoutez les notes orales dans la conversation (ou dans un fichier `presentation/notes.md`) si l'étudiant le demande.

## 3. Générer et vérifier
```bash
python presentation/build_deck.py
powershell -ExecutionPolicy Bypass -File scripts/export-pdf.ps1 presentation/Presentation.pptx
```
Rendez le PDF en PNG (une planche contact suffit) et regardez chaque diapositive : texte qui déborde, image trop
petite, cadre orange « Image à produire » restant. Corrigez `contenu.py` (ou `build_deck.py` pour un problème de
mise en page) et régénérez.

## Personnaliser le style
Couleurs : `META["couleur"]` et `META["accent"]`. Police : `FONT` dans `build_deck.py`. Pour utiliser le modèle
PowerPoint de l'entreprise, remplacez `Presentation()` par `Presentation("modele.pptx")` et vérifiez la mise en page.
