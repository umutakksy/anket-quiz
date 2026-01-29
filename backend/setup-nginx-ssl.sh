#!/bin/bash

# Anket-Quiz Backend - Nginx ve SSL Kurulum Scripti
# api.seedhr.com.tr için yapılandırma

echo "========================================="
echo "Anket-Quiz Backend Nginx SSL Kurulumu"
echo "========================================="

# Renklendirme
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. Nginx Kurulumu
echo -e "${YELLOW}[1/7] Nginx kuruluyor...${NC}"
sudo apt update
sudo apt install nginx -y

# 2. Certbot Kurulumu (Let's Encrypt için)
echo -e "${YELLOW}[2/7] Certbot kuruluyor...${NC}"
sudo apt install certbot python3-certbot-nginx -y

# 3. Nginx Config Yedekleme
echo -e "${YELLOW}[3/7] Mevcut config yedekleniyor...${NC}"
sudo mkdir -p /etc/nginx/backups
sudo cp -r /etc/nginx/sites-available /etc/nginx/backups/sites-available-$(date +%Y%m%d-%H%M%S) 2>/dev/null || true

# 4. Geçici HTTP Config (SSL öncesi)
echo -e "${YELLOW}[4/7] Geçici HTTP config oluşturuluyor...${NC}"
sudo tee /etc/nginx/sites-available/anket-api-temp > /dev/null <<EOF
server {
    listen 80;
    server_name api.seedhr.com.tr;

    location / {
        proxy_pass http://localhost:9080;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# 5. Config Aktifleştirme
echo -e "${YELLOW}[5/7] Config aktifleştiriliyor...${NC}"
sudo ln -sf /etc/nginx/sites-available/anket-api-temp /etc/nginx/sites-enabled/anket-api-temp
sudo rm -f /etc/nginx/sites-enabled/default

# Test ve Restart
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    echo -e "${GREEN}✓ Nginx başarıyla yapılandırıldı${NC}"
else
    echo -e "${RED}✗ Nginx config hatası! Düzeltip tekrar deneyin.${NC}"
    exit 1
fi

# 6. SSL Sertifika Al
echo -e "${YELLOW}[6/7] SSL sertifikası alınıyor...${NC}"
echo -e "${YELLOW}NOT: DNS'in doğru yapılandırıldığından emin olun!${NC}"
echo -e "${YELLOW}api.seedhr.com.tr -> $(curl -s ifconfig.me) olmalı${NC}"
read -p "DNS kaydı yapılandırıldı mı? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    sudo certbot --nginx -d api.seedhr.com.tr --non-interactive --agree-tos --email umutakksy@gmail.com --redirect
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ SSL sertifikası alındı${NC}"
    else
        echo -e "${RED}✗ SSL sertifika alma hatası!${NC}"
        echo -e "${YELLOW}Manuel olarak deneyin: sudo certbot --nginx -d api.seedhr.com.tr${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}DNS yapılandırmasını tamamlayın ve şu komutu çalıştırın:${NC}"
    echo -e "${YELLOW}sudo certbot --nginx -d api.seedhr.com.tr${NC}"
    exit 0
fi

# 7. Final Config Güncelleme
echo -e "${YELLOW}[7/7] Final config güncelleniyor...${NC}"
sudo cp ~/anket-quiz/backend/nginx.conf /etc/nginx/sites-available/anket-api
sudo ln -sf /etc/nginx/sites-available/anket-api /etc/nginx/sites-enabled/anket-api
sudo rm -f /etc/nginx/sites-enabled/anket-api-temp

# Test ve Final Restart
sudo nginx -t
if [ $? -eq 0 ]; then
    sudo systemctl restart nginx
    sudo systemctl enable nginx
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}✓ Kurulum tamamlandı!${NC}"
    echo -e "${GREEN}=========================================${NC}"
    echo -e "${GREEN}API URL: https://api.seedhr.com.tr${NC}"
    echo -e "${YELLOW}Test edin: curl https://api.seedhr.com.tr/api/quizzes${NC}"
else
    echo -e "${RED}✗ Final config hatası!${NC}"
    exit 1
fi

# SSL Otomatik Yenileme Test
echo -e "${YELLOW}SSL otomatik yenileme test ediliyor...${NC}"
sudo certbot renew --dry-run

echo -e "${GREEN}Kurulum tamamlandı!${NC}"
