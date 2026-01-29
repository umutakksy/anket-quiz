# 🚀 Deployment Rehberi

## Tek Komutla Deploy

### Backend Deploy (MongoDB Atlas ile)

```powershell
cd d:\Projeler\anket-quiz
.\backend\deploy-with-nginx.ps1
```

Bu script:
- ✅ Backend dosyalarını AWS'ye yükler
- ✅ Docker ile backend'i başlatır (MongoDB Atlas kullanır)
- ✅ Nginx reverse proxy ayarlarını yapar
- ✅ Her şeyi test eder

---

## ⚠️ AWS Security Group Ayarları

**Şu portların AÇIK olması gerekir:**

| Port | Protokol | Kaynak | Açıklama |
|------|----------|--------|----------|
| 80 | TCP | 0.0.0.0/0 | HTTP (Nginx) |
| 22 | TCP | Senin IP'n | SSH |
| 9080 | TCP | 0.0.0.0/0 | Backend (opsiyonel) |

### Kontrol Et:
1. AWS Console → EC2 → Instances
2. Instance seç → Security → Security Groups
3. "Inbound rules" sekmesine bak
4. Yukarıdaki portlar yoksa ekle

---

## 🔍 Test

### 1. Backend Testi
```powershell
# Port 9080 (Direkt)
Invoke-WebRequest -Uri "http://13.63.57.2:9080/api/quizzes" -UseBasicParsing

# Port 80 (Nginx)
Invoke-WebRequest -Uri "http://13.63.57.2/api/quizzes" -UseBasicParsing
```

### 2. Frontend Config

**Config dosyası:** `frontend/src/config.ts`

```typescript
export const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "http://13.63.57.2:9080";  // veya :80 Nginx kullanıyorsan
```

### 3. Frontend Deploy
```powershell
cd frontend
npm run build
firebase deploy --only hosting
```

---

## 🛠️ Sorun Giderme

### Backend çalışmıyor
```powershell
# Logları kontrol et (manuel SSH ile)
ssh -i "backend\umut-hr.pem" ubuntu@13.63.57.2
docker logs -f backend-backend-1
```

### Nginx çalışmıyor
```powershell
# Manual olarak nginx'i düzelt
ssh -i "backend\umut-hr.pem" ubuntu@13.63.57.2
cd ~/anket-quiz/backend
sudo ./fix-nginx.sh
```

### Port 9080 kapalı
AWS Console'da Security Group ayarlarını kontrol et ve port 9080'i ekle

---

## 📱 Frontend URL
- **Production:** https://ismeranket.web.app
- **Firebase Console:** https://console.firebase.google.com/project/ismeranket

## 🖥️ Backend URL
- **Direkt:** http://13.63.57.2:9080/api/quizzes
- **Nginx:** http://13.63.57.2/api/quizzes

---

## ✅ Deployment Checklist

- [ ] AWS Security Group'ta port 80 ve 9080 açık
- [ ] MongoDB Atlas IP whitelist'te 0.0.0.0/0 var
- [ ] Backend deploy edildi: `.\backend\deploy-with-nginx.ps1`
- [ ] Backend test edildi: `curl http://13.63.57.2:9080/api/quizzes`
- [ ] Frontend config güncellendi
- [ ] Frontend build edildi: `npm run build`
- [ ] Frontend deploy edildi: `firebase deploy --only hosting`
- [ ] Frontend test edildi: https://ismeranket.web.app

---

**Herhangi bir sorun olursa:**
1. Backend loglarını kontrol et
2. AWS Security Group portlarını kontrol et
3. MongoDB Atlas bağlantısını kontrol et
