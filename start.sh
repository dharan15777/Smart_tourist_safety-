#!/bin/bash
echo "🚀 Starting Smart Tourist Safety System..."

# 1. Install MongoDB if needed
if ! command -v mongod &> /dev/null; then
    echo "📦 Installing MongoDB..."
    curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
    echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt-get update -y && sudo apt-get install -y mongodb-org
fi

# 2. Start MongoDB
echo "🗄️ Starting MongoDB..."
sudo mkdir -p /data/db
sudo mongod --dbpath /data/db --fork --logpath /var/log/mongod.log
sleep 2

# 3. Install backend dependencies
echo "📦 Installing backend dependencies..."
cd /workspaces/Smart_tourist_safety-/backend/auth-service && npm install --silent
cd /workspaces/Smart_tourist_safety-/backend/tourist-service && npm install --silent
cd /workspaces/Smart_tourist_safety-/backend/alert-service && npm install --silent
cd /workspaces/Smart_tourist_safety-/backend/tracking-service && npm install --silent
cd /workspaces/Smart_tourist_safety-/backend/blockchain-service && npm install --silent
cd /workspaces/Smart_tourist_safety-/backend/notification-service && npm install --silent
echo "✅ Backend dependencies installed!"

# 4. Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd /workspaces/Smart_tourist_safety-/frontend/web-portal && npm install --silent
cd /workspaces/Smart_tourist_safety-/frontend/admin-dashboard && npm install --silent
echo "✅ Frontend dependencies installed!"

# 5. Kill old processes
pkill -f "node src/index.js" 2>/dev/null
sleep 1

# 6. Start backend services
echo "🔌 Starting Backend Services..."
cd /workspaces/Smart_tourist_safety-/backend/auth-service && npm start &
sleep 1
cd /workspaces/Smart_tourist_safety-/backend/tourist-service && npm start &
sleep 1
cd /workspaces/Smart_tourist_safety-/backend/alert-service && npm start &
sleep 1
cd /workspaces/Smart_tourist_safety-/backend/tracking-service && npm start &
sleep 1
cd /workspaces/Smart_tourist_safety-/backend/blockchain-service && npm start &
sleep 1
cd /workspaces/Smart_tourist_safety-/backend/notification-service && npm start &
sleep 3

# 7. Start frontends
echo "💻 Starting Frontends..."
cd /workspaces/Smart_tourist_safety-/frontend/web-portal && npm run dev &
sleep 2
cd /workspaces/Smart_tourist_safety-/frontend/admin-dashboard && PORT=3009 npm start &

echo ""
echo "✅ ALL SYSTEMS LIVE!"
echo "================================"
echo "🌐 Web Portal:       Port 3008"
echo "👮 Admin Dashboard:  Port 3009"
echo "🔐 Auth Service:     Port 3001"
echo "👤 Tourist Service:  Port 3002"
echo "🚨 Alert Service:    Port 3003"
echo "📍 Tracking Service: Port 3005"
echo "⛓️  Blockchain:       Port 3006"
echo "📬 Notification:     Port 3007"
echo "================================"
