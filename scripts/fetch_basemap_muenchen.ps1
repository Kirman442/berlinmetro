# Cuts the Muenchen basemap out of the Protomaps build used for Berlin and Nuernberg (OpenStreetMap). No fonts.
# Run from the app folder:  powershell -ExecutionPolicy Bypass -File scripts\fetch_basemap_muenchen.ps1
# Optional: -Build 20261118.pmtiles  (default: the same build as berlin.pmtiles / nuernberg.pmtiles)
# NOTE: keep this file ASCII-only - Windows PowerShell 5.1 misreads UTF-8 without BOM.
# Output: public\tiles\muenchen.pmtiles
param([string]$Build = '20261118.pmtiles')
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root  = Split-Path -Parent $PSScriptRoot
$tools = Join-Path $root '.tools'
$bbox  = '11.35,47.98,11.80,48.30'   # Muenchen incl. Garching-Forschungszentrum
$maxzoom = 14
$UA = @{ 'User-Agent' = 'ubahn-basemap-script' }

function Step($t) { Write-Host "`n== $t" -ForegroundColor Cyan }

# 1) pmtiles.exe from .tools (the one already used for Berlin)
$exe = Join-Path $tools 'pmtiles.exe'
if (-not (Test-Path $exe)) { throw "pmtiles.exe not found: $exe  (run scripts\fetch_basemap.ps1 once, it downloads it)" }

# 2) Protomaps build: same as Berlin; if it is no longer published, fall back to the latest one
Step 'Checking the Protomaps build'
$builds = Invoke-RestMethod 'https://build-metadata.protomaps.dev/builds.json' -Headers $UA
$keys = @($builds | Where-Object { $_.key -match '^\d{8}\.pmtiles$' } | ForEach-Object { $_.key } | Sort-Object)
if ($keys.Count -eq 0) { throw 'Could not read builds.json' }
$key = $Build
if ($keys -notcontains $key) {
  $key = $keys[-1]
  Write-Host "Build $Build is not available any more, using the latest: $key" -ForegroundColor Yellow
}
Write-Host "Build: $key"

# 3) extract (only the needed byte ranges are downloaded), with retries
Step "Extracting Muenchen bbox=$bbox, maxzoom=$maxzoom"
$tilesDir = Join-Path $root 'public\tiles'
New-Item -ItemType Directory -Force $tilesDir | Out-Null
$out = Join-Path $tilesDir 'muenchen.pmtiles'
$tmp = Join-Path $tools 'muenchen.pmtiles.part'
$ok = $false
for ($i = 1; $i -le 3; $i++) {
  if (Test-Path $tmp) { Remove-Item $tmp -Force }
  & $exe extract "https://build.protomaps.com/$key" $tmp "--bbox=$bbox" "--maxzoom=$maxzoom"
  if ($LASTEXITCODE -eq 0 -and (Test-Path $tmp)) { $ok = $true; break }
  Write-Host "extract failed (exit $LASTEXITCODE), retry $i" -ForegroundColor Yellow
  Start-Sleep -Seconds (5 * $i)
}
if (-not $ok) { throw 'pmtiles extract failed 3 times' }
Move-Item $tmp $out -Force
& $exe show $out | Select-Object -First 20
Write-Host ('Size: {0:N1} MB' -f ((Get-Item $out).Length / 1MB))
Step "Done: $out"
