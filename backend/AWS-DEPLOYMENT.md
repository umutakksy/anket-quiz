# AWS EC2 Backend Deployment Guide

## 📋 Ön Gereksinimler

- AWS EC2 Instance (Ubuntu 20.04 veya üzeri)
- Security Group ayarları:
  - Port 80 (HTTP) - **0.0.0.0/0** açık
  - Port 443 (HTTPS) - **0.0.0.0/0** açık (gelecek için)
  - Port 22 (SSH) - Kendi IP'niz
- PEM key dosyası (`umut-hr.pem`)

## 🚀 Kurulum Adımları

### 1. İlk Kurulum (Sadece Bir Kez)

```bash
# Local bilgisayarınızdan sunucuya bağlanın
ssh -i "backend\umut-hr.pem" ubuntu@13.60.37.212

# Proje klasörünü oluşturun
mkdir -p ~/anket-quiz/backend
exit

# Backend dosyalarını sunucuya yükleyin
scp -i "backend\umut-hr.pem" -r backend/* ubuntu@13.60.37.212:~/anket-quiz/backend/

# Sunucuya tekrar bağlanın
ssh -i "backend\umut-hr.pem" ubuntu@13.60.37.212

# Setup scriptini çalıştırın (Docker, Nginx vb. kurulumu)
cd ~/anket-quiz/backend
chmod +x aws-setup.sh
sudo ./aws-setup.sh

# Çıkış yapın ve tekrar girin (docker group için)
exit
ssh -i "backend\umut-hr.pem" ubuntu@13.60.37.212
```

### 2. Backend'i Başlatma

```bash
# Sunucuda backend dizinine gidin
cd ~/anket-quiz/backend

# Deploy scriptini çalıştırın
chmod +x deploy-backend.sh
./deploy-backend.sh
```

### 3. Kontrol ve Test

```bash
# Container'ları kontrol edin
docker ps

# Backend loglarını görüntüleyin
docker logs backend-backend-1

# API'yi test edin
curl http://localhost:9080/api/quizzes

# Dışarıdan test edin (local bilgisayarınızdan)
curl http://13.60.37.212/api/quizzes
```

## 🔄 Güncelleme (Her Kod Değişikliğinde)

### Local'den Yapılacaklar:

```powershell
# 1. Backend kodlarını sunucuya yükleyin
scp -i "backend\umut-hr.pem" -r backend/src ubuntu@13.60.37.212:~/anket-quiz/backend/
scp -i "backend\umut-hr.pem" backend/pom.xml ubuntu@13.60.37.212:~/anket-quiz/backend/
scp -i "backend\umut-hr.pem" backend/Dockerfile ubuntu@13.60.37.212:~/anket-quiz/backend/
scp -i "backend\umut-hr.pem" backend/docker-compose.yml ubuntu@13.60.37.212:~/anket-quiz/backend/

# 2. Backend'i yeniden deploy edin
ssh -i "backend\umut-hr.pem" ubuntu@13.60.37.212 "cd ~/anket-quiz/backend && docker-compose down && docker-compose up -d --build"
```

### Veya Tek Komutla:

```powershell
# Tüm backend dosyalarını yükle ve yeniden başlat
scp -i "backend\umut-hr.pem" -r backend/* ubuntu@13.60.37.212:~/anket-quiz/backend/ && ssh -i "backend\umut-hr.pem" ubuntu@13.60.37.212 "cd ~/anket-quiz/backend && ./deploy-backend.sh"
```

## 🌐 Frontend (Firebase Hosting)

### Frontend'i Deploy Etme:

```powershell
cd frontend

# Build
npm run build

# Deploy
firebase deploy --only hosting
```

**Not:** Frontend şu anda `config.ts` dosyasında boş API_BASE_URL kullanıyor, bu Firebase rewrites kullanır. Ancak mixed content hatası nedeniyle çalışmıyor.

### Mixed Content Sorunu Çözümü:

Frontend'in doğrudan HTTP backend'e erişmesi için `frontend/src/config.ts` dosyasını güncelleyin:

```typescript
export const API_BASE_URL = 'http://13.60.37.212/api';
```

**Uyarı:** Bu çözüm sadece test için uygundur. Production için HTTPS gerekir.

## 🔐 Production İçin HTTPS Kurulumu

### 1. Domain Ayarları
1. Bir domain adı alın (örn: `api.example.com`)
2. Domain'in A kaydını `13.60.37.212` IP'sine yönlendirin

### 2. SSL Sertifikası Kurulumu

```bash
# Sunucuya bağlanın
ssh -i "backend\umut-hr.pem" ubuntu@13.60.37.212

# Certbot kurulumu (zaten aws-setup.sh'de yapıldı)
sudo apt install -y certbot python3-certbot-nginx

# SSL sertifikası alın
sudo certbot --nginx -d api.example.com

# Otomatik yenileme testGi
sudo certbot renew --dry-run
```

### 3. Frontend'i HTTPS Backend için Güncelleme

```typescript
// frontend/src/config.ts
export const API_BASE_URL = 'https://api.example.com/api';
```

## 🛠️ Yararlı Komutlar

### Backend Yönetimi
```bash
# Container'ları başlat
docker-compose up -d

# Container'ları durdur
docker-compose down

# Logları görüntüle
docker logs -f backend-backend-1

# Container'a bash ile gir
docker exec -it backend-backend-1 bash

# Tüm container'ları temizle
docker-compose down -v
docker system prune -a
```

### Nginx Yönetimi
```bash
# Nginx durumunu kontrol et
sudo systemctl status nginx

# Nginx'i yeniden başlat
sudo systemctl restart nginx

# Nginx konfigürasyonunu test et
sudo nginx -t

# Nginx loglarını görüntüle
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Sistem Monitoring
```bash
# Disk kullanımı
df -h

# Memory kullanımı
free -h

# CPU kullanımı
top

# Docker disk kullanımı
docker system df
```

## ❌ Sorun Giderme

### Backend çalışmıyor
```bash
# Logları kontrol edin
docker logs backend-backend-1

# Container'ları yeniden başlatın
docker-compose restart

# Tamamen yeniden build edin
docker-compose down
docker-compose up -d --build
```

### Nginx 502 Bad Gateway
```bash
# Backend'in çalıştığından emin olun
docker ps
curl http://localhost:9080/api/quizzes

# Nginx loglarını kontrol edin
sudo tail -f /var/log/nginx/error.log
```

### MongoDB bağlantı hatası
```bash
# MongoDB container'ını kontrol edin
docker logs backend-mongodb-1

# Yeniden başlatın
docker-compose restart mongodb
```

## 📞 API Endpoint'leri

- **Base URL:** `http://13.60.37.212/api`
- **Quizzes:** `GET /api/quizzes`
- **Create Quiz:** `POST /api/quizzes`
- **Get Quiz:** `GET /api/quizzes/{id}`
- **Update Quiz:** `PUT /api/quizzes/{id}`
- **Delete Quiz:** `DELETE /api/quizzes/{id}`
- **Responses:** `GET /api/quizzes/{id}/responses`

## 📱 Frontend URL

- **URL:** https://ismeranket.web.app
- **Firebase Console:** https://console.firebase.google.com/project/ismeranket

---

**Not:** Production kullanımı için mutlaka HTTPS kurulumu yapın!
