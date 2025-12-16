#!/usr/bin/env bash
set -e

cd rag-frontend
echo "Running frontend build"

npm run build

echo "Removing old backend dist"
rm -rf backend/dist

echo "Moving new dist to backend"
mv dist backend/

cd backend
echo "Starting backend server"

node server.js
