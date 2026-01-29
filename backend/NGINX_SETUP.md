# Anket-Quiz Backend Nginx Kurulumu

## Hızlı Kurulum (Önerilen)

### Otomatik SSL Kurulum Script
```bash
cd ~/anket-quiz/backend
chmod +x setup-nginx-ssl.sh
sudo ./setup-nginx-ssl.sh
```

Bu script:
- Nginx'i kurar
- Certbot (Let's Encrypt) kurar
- SSL sertifikası alır
- api.seedhr.com.tr için HTTPS yapılandırır
- Otomatik sertifika yenilemeyi ayarlar

## Manuel Kurulum

### Ön Gereksinim: DNS Yapılandırması
**ÖNEMLİ**: SSL sertifikası almadan önce DNS kaydı yapılandırılmalı!

1. Domain sağlayıcınızda (GoDaddy, Namecheap, vb.) A kaydı ekleyin:
   - Host: `api`
   - Type: `A`
   - Value: `13.60.37.212` (AWS EC2 IP'niz)
   - TTL: `600` (10 dakika)

2. DNS propagation kontrolü:
```bash
nslookup api.seedhr.com.tr
# veya
dig api.seedhr.com.tr
```

### 1. Nginx Kur
```bash
sudo apt update
sudo apt install nginx -y
```

### 2. Certbot Kur (SSL için)
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 3. Geçici HTTP Config (SSL öncesi)
```bash
sudo nano /etc/nginx/sites-available/anket-api-temp
```

İçerik:
```nginx
server {
    listen 80;
    server_name api.seedhr.com.tr;

    location / {
        proxy_pass http://localhost:9080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Aktifleştir:
```bash
sudo ln -s /etc/nginx/sites-available/anket-api-temp /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Opsiyonel
sudo nginx -t
sudo systemctl restart nginx
```

### 4. SSL Sertifikası Al
```bash
sudo certbot --nginx -d api.seedhr.com.tr
```

Sorular:
- Email: `umutakksy@gmail.com` (veya sizin email'iniz)
- Terms: `Y` (Evet)
- Redirect HTTP to HTTPS: `2` (Evet, yönlendir)

### 5. Final Config Güncelle
```bash
sudo cp ~/anket-quiz/backend/nginx.conf /etc/nginx/sites-available/anket-api
sudo ln -sf /etc/nginx/sites-available/anket-api /etc/nginx/sites-enabled/anket-api
sudo rm /etc/nginx/sites-enabled/anket-api-temp  # Geçici config'i sil
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 6. AWS Security Group Kontrolü
EC2 Console → Security Groups → Inbound Rules:
- HTTP (TCP 80) → 0.0.0.0/0 ✓
- HTTPS (TCP 443) → 0.0.0.0/0 ✓ (YENİ - EKLE!)

### 7. Test Et
```bash
# HTTP → HTTPS redirect testi
curl -I http://api.seedhr.com.tr

# HTTPS testi
curl https://api.seedhr.com.tr/api/quizzes

# SSL sertifika kontrolü
echo | openssl s_client -connect api.seedhr.com.tr:443 -servername api.seedhr.com.tr 2>/dev/null | openssl x509 -noout -dates
```

## SSL Sertifika Yenileme

Certbot otomatik olarak sertifikayı yeniler (cron job). Test için:
```bash
sudo certbot renew --dry-run
```

Manuel yenileme:
```bash
sudo certbot renew
sudo systemctl reload nginx
```

## Sorun Giderme

### Nginx Durumu
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### SSL Hataları
```bash
# Sertifika dosyalarını kontrol et
sudo ls -la /etc/letsencrypt/live/api.seedhr.com.tr/

# Certbot logları
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

### Port Kontrolü
```bash
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

### Docker Backend Kontrolü
```bash
docker ps
curl http://localhost:9080/api/quizzes
```

### CORS Hataları
CORS ayarları nginx.conf'ta yapılandırılmış. 
İzin verilen origin'ler:
- https://anket.seedhr.com.tr
- https://ismeranket.web.app

Yeni origin eklemek için nginx.conf'taki regex'i güncelleyin:
```nginx
if ($http_origin ~* "^https://(anket\.seedhr\.com\.tr|ismeranket\.web\.app|yeni-domain\.com)$") {
    set $cors_origin $http_origin;
}
```

## Backend URL'ler

- **Production**: https://api.seedhr.com.tr
- **Frontend (Firebase)**: https://anket.seedhr.com.tr veya https://ismeranket.web.app
- **Local Development**: http://localhost:8080

