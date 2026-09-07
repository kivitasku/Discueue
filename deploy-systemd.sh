#!/bin/bash

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACK_DIR="$PROJECT_ROOT/back"
SERVICE_FILE="/etc/systemd/system/discueue.service"

echo "=========================================="
echo "        Deploying systemd service"
echo "=========================================="
echo

# -----------------------------

# Check backend

# -----------------------------

if [ ! -d "$BACK_DIR" ]; then
echo "ERROR: Backend directory not found:"
echo "$BACK_DIR"
exit 1
fi

if [ ! -f "$BACK_DIR/dist/src/server.js" ]; then
echo "ERROR: Compiled backend not found:"
echo "$BACK_DIR/dist/src/server.js"
echo
echo "Run ./deploy-build.sh first."
exit 1
fi

# -----------------------------

# Create systemd service

# -----------------------------

echo "==> Creating systemd service..."

sudo tee "$SERVICE_FILE" > /dev/null <<EOF
[Unit]
Description=Discueue Backend
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
User=$(whoami)
WorkingDirectory=$BACK_DIR
ExecStart=/usr/bin/node dist/src/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

echo "Service file created:"
echo "$SERVICE_FILE"

# -----------------------------

# Reload systemd

# -----------------------------

echo
echo "==> Reloading systemd..."

sudo systemctl daemon-reload

# -----------------------------

# Enable service

# -----------------------------

echo
echo "==> Enabling service on boot..."

sudo systemctl enable discueue

# -----------------------------

# Restart service

# -----------------------------

echo
echo "==> Restarting backend..."

sudo systemctl restart discueue

# -----------------------------

# Status

# -----------------------------

echo
echo "=========================================="
echo "        systemd deployment complete"
echo "=========================================="
echo

sudo systemctl --no-pager --full status discueue

echo
echo "Logs:"
echo "  sudo journalctl -u discueue -f"
echo
