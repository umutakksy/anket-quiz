#!/bin/bash
set -e

echo "=========================================="
echo "Backend Deployment Script"
echo "=========================================="

cd ~/anket-quiz/backend

# Stop existing containers
echo "1. Stopping existing containers..."
docker-compose down 2>/dev/null || true

# Rebuild and start containers
echo "2. Building and starting containers..."
docker-compose up -d --build

# Wait for backend to start
echo "3. Waiting for backend to start..."
sleep 15

# Check container status
echo "4. Checking container status..."
docker ps

echo ""
echo "5. Testing backend API..."
sleep 5
curl -s http://localhost:9080/api/quizzes | head -c 200
echo ""

echo ""
echo "=========================================="
echo "✅ Backend Deployment Complete!"
echo "=========================================="
echo ""
echo "View logs: docker logs -f backend-backend-1"
echo "API URL: http://$(curl -s ifconfig.me)/api/quizzes"
echo ""
