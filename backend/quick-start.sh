#!/bin/bash

echo "🚀 Vendora Backend - Quick Start & Test"
echo "========================================"
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the backend directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found"
    echo "Please create a .env file with required variables"
    exit 1
fi

echo "✅ All checks passed!"
echo ""
echo "Choose an option:"
echo "1) Start the server"
echo "2) Run automated tests"
echo "3) Start server in background and run tests"
echo "4) View logs"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting server..."
        npm start
        ;;
    2)
        echo ""
        echo "🧪 Running automated tests..."
        echo "Make sure the server is running on http://localhost:5000"
        echo ""
        read -p "Press Enter to continue or Ctrl+C to cancel..."
        node test-api.js
        ;;
    3)
        echo ""
        echo "🚀 Starting server in background..."
        npm start > /dev/null 2>&1 &
        SERVER_PID=$!
        echo "Server PID: $SERVER_PID"
        echo "Waiting 5 seconds for server to start..."
        sleep 5
        echo ""
        echo "🧪 Running automated tests..."
        node test-api.js
        TEST_EXIT=$?
        echo ""
        echo "🛑 Stopping server..."
        kill $SERVER_PID
        exit $TEST_EXIT
        ;;
    4)
        echo ""
        echo "📋 Recent logs:"
        echo "==============="
        if [ -f "logs/app.log" ]; then
            tail -n 50 logs/app.log
        else
            echo "No logs found"
        fi
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac
