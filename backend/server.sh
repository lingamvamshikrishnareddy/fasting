#!/bin/bash

# Server management script
SERVER_NAME="your-app-name"
NODE_ENV=${NODE_ENV:-development}
PORT=${PORT:-5000}

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -i :$1 >/dev/null 2>&1
    else
        netstat -an | grep ":$1 " >/dev/null 2>&1
    fi
}

# Function to kill process on a port
kill_port() {
    if command -v lsof >/dev/null 2>&1; then
        lsof -ti :$1 | xargs kill -9 2>/dev/null
    else
        PID=$(netstat -ano | grep ":$1 " | awk '{print $5}')
        if [ ! -z "$PID" ]; then
            taskkill //PID $PID //F >/dev/null 2>&1
        fi
    fi
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}Checking prerequisites...${NC}"
    
    # Check if Node.js is installed
    if ! command -v node >/dev/null 2>&1; then
        echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
        exit 1
    fi
    
    # Check if npm is installed
    if ! command -v npm >/dev/null 2>&1; then
        echo -e "${RED}npm is not installed. Please install npm first.${NC}"
        exit 1
    fi
    
    # Check if required files exist
    if [ ! -f "package.json" ]; then
        echo -e "${RED}package.json not found. Are you in the correct directory?${NC}"
        exit 1
    fi
    
    if [ ! -f ".env" ]; then
        echo -e "${YELLOW}Warning: .env file not found. Creating from .env.example...${NC}"
        if [ -f ".env.example" ]; then
            cp .env.example .env
        else
            echo -e "${RED}No .env or .env.example file found. Please create .env file manually.${NC}"
            exit 1
        fi
    fi
    
    echo -e "${GREEN}All prerequisites checked!${NC}"
}

# Function to start the server
start_server() {
    echo -e "${YELLOW}Starting $SERVER_NAME in $NODE_ENV mode...${NC}"
    
    # Check if port is in use
    if check_port $PORT; then
        echo -e "${YELLOW}Port $PORT is already in use. Attempting to kill existing process...${NC}"
        kill_port $PORT
        sleep 2
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies...${NC}"
        npm install
    fi
    
    # Start the server based on environment
    if [ "$NODE_ENV" = "production" ]; then
        npm run start
    else
        npm run dev
    fi
}

# Function to stop the server
stop_server() {
    echo -e "${YELLOW}Stopping $SERVER_NAME...${NC}"
    if check_port $PORT; then
        kill_port $PORT
        echo -e "${GREEN}Server stopped successfully${NC}"
    else
        echo -e "${YELLOW}Server is not running${NC}"
    fi
}

# Function to restart the server
restart_server() {
    echo -e "${YELLOW}Restarting $SERVER_NAME...${NC}"
    stop_server
    sleep 2
    start_server
}

# Parse command line arguments
case "$1" in
    start)
        check_prerequisites
        start_server
        ;;
    stop)
        stop_server
        ;;
    restart)
        restart_server
        ;;
    *)
        echo "Usage: $0 {start|stop|restart}"
        exit 1
        ;;
esac

exit 0
