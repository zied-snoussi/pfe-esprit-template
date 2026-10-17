---
name: pfe-cahier
description: Met à jour le cahier des charges du PFE (Markdown) et régénère sa version Word et PDF avec la table des matières et les diagrammes UML. À utiliser pour « ajoute une exigence », « mets à jour le cahier des charges », « génère le cahier en PDF ».
---

# Cahier des charges

Source : `cahier/Cahier-des-charges.md`. Le Word est produit par `cahier/build_cahier_docx.py` (python-docx).

## Format Markdown accepté
- Front matter : `projet`, `version`, `date`, `statut`, `pied` (en-tête et pied de page du Word).
- `#` titre, premier `##` = sous-titre, `##` suivants = sections numérotées à la main (« ## 3. Exigences »),
  `###` sous-sections.
- Tableaux Markdown, listes `- `, cases `- [ ]` / `- [x]`, `**gras**`, `` `code` ``.
- `<!-- diagrammes -->` insère tous les PNG de `diagrammes/png/` avec leur légende.

## Conventions
- Exigences fonctionnelles numérotées `EF-NN`, non fonctionnelles `ENF-NN`, priorité MoSCoW
  (Must / Should / Could / Won't). Une exigence = une phrase testable (« Le patient réserve... »).
- Ne renumérotez pas une exigence existante : ajoutez à la fin (le rapport et les tests y font référence).
- Augmentez `version` à chaque envoi aux encadrants.

## Générer
```bash
python cahier/build_cahier_docx.py
powershell -ExecutionPolicy Bypass -File scripts/export-pdf.ps1 cahier/Cahier-des-charges.docx   # Windows + Word
soffice --headless --convert-to pdf --outdir cahier cahier/Cahier-des-charges.docx               # LibreOffice
```
Le script Word met à jour la table des matières ; avec LibreOffice, elle reste en liste simple.
Rendez une ou deux pages du PDF en PNG et vérifiez la mise en forme (tableaux, diagrammes).

## Après modification
Reportez les nouveautés dans le chapitre 3 du rapport (`rapport/chapitres/ch3-analyse-besoins.tex`) et, si
besoin, dans `PROJET.md`, puis lancez `/pfe-coherence`.
