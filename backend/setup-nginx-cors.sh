#!/bin/bash

# Install Certbot for Let's Encrypt SSL
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Get domain from user (you need to point a domain to 13.60.37.212)
# For now, we'll configure Nginx to support SSL

# Update nginx config to support both HTTP and prepare for HTTPS
sudo tee /etc/nginx/sites-available/anket-api > /dev/null <<'EOF'
server {
    listen 80;
    server_name 13.60.37.212;

    # Allow large request bodies
    client_max_body_size 10M;

    location /api/ {
        # Proxy to Docker backend
        proxy_pass http://localhost:9080/api/;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        
        # Preflight OPTIONS
        if ($request_method = 'OPTIONS') {
            return 204;
        }
        
        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }
}
EOF

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx

echo "Nginx configured for HTTP with CORS support"
echo "To add HTTPS with Let's Encrypt, you need:"
echo "1. A domain name pointing to 13.60.37.212"
echo "2. Run: sudo certbot --nginx -d yourdomain.com"
