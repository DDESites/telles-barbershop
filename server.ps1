# Servidor local da Telles Barbershop — http://localhost:8095
$raiz = $PSScriptRoot
$porta = 8095
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$porta/")
$listener.Start()
Write-Host "Telles Barbershop no ar em http://localhost:$porta (Ctrl+C para parar)"
Write-Host "Se a porta estiver ocupada, edite a variavel `$porta no topo do arquivo."

$tipos = @{
  ".html" = "text/html; charset=utf-8"
  ".css"  = "text/css; charset=utf-8"
  ".js"   = "application/javascript; charset=utf-8"
  ".svg"  = "image/svg+xml"
  ".png"  = "image/png"
  ".jpg"  = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".ico"  = "image/x-icon"
  ".md"   = "text/plain; charset=utf-8"
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $caminho = $context.Request.Url.LocalPath
  if ($caminho -eq "/") { $caminho = "/index.html" }
  $arquivo = Join-Path $raiz ($caminho.TrimStart("/").Replace("/", "\"))
  if (Test-Path $arquivo -PathType Leaf) {
    $bytes = [System.IO.File]::ReadAllBytes($arquivo)
    $ext = [System.IO.Path]::GetExtension($arquivo).ToLower()
    $context.Response.ContentType = if ($tipos.ContainsKey($ext)) { $tipos[$ext] } else { "application/octet-stream" }
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  } else {
    $context.Response.StatusCode = 404
    $msg = [System.Text.Encoding]::UTF8.GetBytes("404 - arquivo nao encontrado")
    $context.Response.OutputStream.Write($msg, 0, $msg.Length)
  }
  $context.Response.Close()
}
