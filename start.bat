@echo off

cd rag-frontend
@REM echo Running frontend build

call npm run build

echo Removing old backend dist
rmdir  backend\dist

echo Moving new dist to backend
move dist backend\

cd backend
echo Starting backend server

node server.js
