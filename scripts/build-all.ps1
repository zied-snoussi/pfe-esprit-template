# Régénère tous les livrables (Windows) : diagrammes, figures, rapport, cahier + PDF, présentation + PDF.
# Usage : powershell -ExecutionPolicy Bypass -File scripts/build-all.ps1
$ErrorActionPreference = "Stop"
Set-Location (Join-Path $PSScriptRoot "..")
function Run([string]$exe, [string[]]$arguments) {
    & $exe @arguments
    if ($LASTEXITCODE -ne 0) { throw "Échec : $exe $arguments" }
}
Run python @("diagrammes/_source/build_diagrams.py")
Run node @("diagrammes/_source/render.js")
Run node @("rapport/figures/_source/render.js", "rapport/figures")
& powershell -NoProfile -ExecutionPolicy Bypass -File rapport/build.ps1
Run python @("cahier/build_cahier_docx.py")
Run python @("presentation/build_deck.py")
& powershell -NoProfile -ExecutionPolicy Bypass -File scripts/export-pdf.ps1 cahier/Cahier-des-charges.docx
& powershell -NoProfile -ExecutionPolicy Bypass -File scripts/export-pdf.ps1 presentation/Presentation.pptx
