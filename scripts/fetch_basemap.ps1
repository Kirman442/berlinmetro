# Cuts the Berlin basemap out of the latest Protomaps build (OpenStreetMap) and downloads fonts.
# Run from the app folder:  scripts\fetch_basemap.cmd  (or powershell -ExecutionPolicy Bypass -File scripts\fetch_basemap.ps1)
# NOTE: keep this file ASCII-only - Windows PowerShell 5.1 misreads UTF-8 without BOM.
# Output: public\tiles\berlin.pmtiles and public\fonts\<font>\<range>.pbf
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # otherwise Invoke-WebRequest is very slow
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root  = Split-Path -Parent $PSScriptRoot
$tools = Join-Path $root '.tools'
$bbox  = '12.9,52.3,13.9,52.72'   # same as MAX_BOUNDS in src/lib/config.js
$maxzoom = 15                      # Protomaps builds contain data up to z15
$UA = @{ 'User-Agent' = 'ubahn-basemap-script' }

function Step($t) { Write-Host "`n== $t" -ForegroundColor Cyan }
function Get-File($url, $out) {
  New-Item -ItemType Directory -Force (Split-Path -Parent $out) | Out-Null
  for ($i = 1; $i -le 4; $i++) {
    try { Invoke-WebRequest $url -OutFile $out -Headers $UA; return }
    catch { if ($i -eq 4) { throw "Download failed: $url ($($_.Exception.Message))" }; Start-Sleep -Seconds (3 * $i) }
  }
}

# 1) pmtiles.exe (go-pmtiles)
$exe = Join-Path $tools 'pmtiles.exe'
if (-not (Test-Path $exe)) {
  Step 'Downloading pmtiles.exe (github.com/protomaps/go-pmtiles)'
  New-Item -ItemType Directory -Force $tools | Out-Null
  $rel = Invoke-RestMethod 'https://api.github.com/repos/protomaps/go-pmtiles/releases/latest' -Headers $UA
  $asset = $rel.assets | Where-Object { $_.name -match 'Windows_x86_64\.zip$' } | Select-Object -First 1
  if (-not $asset) { throw "Release $($rel.tag_name) has no Windows x86_64 build" }
  $zip = Join-Path $tools $asset.name
  Get-File $asset.browser_download_url $zip
  Expand-Archive $zip $tools -Force
  $found = Get-ChildItem $tools -Recurse -Filter 'pmtiles.exe' | Select-Object -First 1
  if (-not $found) { throw 'pmtiles.exe not found in archive' }
  if ($found.FullName -ne $exe) { Move-Item $found.FullName $exe -Force }
  Write-Host "pmtiles $($rel.tag_name) ready"
}

# 2) latest Protomaps build
Step 'Looking up the latest Protomaps build'
$builds = Invoke-RestMethod 'https://build-metadata.protomaps.dev/builds.json' -Headers $UA
$key = ($builds | Where-Object { $_.key -match '^\d{8}\.pmtiles$' } | Sort-Object key | Select-Object -Last 1).key
if (-not $key) { throw 'Could not determine the build from builds.json' }
Write-Host "Build: $key"

# 3) extract Berlin (only the needed byte ranges are downloaded, not the planet)
Step "Extracting Berlin bbox=$bbox, maxzoom=$maxzoom"
$tilesDir = Join-Path $root 'public\tiles'
New-Item -ItemType Directory -Force $tilesDir | Out-Null
$out = Join-Path $tilesDir 'berlin.pmtiles'
$tmp = Join-Path $tools 'berlin.pmtiles.part'
if (Test-Path $tmp) { Remove-Item $tmp -Force }
& $exe extract "https://build.protomaps.com/$key" $tmp "--bbox=$bbox" "--maxzoom=$maxzoom"
if ($LASTEXITCODE -ne 0) { throw "pmtiles extract failed with exit code $LASTEXITCODE" }
Move-Item $tmp $out -Force
& $exe show $out | Select-Object -First 20
Write-Host ('Size: {0:N1} MB' -f ((Get-Item $out).Length / 1MB))

# 4) fonts (Latin, umlauts, typographic dashes and quotes)
Step 'Downloading fonts'
$fonts  = 'Noto Sans Regular', 'Noto Sans Medium', 'Noto Sans Italic'
$ranges = '0-255', '256-511', '8192-8447'
foreach ($f in $fonts) {
  foreach ($r in $ranges) {
    $url = 'https://protomaps.github.io/basemaps-assets/fonts/' + [Uri]::EscapeDataString($f) + "/$r.pbf"
    Get-File $url (Join-Path $root "public\fonts\$f\$r.pbf")
  }
  Write-Host "  $f"
}

Step 'Done. Reload the app page (Ctrl+F5).'
