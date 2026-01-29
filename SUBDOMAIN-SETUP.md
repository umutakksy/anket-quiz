# 🌐 SUBDOMAIN KURULUMU: anket.seedhr.com.tr

## 📋 ADIMLAR

### 1️⃣ DNS Ayarları (Domain Panel - seedhr.com.tr)

**A Record ekle:**
- **Name/Host:** `anket`
- **Type:** A
- **Value/Points to:** `13.63.57.2`
- **TTL:** 300 (veya Auto)

**Sonuç:** `anket.seedhr.com.tr` → `13.63.57.2` yönlendirecek

⏰ **DNS Yayılması:** 5-30 dakika sürebilir

---

### 2️⃣ Sunucuda Backend ve Nginx Kurulumu

```bash
ssh -i "backend/umut-hr.pem" ubuntu@13.63.57.2

# Backend klasöründe
cd ~/anket-quiz/backend

# Backend varsa restart, yoksa deploy et
docker-compose down
docker-compose up -d --build

# Nginx config için anket subdomain ekle
sudo tee /etc/nginx/sites-available/anket-seedhr > /dev/null <<'EOF'
server {
    listen 80;
    server_name anket.seedhr.com.tr;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name anket.seedhr.com.tr;

    ssl_certificate /etc/letsencrypt/live/anket.seedhr.com.tr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/anket.seedhr.com.tr/privkey.pem;

    location /api/ {
        proxy_pass http://localhost:9080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET,POST,PUT,DELETE,OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' '*' always;
    }
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/anket-seedhr /etc/nginx/sites-enabled/

# SSL sertifikası al (DNS yayıldıktan sonra!)
sudo certbot --nginx -d anket.seedhr.com.tr

# Nginx restart
sudo nginx -t && sudo systemctl restart nginx

# Test
curl https://anket.seedhr.com.tr/api/quizzes

exit
```

---

### 3️⃣ Frontend Build ve Deploy

```powershell
cd d:\Projeler\anket-quiz\frontend

# Build
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

---

## ✅ SONUÇ

**Backend:**
- `https://anket.seedhr.com.tr/api/quizzes` → Port 9080

**Frontend:**
- `https://ismeranket.web.app`

**MongoDB:**
- SeedHR: `hr_database` (port 8080)
- Anket: `survey_db` (port 9080)

---

## 🗄️ VERİTABANLARI

Aynı sunucuda **2 farklı MongoDB** var:
1. **MongoDB Atlas** (Cloud) → Her iki proje de ona bağlanıyor
2. Her projede farklı **database name** kullanılıyor

**SeedHR:**
- MongoDB URI: `mongodb+srv://...`
- Database: `hr_database`

**Anket:**
- MongoDB URI: `mongodb+srv://...` (aynı cluster)
- Database: `survey_db`

---

## 📝 SIRA

1. ✅ DNS A kaydı ekle: `anket` → `13.63.57.2`
2. ⏰ 10-30 dakika bekle (DNS yayılması)
3. ✅ Sunucuda yukarıdaki komutları çalıştır
4. ✅ Frontend deploy et
5. ✅ Test: `https://ismeranket.web.app`

**Her şey hazır, DNS yayılınca çalışacak!** 🚀
