#!/bin/bash
echo "🚀 Starting Smart Tourist Safety System (CLOUD MODE)..."

# Install dependencies if missing
cd /workspaces/Smart_tourist_safety-
for service in backend/auth-service backend/tourist-service backend/alert-service backend/tracking-service backend/blockchain-service backend/notification-service; do
    if [ ! -d "$service/node_modules" ]; then
        echo "📦 Installing $service..."
        cd $service && npm install --silent && cd /workspaces/Smart_tourist_safety-
    fi
done

# Install frontend if missing
if [ ! -d "frontend/web-portal/node_modules" ]; then
    cd frontend/web-portal && npm install --silent && cd /workspaces/Smart_tourist_safety-
fi
if [ ! -d "frontend/admin-dashboard/node_modules" ]; then
    cd frontend/admin-dashboard && npm install --silent && cd /workspaces/Smart_tourist_safety-
fi

# Kill old processes
pkill -f "node src/index.js" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 1

# Start Backend Services
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
sleep 2

# Start Frontends
echo "💻 Starting Frontends..."
cd /workspaces/Smart_tourist_safety-/frontend/web-portal && npm run dev &
sleep 2
cd /workspaces/Smart_tourist_safety-/frontend/admin-dashboard && PORT=3009 npm start &

echo ""
echo "✅ ALL SYSTEMS LIVE! (Cloud MongoDB)"
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
echo "☁️  Database: Railway Cloud MongoDB"
echo "================================"
