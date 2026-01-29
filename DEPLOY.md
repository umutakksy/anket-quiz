# 🚀 Quick Deploy Reference

## Backend Deploy (AWS Sunucuda)

```bash
# 1. Sunucuya bağlan
ssh -i "backend/umut-hr.pem" ubuntu@13.63.57.2

# 2. Backend deploy
cd ~/anket-quiz/backend
chmod +x deploy-backend.sh fix-nginx.sh
./deploy-backend.sh
sudo ./fix-nginx.sh

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

**Detaylı rehber için:** `DEPLOYMENT-GUIDE.md` dosyasına bak!
