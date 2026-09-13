#!/bin/bash
# One-time setup for a DigitalOcean Ubuntu 24.04 Droplet
#
# Prerequisites:
#   1. Create a DO Droplet (Ubuntu 24.04, basic plan, add your SSH key)
#   2. Point your domain's A records to the Droplet's IP
#   3. SSH in: ssh root@<droplet-ip>
#   4. Run: bash <(curl -sL https://raw.githubusercontent.com/YOUR_USER/church-website/main/scripts/setup-do.sh) yourdomain.org
#
# Replace YOUR_USER with your GitHub username above, or run this file directly.

set -euo pipefail

DOMAIN="${1:-}"
if [ -z "$DOMAIN" ]; then
  echo "Usage: $0 yourdomain.org"
  exit 1
fi

echo "=== Setting up $DOMAIN on DigitalOcean ==="

# --- System packages ---
apt update && apt upgrade -y
apt install -y docker.io docker-compose-v2 certbot ufw

systemctl enable --now docker

# --- Firewall ---
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# --- App directory ---
mkdir -p /opt/church-website-fhbck
cd /opt/church-website-fhbck

# --- Clone repo (first time) ---
# Replace YOUR_USER/YOUR_REPO below
# Tip: add the SSH key you'll use for DO_SSH_KEY as a Deploy Key
# in GitHub repo Settings → Deploy Keys (read-only is fine)
git clone git@github.com:YOUR_USER/YOUR_REPO.git .

# --- Write nginx config with real domain ---
cat > /opt/church-website-fhbck/nginx/default.conf <<NGINX
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    root /usr/share/nginx/html;
    index index.html;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 256;

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /api/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 90;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX

# --- SSL certificate ---
certbot certonly --standalone -d "$DOMAIN" -d "www.$DOMAIN" \
  --non-interactive --agree-tos -m "admin@$DOMAIN"

# --- Environment file ---
cat > /opt/church-website-fhbck/.env <<ENV
JWT_SECRET=$(openssl rand -base64 32)
DB_PASSWORD=$(openssl rand -base64 18)
ENV

echo ""
echo "================================================"
echo "  Setup complete! Starting services..."
echo "================================================"
echo ""
echo "  Site: https://$DOMAIN"
echo ""
echo "  Next: Push to main branch to trigger CI/CD,"
echo "        or run manually:"
echo "    docker compose up -d"
echo ""
echo "  Add these GitHub secrets (Settings → Secrets → Actions):"
echo "    DO_HOST     = $(curl -s ifconfig.me)"
echo "    DO_USER     = root"
echo "    DO_SSH_KEY  = (private key that is also a GitHub Deploy Key)"
echo "    DOMAIN      = $DOMAIN"
echo "    JWT_SECRET  = see /opt/church-website-fhbck/.env"
echo "    DB_PASSWORD = see /opt/church-website-fhbck/.env"
echo ""
