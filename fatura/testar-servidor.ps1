# Script para testar se o servidor está funcionando

Write-Host "🔍 Testando servidor backend..." -ForegroundColor Cyan

# Verificar se a porta 5000 está em uso
$port5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if ($port5000) {
    Write-Host "✅ Porta 5000 está em uso (servidor provavelmente rodando)" -ForegroundColor Green
} else {
    Write-Host "❌ Porta 5000 não está em uso (servidor não está rodando)" -ForegroundColor Red
}

# Verificar se a porta 3000 está em uso
$port3000 = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($port3000) {
    Write-Host "✅ Porta 3000 está em uso (frontend provavelmente rodando)" -ForegroundColor Green
} else {
    Write-Host "❌ Porta 3000 não está em uso (frontend não está rodando)" -ForegroundColor Red
}

Write-Host "`n📝 Para iniciar manualmente:" -ForegroundColor Yellow
Write-Host "   Terminal 1: cd server && npm run dev" -ForegroundColor White
Write-Host "   Terminal 2: cd client && npm start" -ForegroundColor White

