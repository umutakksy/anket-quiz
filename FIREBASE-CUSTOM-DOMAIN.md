# 🔥 Firebase Custom Domain Kurulumu

## ADIM ADIM:

### 1️⃣ Firebase Console'da Domain Ekle

1. **Firebase Console'a git:**
   https://console.firebase.google.com/project/ismeranket/hosting/sites

2. **Add custom domain** butonuna tıkla

3. Domain gir: **anket.seedhr.com.tr**

4. **Continue** tıkla

---

### 2️⃣ DNS Kayıtlarını Ekle

Firebase sana 2 tür DNS kaydı verecek:

#### A) TXT Kaydı (Doğrulama için)
```
Name/Host: anket
Type: TXT
Value: firebase=ismeranket-XXXXX (Firebase'in vereceği kod)
TTL: Auto
```

#### B) A Kayıtları (Hosting için)
```
Name/Host: anket
Type: A
Value: 151.101.1.195
TTL: Auto

Name/Host: anket
Type: A
Value: 151.101.65.195
TTL: Auto
```

**ÖNEMLİ:** Domain panelinde (seedhr.com.tr ayarları):
- Eğer `anket` için **A kaydı zaten varsa** (13.63.57.2), **SİL!**
- Firebase'in verdiği A kayıtlarını ekle

---

### 3️⃣ SSL (Otomatik)

Firebase kurulumdan sonra **otomatik SSL sertifikası** verir (Let's Encrypt).
SSL aktif olana kadar **15-60 dakika** sürebilir.

---

### 4️⃣ Backend Sunucusu Gereksiz Artık

Firebase doğrudan **anket.seedhr.com.tr**'yi host edecek.
Backend API için **başka bir subdomain** gerekli:

**ÖNERİ:**
- **anket.seedhr.com.tr** → Firebase Frontend
- **api.seedhr.com.tr** → Backend (port 9080)

---

## 🔄 ALTERNATF: Backend için Ayrı Subdomain

### Frontend Config Güncelle:
```typescript
export const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "https://api.seedhr.com.tr";
```

### DNS:
```
A Record:
Name: api
Value: 13.63.57.2
```

### Sunucuda Nginx:
```bash
sudo tee /etc/nginx/sites-available/api-seedhr > /dev/null <<'EOF'
server {
    listen 80;
    server_name api.seedhr.com.tr;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name api.seedhr.com.tr;
    
    ssl_certificate /etc/letsencrypt/live/api.seedhr.com.tr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.seedhr.com.tr/privkey.pem;
    
    location / {
        proxy_pass http://localhost:9080;
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET,POST,PUT,DELETE,OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' '*' always;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/api-seedhr /etc/nginx/sites-enabled/
sudo certbot --nginx -d api.seedhr.com.tr
```

---

## ✅ SONUÇ:

**Frontend:**
- https://anket.seedhr.com.tr (Firebase Hosting)

**Backend:**
- https://api.seedhr.com.tr (AWS EC2 - Port 9080)

**SeedHR:**
- https://seedhr.com.tr (Port 8080)

---

**Şimdi Firebase Console'da domain ekle, DNS kayıtlarını güncelle!**
