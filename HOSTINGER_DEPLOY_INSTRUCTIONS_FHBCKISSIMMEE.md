# HOSTINGER DEPLOYMENT - fhbckissimmee.org
## Quick Start Guide for Your Domain

**Domain:** fhbckissimmee.org  
**Status:** ✅ Ready to Deploy  
**Repository:** https://github.com/fhbck87/church-website-fhbck

---

## 🚀 IMMEDIATE NEXT STEPS

### 1. Complete DNS Setup in Hostinger Panel (5 minutes)

**Link:** https://hpanel.hostinger.com/email/fhbckissimmee.org/connect-domain

1. **Add A Record:**
   ```
   Name: @ (or fhbckissimmee.org)
   Type: A
   Value: [Your VPS IP Address from Hostinger]
   TTL: 3600
   ```

2. **Add CNAME Record for www:**
   ```
   Name: www
   Type: CNAME
   Value: fhbckissimmee.org
   TTL: 3600
   ```

3. **Save and wait 5-30 minutes for propagation**

**Verify DNS is working:**
```bash
dig fhbckissimmee.org
nslookup fhbckissimmee.org
```

---

### 2. SSH Into Your Hostinger VPS

```bash
# Replace YOUR_VPS_IP with IP from Hostinger panel
ssh root@YOUR_VPS_IP
```

---

### 3. Install Docker (2 minutes)

```bash
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
```

---

### 4. Clone Repository & Deploy (3 commands!)

```bash
# Navigate to deployment directory
cd /opt

# Clone repository
git clone https://github.com/fhbck87/church-website-fhbck.git church-website
cd church-website

# Run automated setup
sudo ./hostinger-deploy.sh setup
```

---

### 5. Configure Environment Variables

```bash
# Edit configuration file
nano .env.production
```

**Update these values for fhbckissimmee.org:**

```env
# Domain
REACT_APP_API_URL=https://fhbckissimmee.org
CORS_ORIGINS=https://fhbckissimmee.org,https://www.fhbckissimmee.org

# Admin Account (CHANGE PASSWORD AFTER LOGIN!)
REACT_APP_ADMIN_EMAIL=admin@fhbckissimmee.org
REACT_APP_ADMIN_PASSWORD=ChooseStrongPassword123!
REACT_APP_ADMIN_NAME=Administrator

# Email Configuration (Gmail recommended)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password (generate at https://myaccount.google.com/apppasswords)
MAIL_NOTIFY_TO=info@fhbckissimmee.org
```

**Save:** Press `Ctrl+X`, then `Y`, then `Enter`

---

### 6. Setup SSL Certificate (2 minutes)

```bash
sudo ./hostinger-deploy.sh ssl
```

This automatically:
- Requests Let's Encrypt certificate for fhbckissimmee.org
- Configures auto-renewal (every 90 days)
- Installs in /etc/letsencrypt/

---

### 7. Copy Production Nginx Configuration

```bash
cp nginx/default.hostinger.conf nginx/default.conf
```

---

### 8. DEPLOY! (5-10 minutes)

```bash
sudo ./hostinger-deploy.sh deploy
```

Watch the output. You should see:
```
✓ postgres running (church-db)
✓ backend running (church-backend)
✓ frontend running (church-frontend)
✓ certbot running (church-certbot)
```

---

### 9. Verify Everything Works

```bash
sudo ./hostinger-deploy.sh health
```

Check:
- ✅ All services running
- ✅ https://fhbckissimmee.org loads
- ✅ https://fhbckissimmee.org/api/health responds

---

## ✅ YOU'RE LIVE!

**Your site is now live at:**
- 🌐 **https://fhbckissimmee.org**
- 🌐 **https://www.fhbckissimmee.org**
- 🔧 **Admin Panel:** Use credentials from .env.production

---

## 🔐 SECURITY CHECKLIST

After deployment, complete these:

- [ ] Login to admin panel
- [ ] **CHANGE ADMIN PASSWORD** immediately
- [ ] Configure email settings
- [ ] Test email notifications
- [ ] Backup database: `sudo ./hostinger-deploy.sh backup`
- [ ] Monitor logs: `sudo ./hostinger-deploy.sh logs`
- [ ] Review SSL certificate: `sudo ./hostinger-deploy.sh health`

---

## 📊 Useful Commands After Deployment

```bash
# View real-time logs
sudo docker-compose -f docker-compose.hostinger.yml logs -f

# Backup database
sudo ./hostinger-deploy.sh backup

# Restart services
sudo docker-compose -f docker-compose.hostinger.yml restart backend

# Check service status
sudo ./hostinger-deploy.sh health

# Update and redeploy
sudo ./hostinger-deploy.sh update

# Stop services
sudo ./hostinger-deploy.sh stop
```

---

## 🆘 Troubleshooting

### ❌ DNS not working
- Wait up to 30 minutes for propagation
- Test with: `dig fhbckissimmee.org`
- Ensure A record points to correct VPS IP

### ❌ SSL certificate won't renew
- Check Certbot logs: `docker logs church-certbot`
- Manually renew: `sudo ./hostinger-deploy.sh ssl`

### ❌ Can't connect to API
- Check backend logs: `sudo docker-compose -f docker-compose.hostinger.yml logs backend`
- Verify CORS_ORIGINS in .env.production
- Ensure port 8080 is not blocked (it's internal)

### ❌ High memory usage
- Restart backend: `sudo ./hostinger-deploy.sh restart backend`
- Check logs for errors: `sudo ./hostinger-deploy.sh logs`

---

## 📞 Support & Resources

- **Full Deployment Guide:** `HOSTINGER_DEPLOYMENT_GUIDE.md`
- **Quick Checklist:** `HOSTINGER_QUICK_CHECKLIST.md`
- **Deployment Script Help:** `sudo ./hostinger-deploy.sh help`
- **Docker Docs:** https://docs.docker.com
- **Hostinger Support:** https://www.hostinger.com/support

---

## 🎯 What's Deployed

```
Docker Containers:
├── Frontend (React + Nginx)
│   ├── Port: 80/443 (HTTPS)
│   ├── Serves: Static files + SPA routing
│   └── SSL: Let's Encrypt auto-renewal
│
├── Backend (Spring Boot API)
│   ├── Port: 8080 (internal, proxied via nginx)
│   ├── Features: GraphQL, JWT auth, file uploads
│   └── Database: PostgreSQL
│
├── Database (PostgreSQL)
│   ├── Port: 5432 (internal only)
│   ├── Database: church_db
│   └── User: church_admin
│
└── SSL Renewal (Certbot)
    ├── Auto-renews every 90 days
    └── Certificates: /etc/letsencrypt/
```

---

**Deployed:** 2026-08-09  
**Status:** ✅ Production Ready  
**Domain:** fhbckissimmee.org  

Good luck! 🚀
