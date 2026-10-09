# Gera capturas de documentação do site (desktop + mobile) em .capturas\
# Requer o servidor local rodando:  .\server.ps1  → http://localhost:8095
#
# Desktop: captura direta da página.
# Mobile : a página é exibida dentro de um iframe de 390px (_mobile-shot.html),
#          porque o modo headless nem sempre respeita --window-size como viewport.
$raiz = $PSScriptRoot
$saida = Join-Path $raiz ".capturas"
New-Item -ItemType Directory -Force -Path $saida | Out-Null

$base = "http://localhost:8095"
$paginas = @("index", "servicos", "sobre", "galeria", "contato")

$edge = @(
  "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Microsoft\Edge\Application\msedge.exe",
  "C:\Program Files\Google\Chrome\Application\chrome.exe",
  "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) | Where-Object { Test-Path $_ } | Select-Object -First 1

if (-not $edge) {
  Write-Host "Navegador Chrome/Edge nao encontrado para captura automatica."
  Write-Host "Abra $base no navegador e capture manualmente em: $saida"
  exit 1
}

foreach ($p in $paginas) {
  # Desktop 1440x900 — viewport direto
  $ud = Join-Path $env:TEMP "edge-cap-d-$p"
  Remove-Item $ud -Recurse -Force -ErrorAction SilentlyContinue
  & $edge --headless=new --disable-gpu --no-sandbox --hide-scrollbars `
    --user-data-dir="$ud" --force-device-scale-factor=1 --window-size=1440,900 `
    --virtual-time-budget=4000 --screenshot="$(Join-Path $saida "$p-desktop.png")" `
    "$base/$p.html" 2>$null | Out-Null
  Start-Sleep -Milliseconds 500

  # Mobile 390x844 — via iframe de 390px
  $ud = Join-Path $env:TEMP "edge-cap-m-$p"
  Remove-Item $ud -Recurse -Force -ErrorAction SilentlyContinue
  & $edge --headless=new --disable-gpu --no-sandbox --hide-scrollbars `
    --user-data-dir="$ud" --force-device-scale-factor=1 --window-size=390,844 `
    --virtual-time-budget=4000 --screenshot="$(Join-Path $saida "$p-mobile.png")" `
    "$base/_mobile-shot.html?p=$p.html" 2>$null | Out-Null
  Start-Sleep -Milliseconds 500

  Write-Host "Capturado: $p"
}

Write-Host "`nCapturas salvas em: $saida"
