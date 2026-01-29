#!/bin/bash
# Anket-Quiz Backend Deployment Script
# IP: 13.63.57.2, Port: 9080

set -e

echo "🎯 Anket-Quiz Backend Deployment Başlıyor..."
echo "📍 Sunucu IP: 13.63.57.2"
echo "🔌 Port: 9080"
echo "⏰ Tarih: $(date)"
echo ""

# Proje dizinine git
cd ~/anket-quiz/backend || cd /home/ubuntu/anket-quiz/backend || cd /opt/anket-quiz/backend

# Git güncellemesi
if [ -d ".git" ]; then
    echo "📥 Git güncelleniyor..."
    git pull origin main
    echo "✅ Git güncellendi"
else
    echo "📥 Ana dizinde Git güncelleniyor..."
    cd ..
    git pull origin main
    cd backend
fi

echo ""

# Docker Compose komutunu belirle
COMPOSE_CMD=""
if docker compose version > /dev/null 2>&1; then
    COMPOSE_CMD="docker compose"
elif command -v docker-compose > /dev/null 2>&1; then
    COMPOSE_CMD="docker-compose"
else
    echo "❌ Docker Compose bulunamadı!"
    exit 1
fi

echo "🐳 Docker Compose: $COMPOSE_CMD"
echo ""

# İzin düzeltmeleri
echo "🔐 İzinler kontrol ediliyor..."
sudo chmod 666 /var/run/docker.sock 2>/dev/null || true

# Eski container'ları durdur
echo "🛑 Mevcut container'lar durduruluyor..."
sudo $COMPOSE_CMD stop || true

# Yeni image'ı build et
echo "🔨 Backend yeniden build ediliyor..."
sudo $COMPOSE_CMD build --no-cache backend

# Container'ları başlat
echo "▶️  Container'lar başlatılıyor..."
sudo $COMPOSE_CMD up -d

# Bekleme süresi
echo "⏳ Container başlatılması bekleniyor..."
sleep 8

# Durum kontrolü
echo ""
echo "📊 Container Durumu:"
sudo $COMPOSE_CMD ps

echo ""
echo "📝 Backend Son Loglar:"
sudo $COMPOSE_CMD logs --tail=30 backend

echo ""
echo "📝 MongoDB Son Loglar:"
sudo $COMPOSE_CMD logs --tail=10 mongodb

echo ""
echo "✅ Anket-Quiz Backend Deployment Tamamlandı!"
echo ""
echo "🔍 Test için:"
echo "   curl http://localhost:9080/api/surveys"
echo "   curl http://13.63.57.2:9080/api/surveys"
echo ""
echo "📋 Logları görmek için:"
echo "   cd ~/anket-quiz/backend"
echo "   docker compose logs -f backend"
