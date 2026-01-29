# 🚀 ADIM ADIM DEPLOYMENT REHBERİ

## 📋 HAZIRLIK

### 1. AWS'den Portları Aç

1. **AWS Console:** https://console.aws.amazon.com
2. **EC2 → Instances** → Instance'ını seç
3. **Security** sekmesi → **Security groups** linke tıkla
4. **Edit inbound rules** → Şu portları ekle:
   - **Port 80** → Type: HTTP, Source: 0.0.0.0/0
   - **Port 9080** → Type: Custom TCP, Source: 0.0.0.0/0
5. **Save rules**

✅ Portlar açıldı!

---

## 🖥️ SUNUCUYA BAĞLAN VE DEPLOY ET

### 2. SSH ile Sunucuya Bağlan

```bash
ssh -i "backend/umut-hr.pem" ubuntu@13.63.57.2
```

### 3. Proje Klasörüne Git

```bash
cd ~/anket-quiz/backend
```

### 4. Dosyaları Executable Yap

```bash
chmod +x deploy-backend.sh
chmod +x fix-nginx.sh
```

### 5. Backend'i Deploy Et

```bash
./deploy-backend.sh
```

Bu komut:
- ✅ Eski container'ları durdurur
- ✅ Yeni Docker image build eder
- ✅ Backend'i başlatır (MongoDB Atlas'a bağlanır)
- ✅ API'yi test eder

### 6. Nginx Reverse Proxy Kur

```bash
sudo ./fix-nginx.sh
```

Bu komut:
- ✅ Nginx ayarlarını yapar (Port 80 → 9080)
- ✅ CORS header'larını ekler
- ✅ Nginx'i restart eder

### 7. Test Et

```bash
# Port 9080 test (Direkt Backend)
curl http://localhost:9080/api/quizzes

# Port 80 test (Nginx)
curl http://localhost/api/quizzes
```

Her ikisi de çalışmalı! 🎉

### 8. Sunucudan Çık

```bash
exit
```

---

## 🌐 FRONTEND DEPLOY (Firebase)

### 9. Frontend Build

```powershell
cd d:\Projeler\anket-quiz\frontend
npm run build
```

### 10. Firebase'e Deploy

```powershell
firebase deploy --only hosting
```

✅ Frontend deploy edildi: **https://ismeranket.web.app**

---

## ✅ SON KONTROL

### 11. Test Et

**Backend:**
```powershell
Invoke-WebRequest -Uri "http://13.63.57.2/api/quizzes" -UseBasicParsing
```

**Frontend:**
Tarayıcıda aç: **https://ismeranket.web.app**

---

## 📝 ÖZET

```
AWS Portları Aç (80, 9080)
    ↓
SSH: ssh -i backend/umut-hr.pem ubuntu@13.63.57.2
    ↓
cd ~/anket-quiz/backend
    ↓
chmod +x deploy-backend.sh fix-nginx.sh
    ↓
./deploy-backend.sh
    ↓
sudo ./fix-nginx.sh
    ↓
exit
    ↓
Frontend Build: npm run build
    ↓
Firebase Deploy: firebase deploy --only hosting
    ↓
✅ TAMAM!
```

---

## 🛠️ SORUN GİDERME

### Backend çalışmıyor?
```bash
docker ps
docker logs backend-backend-1
docker-compose down
docker-compose up -d --build
```

### Nginx çalışmıyor?
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

### Frontend backend'e bağlanmıyor?
`frontend/src/config.ts` kontrol et:
```typescript
export const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://13.63.57.2";  // Port 80 (Nginx)
```

---

**Bu adımları sırayla takip et, sorunsuz çalışacak!** 🚀
