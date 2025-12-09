# Script PowerShell para iniciar o sistema
# Alternativa ao npm run dev caso haja problemas

Write-Host "🚀 Iniciando sistema de controle de fatura..." -ForegroundColor Cyan
Write-Host ""

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version 2>$null
    if (-not $nodeVersion) {
        throw "Node.js não encontrado"
    }
} catch {
    Write-Host "❌ Node.js não está instalado!" -ForegroundColor Red
    Write-Host "   Instale em: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar se as dependências estão instaladas
if (-not (Test-Path "server/node_modules")) {
    Write-Host "📦 Instalando dependências do servidor..." -ForegroundColor Yellow
    Set-Location server
    npm install
    Set-Location ..
}

if (-not (Test-Path "client/node_modules")) {
    Write-Host "📦 Instalando dependências do cliente..." -ForegroundColor Yellow
    Set-Location client
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "✅ Iniciando servidor e cliente..." -ForegroundColor Green
Write-Host "   Backend: http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar ambos os servidores" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor em background
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    Set-Location server
    npm run dev
}

# Aguardar um pouco para o servidor iniciar
Start-Sleep -Seconds 2

# Iniciar cliente (foreground)
Set-Location client
npm start

# Quando o cliente parar, parar o servidor também
Stop-Job $serverJob
Remove-Job $serverJob

