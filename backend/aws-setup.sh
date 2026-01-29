#!/bin/bash
set -e

echo "=========================================="
echo "AWS EC2 Backend Setup Script"
echo "=========================================="

# 1. Update system
echo "1. Updating system packages..."
sudo apt update
sudo apt upgrade -y

# 2. Install Docker
echo "2. Installing Docker..."
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# 3. Install Docker Compose
echo "3. Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Add user to docker group
echo "4. Adding ubuntu user to docker group..."
sudo usermod -aG docker ubuntu

# 5. Install Nginx
echo "5. Installing Nginx..."
sudo apt install -y nginx

# 6. Configure Nginx with CORS
echo "6. Configuring Nginx..."
sudo tee /etc/nginx/sites-available/anket-api > /dev/null <<'NGINXCONF'
server {
    listen 80;
    server_name _;

    # Large request body support
    client_max_body_size 10M;

    location /api/ {
        # Proxy to Docker backend
        proxy_pass http://localhost:9080/api/;
        
        # CORS headers - Allow all origins for development
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
        add_header 'Access-Control-Max-Age' '3600' always;
        
        # Preflight OPTIONS request
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*' always;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, PATCH, OPTIONS' always;
            add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With' always;
            add_header 'Access-Control-Max-Age' '3600' always;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' '0';
            return 204;
        }
        
        # Proxy headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
NGINXCONF

# 7. Enable Nginx site
echo "7. Enabling Nginx site..."
sudo ln -sf /etc/nginx/sites-available/anket-api /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 8. Test and restart Nginx
echo "8. Testing and restarting Nginx..."
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# 9. Allow necessary ports in firewall (if ufw is enabled)
echo "9. Configuring firewall..."
if sudo ufw status | grep -q "Status: active"; then
    sudo ufw allow 80/tcp
    sudo ufw allow 443/tcp
    sudo ufw allow 9080/tcp
fi

echo ""
echo "=========================================="
echo "✅ AWS Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Log out and log back in for docker group changes to take effect"
echo "2. Navigate to backend directory: cd ~/anket-quiz/backend"
echo "3. Start backend: docker-compose up -d --build"
echo "4. Check status: docker ps"
echo "5. View logs: docker logs backend-backend-1"
echo ""
echo "Backend will be available at:"
echo "  - http://$(curl -s ifconfig.me)/api"
echo "  - http://localhost:9080/api (from server)"
echo ""
