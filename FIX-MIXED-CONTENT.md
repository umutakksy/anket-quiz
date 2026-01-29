# SUNUCUDA ÇALIŞTIR - SSL + Nginx Kurulumu

## 1. Önce fix-nginx.sh dosyasını oluştur
cd ~/anket-quiz/backend

cat > fix-nginx.sh << 'SCRIPT_END'
#!/bin/bash
echo "🔧 Nginx Reverse Proxy Ayarları Yapılandırılıyor..."

sudo tee /etc/nginx/sites-available/anket-quiz > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;

    location /api/ {
        proxy_pass http://localhost:9080/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }
}
EOF

sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/anket-quiz
sudo ln -s /etc/nginx/sites-available/anket-quiz /etc/nginx/sites-enabled/

echo "📝 Nginx konfigürasyonu test ediliyor..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx konfigürasyonu geçerli"
    echo "🔄 Nginx yeniden başlatılıyor..."
    sudo systemctl restart nginx
    echo "✅ Nginx reverse proxy aktif!"
else
    echo "❌ Nginx konfigürasyon hatası!"
    exit 1
fi
SCRIPT_END

chmod +x fix-nginx.sh

## 2. Nginx'i çalıştır
sudo ./fix-nginx.sh

## 3. Test et
curl http://localhost/api/quizzes
