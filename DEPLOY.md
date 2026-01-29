# 🚀 Quick Deploy Reference

## İlk Kurulum (Bir kere yapılır)

### Nginx ve SSL Kurulumu
```bash
# 1. Sunucuya bağlan
ssh -i "backend/umut-hr.pem" ubuntu@13.63.57.2

# 2. Nginx ve SSL kur
cd ~/anket-quiz/backend
chmod +x setup-nginx-ssl.sh
sudo ./setup-nginx-ssl.sh

# 3. Çık
exit
```

**NOT**: 
- DNS kaydı yapılandırılmalı: `api.seedhr.com.tr` → `13.63.57.2`
- AWS Security Group'ta port 443 (HTTPS) açık olmalı

## Backend Deploy (AWS Sunucuda)

```bash
# 1. Sunucuya bağlan
ssh -i "backend/umut-hr.pem" ubuntu@13.63.57.2

# 2. Backend deploy
cd ~/anket-quiz/backend
chmod +x deploy-backend.sh
./deploy-backend.sh

# 3. Çık
exit
```

## Frontend Deploy (Local)

```powershell
# 1. Build
cd frontend
npm run build

# 2. Deploy
firebase deploy --only hosting
```

---

## URL'ler

- **Frontend**: https://anket.seedhr.com.tr (Firebase)
- **Backend**: https://api.seedhr.com.tr (AWS EC2)
- **Alt Frontend**: https://ismeranket.web.app

---

**Detaylı rehber için:** `backend/NGINX_SETUP.md` dosyasına bak!

