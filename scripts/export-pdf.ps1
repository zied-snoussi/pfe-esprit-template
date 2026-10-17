# Exporte un .docx en PDF avec Word (met d'abord à jour la table des matières)
# ou un .pptx en PDF avec PowerPoint. Windows + Microsoft Office uniquement.
# Usage : powershell -ExecutionPolicy Bypass -File scripts/export-pdf.ps1 cahier/Cahier-des-charges.docx
param([Parameter(Mandatory = $true)][string]$Path)
$ErrorActionPreference = "Stop"
$src = (Resolve-Path $Path).Path
$pdf = [System.IO.Path]::ChangeExtension($src, ".pdf")

if ($src -like "*.docx") {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    try {
        $doc = $word.Documents.Open($src)
        foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
        $doc.Fields.Update() | Out-Null
        $doc.ExportAsFixedFormat($pdf, 17)   # 17 = wdExportFormatPDF
        $doc.Close(0)                        # 0 = ne pas enregistrer (le .docx reste celui du script)
    } finally { $word.Quit() }
} elseif ($src -like "*.pptx") {
    $ppt = New-Object -ComObject PowerPoint.Application
    try {
        $pres = $ppt.Presentations.Open($src, $true, $false, $false)
        $pres.SaveAs($pdf, 32)               # 32 = ppSaveAsPDF
        $pres.Close()
    } finally { $ppt.Quit() }
} else {
    throw "Format non pris en charge : $src (attendu : .docx ou .pptx)"
}
Write-Output "PDF : $pdf"
