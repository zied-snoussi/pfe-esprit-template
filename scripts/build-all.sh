#!/usr/bin/env sh
# Régénère tous les livrables : diagrammes, figures, rapport, cahier, présentation.
# Usage : sh scripts/build-all.sh   (depuis la racine du dépôt)
cd "$(dirname "$0")/.." || exit 1
python diagrammes/_source/build_diagrams.py && node diagrammes/_source/render.js || exit 1
node rapport/figures/_source/render.js rapport/figures || exit 1
node design-thinking/_source/render.js design-thinking || exit 1
sh rapport/build.sh || exit 1
python cahier/build_cahier_docx.py || exit 1
python presentation/build_deck.py || exit 1
echo "Terminé. PDF du cahier et des diapositives : scripts/export-pdf.ps1 (Word/PowerPoint) ou soffice --convert-to pdf."
