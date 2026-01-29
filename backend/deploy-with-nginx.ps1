# ====================================
# Full Deployment: Backend + Nginx
# ====================================

$ErrorActionPreference = "Stop"

$AWS_IP = "13.63.57.2"
$PEM_FILE = "backend\umut-hr.pem"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Full Deployment Başlıyor..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Tüm dosyaları yükle
Write-Host "1️⃣  Dosyalar yükleniyor..." -ForegroundColor Yellow
scp -i $PEM_FILE -r backend/src backend/pom.xml backend/Dockerfile backend/docker-compose.yml backend/deploy-backend.sh backend/fix-nginx.sh ubuntu@${AWS_IP}:~/anket-quiz/backend/

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dosya yükleme hatası!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dosyalar yüklendi" -ForegroundColor Green

# 2. Backend deploy
Write-Host ""
Write-Host "2️⃣  Backend deploy ediliyor..." -ForegroundColor Yellow
ssh -i $PEM_FILE ubuntu@${AWS_IP} "cd ~/anket-quiz/backend && chmod +x deploy-backend.sh && ./deploy-backend.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend deployment hatası!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Backend çalışıyor" -ForegroundColor Green

# 3. Nginx ayarla
Write-Host ""
Write-Host "3️⃣  Nginx yapılandırılıyor..." -ForegroundColor Yellow
ssh -i $PEM_FILE ubuntu@${AWS_IP} "cd ~/anket-quiz/backend && chmod +x fix-nginx.sh && sudo ./fix-nginx.sh"

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Nginx ayarlanamadı (devam ediliyor)" -ForegroundColor Yellow
}

# 4. Test
Write-Host ""
Write-Host "4️⃣  API test ediliyor..." -ForegroundColor Yellow

Write-Host ""
Write-Host "   Port 9080 (Direkt Backend):" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://$AWS_IP:9080/api/quizzes" -UseBasicParsing -Method Get -TimeoutSec 5
    Write-Host "   ✅ Port 9080 çalışıyor" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Port 9080 erişilemiyor" -ForegroundColor Red
}

Write-Host ""
Write-Host "   Port 80 (Nginx Reverse Proxy):" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "http://$AWS_IP/api/quizzes" -UseBasicParsing -Method Get -TimeoutSec 5
    Write-Host "   ✅ Port 80 çalışıyor (Nginx OK)" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Port 80 çalışmıyor (Nginx sorunu olabilir)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Deployment Tamamlandı!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📍 API Endpoint'leri:" -ForegroundColor Cyan
Write-Host "   Direkt:      http://$AWS_IP:9080/api/quizzes" -ForegroundColor White
Write-Host "   Nginx:       http://$AWS_IP/api/quizzes" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  ÖNEMLİ: AWS Security Group'ta aşağıdaki portların açık olması gerekir:" -ForegroundColor Yellow
Write-Host "   - Port 80  (HTTP - Nginx)" -ForegroundColor White
Write-Host "   - Port 9080 (Backend - Opsiyonel)" -ForegroundColor White
Write-Host ""
