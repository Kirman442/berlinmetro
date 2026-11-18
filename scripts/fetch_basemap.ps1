# Вырезает подложку Берлина из сборки Protomaps (OpenStreetMap) и скачивает шрифты.
# Запуск из папки приложения:  scripts\fetch_basemap.cmd  (или powershell -ExecutionPolicy Bypass -File scripts\fetch_basemap.ps1)
# Результат: public\tiles\berlin.pmtiles и public\fonts\<шрифт>\<диапазон>.pbf
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'   # иначе Invoke-WebRequest очень медленный
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root  = Split-Path -Parent $PSScriptRoot
$tools = Join-Path $root '.tools'
$bbox  = '12.9,52.3,13.9,52.72'   # как MAX_BOUNDS в src/lib/config.js
$maxzoom = 15                      # в сборках Protomaps данные есть до 15
$UA = @{ 'User-Agent' = 'ubahn-basemap-script' }

function Step($t) { Write-Host "`n== $t" -ForegroundColor Cyan }
function Get-File($url, $out) {
  New-Item -ItemType Directory -Force (Split-Path -Parent $out) | Out-Null
  for ($i = 1; $i -le 4; $i++) {
    try { Invoke-WebRequest $url -OutFile $out -Headers $UA; return }
    catch { if ($i -eq 4) { throw "Не скачалось: $url ($($_.Exception.Message))" }; Start-Sleep -Seconds (3 * $i) }
  }
}

# 1) pmtiles.exe (go-pmtiles)
$exe = Join-Path $tools 'pmtiles.exe'
if (-not (Test-Path $exe)) {
  Step 'Скачиваю pmtiles.exe (github.com/protomaps/go-pmtiles)'
  New-Item -ItemType Directory -Force $tools | Out-Null
  $rel = Invoke-RestMethod 'https://api.github.com/repos/protomaps/go-pmtiles/releases/latest' -Headers $UA
  $asset = $rel.assets | Where-Object { $_.name -match 'Windows_x86_64\.zip$' } | Select-Object -First 1
  if (-not $asset) { throw "В релизе $($rel.tag_name) нет сборки для Windows x86_64" }
  $zip = Join-Path $tools $asset.name
  Get-File $asset.browser_download_url $zip
  Expand-Archive $zip $tools -Force
  $found = Get-ChildItem $tools -Recurse -Filter 'pmtiles.exe' | Select-Object -First 1
  if (-not $found) { throw 'pmtiles.exe не найден в архиве' }
  if ($found.FullName -ne $exe) { Move-Item $found.FullName $exe -Force }
  Write-Host "pmtiles $($rel.tag_name) готов"
}

# 2) последняя сборка Protomaps
Step 'Ищу последнюю сборку Protomaps'
$builds = Invoke-RestMethod 'https://build-metadata.protomaps.dev/builds.json' -Headers $UA
$key = ($builds | Where-Object { $_.key -match '^\d{8}\.pmtiles$' } | Sort-Object key | Select-Object -Last 1).key
if (-not $key) { throw 'Не удалось определить сборку из builds.json' }
Write-Host "Сборка: $key"

# 3) вырезка Берлина (качаются только нужные куски по HTTP Range, а не вся планета)
Step "Вырезаю Берлин bbox=$bbox, maxzoom=$maxzoom"
$tilesDir = Join-Path $root 'public\tiles'
New-Item -ItemType Directory -Force $tilesDir | Out-Null
$out = Join-Path $tilesDir 'berlin.pmtiles'
$tmp = Join-Path $tools 'berlin.pmtiles.part'
if (Test-Path $tmp) { Remove-Item $tmp -Force }
& $exe extract "https://build.protomaps.com/$key" $tmp "--bbox=$bbox" "--maxzoom=$maxzoom"
if ($LASTEXITCODE -ne 0) { throw "pmtiles extract завершился с кодом $LASTEXITCODE" }
Move-Item $tmp $out -Force
& $exe show $out | Select-Object -First 20
Write-Host ('Размер: {0:N1} МБ' -f ((Get-Item $out).Length / 1MB))

# 4) шрифты (латиница, умляуты, типографские – „ “ …)
Step 'Скачиваю шрифты'
$fonts  = 'Noto Sans Regular', 'Noto Sans Medium', 'Noto Sans Italic'
$ranges = '0-255', '256-511', '8192-8447'
foreach ($f in $fonts) {
  foreach ($r in $ranges) {
    $url = 'https://protomaps.github.io/basemaps-assets/fonts/' + [Uri]::EscapeDataString($f) + "/$r.pbf"
    Get-File $url (Join-Path $root "public\fonts\$f\$r.pbf")
  }
  Write-Host "  $f"
}

Step 'Готово. Обнови страницу приложения (Ctrl+F5).'
