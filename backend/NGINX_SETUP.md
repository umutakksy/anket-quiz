# Anket-Quiz Backend Nginx Kurulumu

## Kurulum Adımları

### 1. Nginx Kur
```bash
sudo apt update
sudo apt install nginx -y
```

### 2. Config Dosyasını Yerleştir
```bash
sudo cp ~/anket-quiz/backend/nginx.conf /etc/nginx/sites-available/anket-api
sudo ln -s /etc/nginx/sites-available/anket-api /etc/nginx/sites-enabled/
```

### 3. Varsayılan Siteyi Devre Dışı Bırak (Opsiyonel)
```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 4. Test ve Başlat
```bash
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### 5. AWS Security Group Kontrolü
EC2 Console → Security Groups → Inbound Rules:
- HTTP (TCP 80) → 0.0.0.0/0 AÇIK olmalı

### 6. Test Et
```bash
# EC2'da:
curl http://localhost/api/quizzes

# Dışarıdan:
curl http://13.60.37.212/api/quizzes
```

## Sorun Giderme

### Nginx Durumu
```bash
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Port Kontrolü
```bash
sudo netstat -tlnp | grep :80
```

### Docker Backend Kontrolü
```bash
docker ps
curl http://localhost:9080/api/quizzes
```
