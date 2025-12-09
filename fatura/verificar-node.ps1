# Script para verificar se Node.js está instalado

Write-Host "🔍 Verificando instalação do Node.js..." -ForegroundColor Cyan

# Verificar Node.js
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js não encontrado"
    }
} catch {
    Write-Host "❌ Node.js NÃO está instalado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 Para instalar:" -ForegroundColor Yellow
    Write-Host "   1. Acesse: https://nodejs.org/" -ForegroundColor White
    Write-Host "   2. Baixe a versão LTS (recomendada)" -ForegroundColor White
    Write-Host "   3. Execute o instalador" -ForegroundColor White
    Write-Host "   4. Feche e abra novamente este terminal" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Verificar npm
try {
    $npmVersion = npm --version 2>$null
    if ($npmVersion) {
        Write-Host "✅ npm instalado: v$npmVersion" -ForegroundColor Green
    } else {
        throw "npm não encontrado"
    }
} catch {
    Write-Host "❌ npm NÃO está instalado!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Tudo pronto! Você pode executar:" -ForegroundColor Green
Write-Host "   npm run install-all  (para instalar dependências)" -ForegroundColor White
Write-Host "   npm run dev          (para iniciar o sistema)" -ForegroundColor White
Write-Host ""

