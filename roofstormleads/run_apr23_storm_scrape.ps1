# Scrape Google Maps for roofers in Apr 23, 2026 storm towns (KS/OK).
# Requires: Docker Desktop running, image: gosom/google-maps-scraper:latest-rod
#
# Usage (PowerShell):
#   cd "c:\Users\Oliver\OneDrive\Desktop\oliverseo curser\roofstormleads"
#   .\run_apr23_storm_scrape.ps1

$ErrorActionPreference = "Stop"
$here = $PSScriptRoot
$queryFile = Join-Path $here "queries_apr23_2026_storm.txt"
$resultsFile = Join-Path $here "results_apr23_2026_storm.csv"

if (-not (Test-Path $queryFile)) {
    Write-Error "Missing queries file: $queryFile"
}

if (Test-Path $resultsFile) { Remove-Item -Force $resultsFile }
New-Item -ItemType File -Path $resultsFile -Force | Out-Null

Write-Host "Scraping $($queryFile) -> $resultsFile"
Write-Host "Docker: gosom/google-maps-scraper:latest-rod (may take 15-45+ min)"
$start = Get-Date

docker run --rm `
  -v "${queryFile}:/queries.txt" `
  -v "${resultsFile}:/results.csv" `
  gosom/google-maps-scraper:latest-rod `
  -depth 2 -input /queries.txt -results /results.csv -exit-on-inactivity 5m -c 4

$elapsed = ((Get-Date) - $start).TotalMinutes
$lines = 0
if (Test-Path $resultsFile) {
    $lines = (Get-Content $resultsFile | Measure-Object -Line).Lines
}
Write-Host "Done in $([math]::Round($elapsed, 1)) min - $lines lines in results (incl. header)"
