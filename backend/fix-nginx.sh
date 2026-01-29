#!/bin/bash
# Nginx reverse proxy kurulumu/düzeltmesi

echo "🔧 Nginx Reverse Proxy Ayarları Yapılandırılıyor..."

# Nginx config dosyası oluştur
sudo tee /etc/nginx/sites-available/anket-quiz > /dev/null <<'EOF'
server {
    listen 80;
    server_name _;

    # API requests
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
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        
        # Handle preflight
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

    # Health check
    location /health {
        return 200 "OK";
        add_header Content-Type text/plain;
    }
}
EOF

# Symbolic link oluştur
sudo rm -f /etc/nginx/sites-enabled/default
sudo rm -f /etc/nginx/sites-enabled/anket-quiz
sudo ln -s /etc/nginx/sites-available/anket-quiz /etc/nginx/sites-enabled/

# Nginx konfigürasyonunu test et
echo "📝 Nginx konfigürasyonu test ediliyor..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx konfigürasyonu geçerli"
    
    # Nginx'i restart et
    echo "🔄 Nginx yeniden başlatılıyor..."
    sudo systemctl restart nginx
    
    echo ""
    echo "✅ Nginx reverse proxy aktif!"
    echo "🔗 Test et: curl http://localhost/api/quizzes"
else
    echo "❌ Nginx konfigürasyon hatası!"
    exit 1
fi
