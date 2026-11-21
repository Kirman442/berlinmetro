# Cuts the Hamburg basemap out of the latest Protomaps build (OpenStreetMap). No fonts.
# Run from the app folder:  powershell -ExecutionPolicy Bypass -File scripts\fetch_basemap_hamburg.ps1
# NOTE: keep this file ASCII-only - Windows PowerShell 5.1 misreads UTF-8 without BOM.
# Output: public\tiles\hamburg.pmtiles
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root  = Split-Path -Parent $PSScriptRoot
$tools = Join-Path $root '.tools'
$bbox  = '9.70,53.45,10.30,53.75'    # Hamburg incl. U1 to Norderstedt, Ahrensburg, Grosshansdorf
$maxzoom = 14
$UA = @{ 'User-Agent' = 'ubahn-basemap-script' }

function Step($t) { Write-Host "`n== $t" -ForegroundColor Cyan }
function Get-File($url, $out) {
  New-Item -ItemType Directory -Force (Split-Path -Parent $out) | Out-Null
  for ($i = 1; $i -le 4; $i++) {
    try { Invoke-WebRequest $url -OutFile $out -Headers $UA; return }
    catch { if ($i -eq 4) { throw "Download failed: $url ($($_.Exception.Message))" }; Start-Sleep -Seconds (3 * $i) }
  }
}

# 1) pmtiles.exe (same as for Berlin; downloaded only if missing)
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
}

# 2) latest Protomaps build (same logic as Berlin)
Step 'Looking up the latest Protomaps build'
$builds = Invoke-RestMethod 'https://build-metadata.protomaps.dev/builds.json' -Headers $UA
$key = ($builds | Where-Object { $_.key -match '^\d{8}\.pmtiles$' } | Sort-Object key | Select-Object -Last 1).key
if (-not $key) { throw 'Could not determine the build from builds.json' }
Write-Host "Build: $key"

# 3) extract (only the needed byte ranges are downloaded), with retries
Step "Extracting Hamburg bbox=$bbox, maxzoom=$maxzoom"
$tilesDir = Join-Path $root 'public\tiles'
New-Item -ItemType Directory -Force $tilesDir | Out-Null
$out = Join-Path $tilesDir 'hamburg.pmtiles'
$tmp = Join-Path $tools 'hamburg.pmtiles.part'
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
