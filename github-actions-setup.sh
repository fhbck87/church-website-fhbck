#!/bin/bash
################################################################################
# GitHub Actions Secrets Configuration Helper for Hostinger Deployment
# This script helps you set up all required GitHub secrets
################################################################################

echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                                                                            ║"
echo "║     GitHub Actions - Hostinger Deployment Secrets Configuration Helper    ║"
echo "║                                                                            ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Prerequisites:${NC}"
echo "  1. SSH access to Hostinger VPS working"
echo "  2. Church website deployed on Hostinger"
echo "  3. .env.production configured on VPS"
echo ""

# Step 1: Generate SSH Key
echo -e "${YELLOW}STEP 1: Generate Dedicated SSH Key for GitHub Actions${NC}"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run this command on your LOCAL machine:"
echo ""
echo -e "${GREEN}ssh-keygen -t ed25519 -f ~/.ssh/github-actions-hostinger -C 'github-actions-church-website'${NC}"
echo ""
echo "Leave passphrase empty (press Enter twice)"
echo ""
echo "Then view the public key:"
echo -e "${GREEN}cat ~/.ssh/github-actions-hostinger.pub${NC}"
echo ""
echo "Copy the public key output"
echo ""

read -p "Press ENTER when you have the public key..."

echo ""
echo -e "${YELLOW}STEP 2: Add Public Key to Hostinger VPS${NC}"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run these commands on your VPS:"
echo ""
echo -e "${GREEN}ssh root@YOUR_VPS_IP${NC}"
echo -e "${GREEN}mkdir -p ~/.ssh${NC}"
echo -e "${GREEN}echo 'YOUR_PUBLIC_KEY_HERE' >> ~/.ssh/authorized_keys${NC}"
echo -e "${GREEN}chmod 600 ~/.ssh/authorized_keys${NC}"
echo ""
echo "Verify with:"
echo -e "${GREEN}cat ~/.ssh/authorized_keys${NC}"
echo ""

read -p "Press ENTER when you've added the public key..."

echo ""
echo -e "${YELLOW}STEP 3: Get Your VPS Connection Details${NC}"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "From your VPS, run:"
echo -e "${GREEN}hostname -I${NC}"
echo ""
echo "Copy the VPS IP address (first one, typically looks like: 192.168.1.100)"
echo ""

read -p "Enter your Hostinger VPS IP address: " VPS_IP
read -p "Enter SSH username (typically 'root'): " VPS_USER
read -p "Enter SSH port (press ENTER for 22): " VPS_PORT
VPS_PORT=${VPS_PORT:-22}

echo ""
echo "Verifying connection..."
ssh -o StrictHostKeyChecking=no -o ConnectTimeout=5 "$VPS_USER@$VPS_IP" -p "$VPS_PORT" "echo '✅ SSH connection successful'" && echo "" || echo "❌ Connection failed"

echo ""
echo -e "${YELLOW}STEP 4: Get Private Key Content${NC}"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Display your PRIVATE key (for copying to GitHub):"
echo ""
echo -e "${GREEN}cat ~/.ssh/github-actions-hostinger${NC}"
echo ""
echo "Copy the ENTIRE output (including BEGIN and END lines)"
echo ""

read -p "Press ENTER when you're ready to configure GitHub secrets..."

echo ""
echo -e "${YELLOW}STEP 5: GitHub Secrets Configuration${NC}"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "🔗 Go to: https://github.com/fhbck87/church-website-fhbck/settings/secrets/actions"
echo ""
echo "Click 'New repository secret' and add these secrets:"
echo ""

cat << 'SECRETS'
╔─ VPS CONNECTION SECRETS ─────────────────────────────────────────────────╗
│                                                                           │
│  1. HOSTINGER_VPS_HOST                                                   │
│     Value: (your VPS IP address)                                         │
│     Example: 192.168.1.100                                               │
│                                                                           │
│  2. HOSTINGER_VPS_USER                                                   │
│     Value: root                                                          │
│                                                                           │
│  3. HOSTINGER_VPS_SSH_KEY                                                │
│     Value: (entire private key from ~/.ssh/github-actions-hostinger)     │
│     Include: -----BEGIN OPENSSH PRIVATE KEY----- ... -----END...-----    │
│                                                                           │
│  4. HOSTINGER_VPS_PORT (optional)                                        │
│     Value: 22 (or your custom SSH port)                                  │
│                                                                           │
╚─────────────────────────────────────────────────────────────────────────╝

