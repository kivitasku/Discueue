#!/bin/bash

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "        Building Discueue"
echo "=========================================="
echo

# -----------------------------

# Frontend

# -----------------------------

echo "==> Installing frontend dependencies..."
cd "$PROJECT_ROOT/front"
npm install

echo
echo "==> Building frontend..."
npm run build

# -----------------------------

# Backend

# -----------------------------

echo
echo "==> Installing backend dependencies..."
cd "$PROJECT_ROOT/back"
npm install

echo
echo "==> Generating Prisma client..."
npx prisma generate

echo
echo "==> Running Prisma migrations..."
npx prisma migrate deploy

echo
echo "==> Building backend..."
npm run build

# -----------------------------

# Done

# -----------------------------

echo
echo "=========================================="
echo "        Build completed successfully!"
echo "=========================================="
echo
echo "Frontend: front/dist"
echo "Backend:  back/dist"
echo
