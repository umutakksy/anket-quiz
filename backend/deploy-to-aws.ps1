# ====================================
# AWS Backend Deployment Script
# Tek komutla tüm backend'i deploy eder
# ====================================

$ErrorActionPreference = "Stop"

$AWS_IP = "13.63.57.2"
$PEM_FILE = "backend\umut-hr.pem"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "AWS Backend Deployment Başlıyor..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Backend dosyalarını sunucuya yükle
Write-Host "1️⃣  Backend dosyaları yükleniyor..." -ForegroundColor Yellow
scp -i $PEM_FILE -r backend/src backend/pom.xml backend/Dockerfile backend/docker-compose.yml backend/deploy-backend.sh ubuntu@${AWS_IP}:~/anket-quiz/backend/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dosya yükleme hatası!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Dosyalar yüklendi" -ForegroundColor Green
Write-Host ""

# 2. Backend'i yeniden başlat
Write-Host "2️⃣  Backend deploy ediliyor..." -ForegroundColor Yellow
ssh -i $PEM_FILE ubuntu@${AWS_IP} "cd ~/anket-quiz/backend && chmod +x deploy-backend.sh && ./deploy-backend.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Deployment hatası!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Deployment Tamamlandı!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 API URL: http://$AWS_IP:9080/api/quizzes" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Test et:" -ForegroundColor Yellow
Write-Host "   Invoke-WebRequest -Uri 'http://$AWS_IP:9080/api/quizzes' -UseBasicParsing" -ForegroundColor White
Write-Host ""
