# Script para iniciar servidor e cliente em terminais separados
# Útil quando npm run dev não funciona

Write-Host "🚀 Iniciando sistema em terminais separados..." -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
try {
    $nodeVersion = node --version 2>$null
    if (-not $nodeVersion) {
        throw "Node.js não encontrado"
    }
} catch {
    Write-Host "❌ Node.js não está instalado!" -ForegroundColor Red
    exit 1
}

$rootPath = Get-Location

# Iniciar servidor em nova janela
Write-Host "📡 Abrindo terminal para o servidor..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$rootPath\server'; Write-Host '🚀 Servidor Backend' -ForegroundColor Cyan; Write-Host 'Aguardando...' -ForegroundColor Yellow; npm run dev"

Start-Sleep -Seconds 3

# Iniciar cliente em nova janela
Write-Host "💻 Abrindo terminal para o cliente..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$rootPath\client'; Write-Host '🚀 Cliente Frontend' -ForegroundColor Magenta; Write-Host 'Aguardando...' -ForegroundColor Yellow; npm start"

Write-Host ""
Write-Host "✅ Dois terminais foram abertos:" -ForegroundColor Green
Write-Host "   - Um para o servidor (porta 5000)" -ForegroundColor Cyan
Write-Host "   - Um para o cliente (porta 3000)" -ForegroundColor Magenta
Write-Host ""
Write-Host "Acesse: http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Feche os terminais para parar os servidores." -ForegroundColor Yellow

