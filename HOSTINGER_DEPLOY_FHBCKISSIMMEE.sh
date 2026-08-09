#!/bin/bash
################################################################################
# CHURCH WEBSITE - HOSTINGER DEPLOYMENT SCRIPT
# Domain: fhbckissimmee.org
# Setup Date: 2026-08-09
################################################################################

echo "═══════════════════════════════════════════════════════════════════════════"
echo "  Church Website - Hostinger Deployment Instructions"
echo "  Domain: fhbckissimmee.org"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""

# Step 1: DNS Configuration
echo "STEP 1️⃣ : DNS CONFIGURATION (Complete this in Hostinger Panel)"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "1. Log in to Hostinger hPanel: https://hpanel.hostinger.com"
echo "2. Navigate to: Domains → fhbckissimmee.org → DNS Management"
echo "3. Add the following DNS records:"
echo ""
echo "   A Record:"
echo "   • Name: @ (or fhbckissimmee.org)"
echo "   • Type: A"
echo "   • Value: <YOUR_VPS_IP_ADDRESS>"
echo "   • TTL: 3600"
echo ""
echo "   CNAME Record (for www):"
echo "   • Name: www"
echo "   • Type: CNAME"
echo "   • Value: fhbckissimmee.org"
echo "   • TTL: 3600"
echo ""
echo "4. Click 'Save' and wait 5-30 minutes for DNS propagation"
echo "5. Verify with: dig fhbckissimmee.org"
echo ""
echo "Press ENTER when DNS is configured..."
read

# Step 2: VPS Access
echo ""
echo "STEP 2️⃣ : SSH INTO YOUR VPS"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run this command on your VPS (replace YOUR_VPS_IP with actual IP):"
echo ""
echo "  ssh root@YOUR_VPS_IP"
echo ""
echo "Once connected, run the following commands:"
echo ""

# Step 3: Install Docker
echo "STEP 3️⃣ : INSTALL DOCKER & DOCKER COMPOSE"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Copy and paste this into your VPS terminal:"
echo ""
cat << 'DOCKER_INSTALL'
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
DOCKER_INSTALL

echo ""
echo "Press ENTER after Docker is installed..."
read

# Step 4: Clone Repository
echo ""
echo "STEP 4️⃣ : CLONE REPOSITORY"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run on VPS:"
echo ""
cat << 'CLONE_REPO'
cd /opt
git clone https://github.com/fhbck87/church-website-fhbck.git church-website
cd church-website
ls -la
CLONE_REPO

echo ""
echo "Press ENTER after cloning..."
read

# Step 5: Initial Setup
echo ""
echo "STEP 5️⃣ : RUN INITIAL SETUP"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run on VPS:"
echo ""
echo "  sudo ./hostinger-deploy.sh setup"
echo ""
echo "This will:"
echo "  ✓ Create .env.production file"
echo "  ✓ Generate secure database password"
echo "  ✓ Generate JWT secret"
echo "  ✓ Create necessary directories"
echo ""
echo "Press ENTER after setup completes..."
read

# Step 6: Configuration
echo ""
echo "STEP 6️⃣ : CONFIGURE ENVIRONMENT"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run on VPS:"
echo ""
echo "  nano .env.production"
echo ""
echo "Update these values:"
echo ""
cat << 'CONFIG_VALUES'
REACT_APP_API_URL=https://fhbckissimmee.org
CORS_ORIGINS=https://fhbckissimmee.org,https://www.fhbckissimmee.org

REACT_APP_ADMIN_EMAIL=admin@fhbckissimmee.org
REACT_APP_ADMIN_PASSWORD=ChangeMe123! (Use strong password!)
REACT_APP_ADMIN_NAME=Administrator

MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_NOTIFY_TO=info@fhbckissimmee.org
CONFIG_VALUES

echo ""
echo "Press ENTER after .env.production is configured..."
read

# Step 7: SSL Setup
echo ""
echo "STEP 7️⃣ : SETUP SSL CERTIFICATES"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run on VPS:"
echo ""
echo "  sudo ./hostinger-deploy.sh ssl"
echo ""
echo "This will:"
echo "  ✓ Request Let's Encrypt certificate"
echo "  ✓ Auto-renew every 90 days"
echo "  ✓ Install in /etc/letsencrypt/"
echo ""
echo "Press ENTER after SSL setup completes..."
read

# Step 8: Copy Nginx Config
echo ""
echo "STEP 8️⃣ : COPY PRODUCTION NGINX CONFIG"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run on VPS:"
echo ""
echo "  cp nginx/default.hostinger.conf nginx/default.conf"
echo ""
echo "This copies the production nginx configuration with:"
echo "  ✓ SSL/TLS setup"
echo "  ✓ Performance optimization"
echo "  ✓ Security headers"
echo ""
echo "Press ENTER after nginx config is copied..."
read

# Step 9: Deploy
echo ""
echo "STEP 9️⃣ : DEPLOY APPLICATION"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run on VPS:"
echo ""
echo "  sudo ./hostinger-deploy.sh deploy"
echo ""
echo "This will:"
echo "  ✓ Build Docker images (may take 5-10 minutes)"
echo "  ✓ Start PostgreSQL database"
echo "  ✓ Start Spring Boot backend"
echo "  ✓ Start React frontend with Nginx"
echo "  ✓ Start Certbot for auto-renewal"
echo ""
echo "Watch the logs to ensure all services start successfully"
echo ""
echo "Press ENTER after deployment completes..."
read

# Step 10: Verify
echo ""
echo "STEP 🔟 : VERIFY DEPLOYMENT"
echo "───────────────────────────────────────────────────────────────────────────"
echo ""
echo "Run on VPS:"
echo ""
echo "  sudo ./hostinger-deploy.sh health"
echo ""
echo "This checks:"
echo "  ✓ All Docker containers running"
echo "  ✓ Frontend responds at https://fhbckissimmee.org"
echo "  ✓ API responds at https://fhbckissimmee.org/api/health"
echo ""
echo "Press ENTER after verification..."
read

# Success
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "Next Steps:"
echo ""
echo "1. 🌐 Access your site:"
echo "   https://fhbckissimmee.org"
echo ""
echo "2. 🔐 Login to Admin Panel:"
echo "   Email: admin@fhbckissimmee.org"
echo "   Password: (from .env.production)"
echo ""
echo "3. ⚠️  IMPORTANT - Change Admin Password:"
echo "   Login → Settings → Change Password"
echo ""
echo "4. 📧 Configure Email Settings:"
echo "   Admin → Email Configuration"
echo ""
echo "5. 📚 View Logs:"
echo "   sudo ./hostinger-deploy.sh logs"
echo ""
echo "6. 💾 Backup Database:"
echo "   sudo ./hostinger-deploy.sh backup"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
echo ""
echo "Support Resources:"
echo "  • Full Guide: HOSTINGER_DEPLOYMENT_GUIDE.md"
echo "  • Quick Checklist: HOSTINGER_QUICK_CHECKLIST.md"
echo "  • Deployment Script Help: sudo ./hostinger-deploy.sh help"
echo ""
echo "═══════════════════════════════════════════════════════════════════════════"
