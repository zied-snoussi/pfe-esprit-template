#!/usr/bin/env sh
# Compile le rapport : XeLaTeX -> BibTeX -> XeLaTeX x2 (TeX Live ou MiKTeX)
# Pas de « set -e » : XeLaTeX et BibTeX renvoient un code non nul sur de simples avertissements.
cd "$(dirname "$0")" || exit 1
xelatex -interaction=nonstopmode main.tex > /dev/null
bibtex main > /dev/null
xelatex -interaction=nonstopmode main.tex > /dev/null
xelatex -interaction=nonstopmode main.tex | grep -E "Output written|^!"
grep -E "^!|LaTeX Warning: (Reference|Citation)" main.log && exit 1 || exit 0
