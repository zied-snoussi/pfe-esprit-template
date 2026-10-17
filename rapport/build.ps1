# Compile le rapport : XeLaTeX -> BibTeX -> XeLaTeX x2 (MiKTeX ou TeX Live)
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
xelatex -interaction=nonstopmode main.tex | Out-Null
bibtex main | Out-Null
xelatex -interaction=nonstopmode main.tex | Out-Null
xelatex -interaction=nonstopmode main.tex | Select-String -Pattern "Output written|^!"
