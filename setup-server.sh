#!/bin/bash

# Server setup script for MAP Data Visualization app
# Usage: ./setup-server.sh

set -e

REMOTE_HOST="ubuntu@nextgenafter.school"
SSH_KEY="~/.ssh/nextgen-academy-key.pem"

echo "🔧 Setting up server for MAP Data Visualization..."

# Step 1: Install PM2 globally
echo "📦 Installing PM2..."
ssh -i $SSH_KEY $REMOTE_HOST "sudo npm install -g pm2"

# Step 2: Create PM2 log directory
echo "📁 Creating PM2 log directory..."
ssh -i $SSH_KEY $REMOTE_HOST "sudo mkdir -p /var/log/pm2 && sudo chown -R ubuntu:ubuntu /var/log/pm2"

# Step 3: Create storage directory for the app
echo "📁 Creating storage directory..."
ssh -i $SSH_KEY $REMOTE_HOST "sudo mkdir -p /var/www/map-data-visualization/storage && sudo chown -R ubuntu:ubuntu /var/www/map-data-visualization"

# Step 4: Check if PostgreSQL is needed
echo "🔍 Checking for database requirements..."
if grep -q "postgresql" package.json; then
    echo "📊 PostgreSQL is required. Installing..."
    ssh -i $SSH_KEY $REMOTE_HOST "sudo apt-get update && sudo apt-get install -y postgresql postgresql-contrib"
    echo "⚠️  Remember to create a database and user for the application"
else
    echo "✅ No PostgreSQL requirement detected"
fi

echo "✅ Server setup complete!"
echo ""
echo "Next steps:"
echo "1. Run ./deploy.sh to deploy the application"
echo "2. Configure environment variables on the server"
echo "3. Set up SSL certificate with Certbot" 