╔─ APPLICATION SECRETS (from .env.production) ──────────────────────────────╗
│                                                                            │
│  5. REACT_APP_API_URL                                                     │
│     Value: https://fhbckissimmee.org                                      │
│                                                                            │
│  6. CORS_ORIGINS                                                          │
│     Value: https://fhbckissimmee.org,https://www.fhbckissimmee.org       │
│                                                                            │
│  7. DB_PASSWORD                                                           │
│     Value: (your PostgreSQL password)                                     │
│     Get from VPS: grep DB_PASSWORD /opt/church-website/.env.production   │
│                                                                            │
│  8. JWT_SECRET                                                            │
│     Value: (your JWT secret key)                                          │
│     Get from VPS: grep JWT_SECRET /opt/church-website/.env.production    │
│                                                                            │
│  9. REACT_APP_ADMIN_EMAIL                                                 │
│     Value: admin@fhbckissimmee.org                                        │
│                                                                            │
│  10. REACT_APP_ADMIN_PASSWORD                                             │
│      Value: (your admin password)                                         │
│      Get from VPS: grep REACT_APP_ADMIN_PASSWORD .env.production         │
│                                                                            │
│  11. REACT_APP_ADMIN_NAME                                                 │
│      Value: Administrator                                                 │
│                                                                            │
│  12. MAIL_HOST                                                            │
│      Value: smtp.gmail.com (or your email provider)                       │
│                                                                            │
│  13. MAIL_PORT                                                            │
│      Value: 587                                                           │
│                                                                            │
│  14. MAIL_USERNAME                                                        │
│      Value: (your email address)                                          │
│                                                                            │
│  15. MAIL_PASSWORD                                                        │
│      Value: (your app password)                                           │
│      Get from VPS: grep MAIL_PASSWORD .env.production                    │
│                                                                            │
│  16. MAIL_NOTIFY_TO                                                       │
│      Value: info@fhbckissimmee.org                                        │
│                                                                            │
╚────────────────────────────────────────────────────────────────────────────╝

╔─ OPTIONAL SECRETS ────────────────────────────────────────────────────────╗
│                                                                            │
│  17. REACT_APP_YOUTUBE_API_KEY (optional)                                 │
│      Value: (your YouTube API key if using YouTube integration)           │
│                                                                            │
│  18. REACT_APP_YOUTUBE_CHANNEL_ID (optional)                              │
│      Value: (your YouTube channel ID)                                     │
│                                                                            │
│  19. REACT_APP_STRIPE_PUBLISHABLE_KEY (optional)                          │
│      Value: pk_live_... (if using Stripe payments)                        │
│                                                                            │
│  20. STRIPE_SECRET_KEY (optional)                                         │
│      Value: sk_live_... (if using Stripe payments)                        │
│                                                                            │
╚────────────────────────────────────────────────────────────────────────────╝
SECRETS

echo ""
echo -e "${YELLOW}Getting secrets from VPS:${NC}"
echo ""
echo "SSH into your VPS and run:"
echo -e "${GREEN}cat /opt/church-website/.env.production${NC}"
echo ""
echo "This shows all values you need"
echo ""

read -p "Press ENTER when you've added all secrets to GitHub..."

echo ""
echo -e "${GREEN}✅ GitHub Secrets Configuration Complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Go to: https://github.com/fhbck87/church-website-fhbck/actions"
echo "  2. Click on 'Deploy to Hostinger VPS' workflow"
echo "  3. Click 'Run workflow' button"
echo "  4. Watch the deployment in real-time"
echo ""
echo "Your site will update at: https://fhbckissimmee.org"
echo ""
echo "To trigger deployment automatically:"
echo "  git push origin master"
echo ""
