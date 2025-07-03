#!/bin/bash

# Deployment script for MAP Data Visualization app
# Usage: ./deploy.sh

set -e

REMOTE_HOST="ubuntu@nextgenafter.school"
SSH_KEY="~/.ssh/nextgen-academy-key.pem"
REMOTE_DIR="/var/www/map-data-visualization"
LOCAL_DIR="."

echo "🚀 Starting deployment to visualizations.nextgenafter.school..."

# Step 1: Build the application locally
echo "📦 Building the application..."
npm run build

# Step 2: Create remote directory
echo "📁 Creating remote directory..."
ssh -i $SSH_KEY $REMOTE_HOST "sudo mkdir -p $REMOTE_DIR && sudo chown -R ubuntu:ubuntu $REMOTE_DIR"

# Step 3: Copy files to server (excluding node_modules and .env files)
echo "📤 Uploading files to server..."
rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.env*' \
  --exclude '.git' \
  --exclude '.next/cache' \
  --exclude 'storage' \
  --exclude '*.log' \
  --exclude 'deploy.sh' \
  --exclude 'visualizations-nginx.conf' \
  -e "ssh -i $SSH_KEY" \
  $LOCAL_DIR/ $REMOTE_HOST:$REMOTE_DIR/

# Step 4: Copy nginx configuration
echo "📋 Copying nginx configuration..."
scp -i $SSH_KEY visualizations-nginx.conf $REMOTE_HOST:/tmp/
ssh -i $SSH_KEY $REMOTE_HOST "sudo mv /tmp/visualizations-nginx.conf /etc/nginx/sites-available/"

# Step 5: Copy PM2 ecosystem file
echo "📋 Copying PM2 configuration..."
scp -i $SSH_KEY ecosystem.config.js $REMOTE_HOST:$REMOTE_DIR/

# Step 6: Install dependencies on server
echo "📦 Installing dependencies on server..."
ssh -i $SSH_KEY $REMOTE_HOST "cd $REMOTE_DIR && npm ci --production"

# Step 7: Set up environment variables
echo "🔐 Setting up environment variables..."
echo "Please ensure .env.local is configured on the server at $REMOTE_DIR/.env.local"

# Step 8: Enable nginx site
echo "🔧 Configuring nginx..."
ssh -i $SSH_KEY $REMOTE_HOST "sudo ln -sf /etc/nginx/sites-available/visualizations-nginx.conf /etc/nginx/sites-enabled/"
ssh -i $SSH_KEY $REMOTE_HOST "sudo nginx -t && sudo systemctl reload nginx"

# Step 9: Start application with PM2
echo "🏃 Starting application with PM2..."
ssh -i $SSH_KEY $REMOTE_HOST "cd $REMOTE_DIR && pm2 start ecosystem.config.js"
ssh -i $SSH_KEY $REMOTE_HOST "pm2 save"
ssh -i $SSH_KEY $REMOTE_HOST "sudo env PATH=\$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu"

echo "✅ Deployment complete!"
echo "🌐 Application should be available at https://visualizations.nextgenafter.school"
echo ""
echo "⚠️  Don't forget to:"
echo "1. Set up SSL certificate: sudo certbot --nginx -d visualizations.nextgenafter.school"
echo "2. Configure .env.local on the server with your secrets"
echo "3. Set up the database if using Prisma" 