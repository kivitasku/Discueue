#!/bin/bash

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

NGINX_SOURCE="$PROJECT_ROOT/nginx/nginx.conf.example"
NGINX_CONFIG="/etc/nginx/sites-available/discueue"
NGINX_LINK="/etc/nginx/sites-enabled/discueue"

echo "=========================================="
echo "        Deploying Nginx"
echo "=========================================="
echo

# -----------------------------

# Check Nginx

# -----------------------------

if ! command -v nginx >/dev/null 2>&1; then
echo "ERROR: Nginx is not installed."
echo "Install it with:"
echo
echo "  sudo apt install nginx"
echo
exit 1
fi

echo "Nginx found: $(nginx -v 2>&1)"

# -----------------------------

# Check config in repository

# -----------------------------

if [ ! -f "$NGINX_SOURCE" ]; then
echo "ERROR: Nginx configuration not found:"
echo "$NGINX_SOURCE"
exit 1
fi

echo "Nginx config found:"
echo "$NGINX_SOURCE"

# -----------------------------

# Check frontend build

# -----------------------------

if [ ! -d "$PROJECT_ROOT/front/dist" ]; then
echo
echo "ERROR: Frontend build not found:"
echo "$PROJECT_ROOT/front/dist"
echo
echo "Run ./deploy-build.sh first."
exit 1
fi

# -----------------------------

# Create Nginx config

# -----------------------------

echo
echo "==> Installing Nginx configuration..."

sed "s|__PROJECT_ROOT__|$PROJECT_ROOT|g" \
"$NGINX_SOURCE" \
| sudo tee "$NGINX_CONFIG" > /dev/null

echo "Nginx configuration installed:"
echo "$NGINX_CONFIG"

# -----------------------------

# Remove default site

# -----------------------------

echo
echo "==> Removing default Nginx site..."

sudo rm -f /etc/nginx/sites-enabled/default

# -----------------------------

# Enable site

# -----------------------------

echo
echo "==> Enabling discueue site..."

sudo ln -sfn "$NGINX_CONFIG" "$NGINX_LINK"

# -----------------------------

# Test configuration

# -----------------------------

echo
echo "==> Testing Nginx configuration..."

sudo nginx -t

# -----------------------------

# Enable Nginx

# -----------------------------

echo
echo "==> Enabling Nginx on boot..."

sudo systemctl enable nginx

# -----------------------------

# Reload Nginx

# -----------------------------

echo
echo "==> Reloading Nginx..."

sudo systemctl reload nginx

# -----------------------------

# Done

# -----------------------------

echo
echo "=========================================="
echo "        Nginx deployment complete"
echo "=========================================="
echo

echo "Project root:"
echo "  $PROJECT_ROOT"

echo
echo "Source config:"
echo "  $NGINX_SOURCE"

echo
echo "Installed config:"
echo "  $NGINX_CONFIG"

echo
echo "Nginx status:"
sudo systemctl --no-pager --full status nginx

echo
