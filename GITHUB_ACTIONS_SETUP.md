# GitHub Actions - Hostinger VPS Deployment Setup

## Overview

This GitHub Actions workflow automatically deploys your Church Website to Hostinger VPS whenever you push to the `master` or `main` branch.

**Workflow File:** `.github/workflows/deploy.yml`

---

## Prerequisites

✅ Hostinger VPS with church-website deployed (see HOSTINGER_DEPLOY_INSTRUCTIONS_FHBCKISSIMMEE.md)  
✅ SSH access to VPS working  
✅ GitHub repository access  

---

## Step 1: Generate SSH Key for GitHub Actions

Generate a dedicated SSH key for GitHub Actions (don't reuse your personal key):

```bash
# Generate new SSH key (don't set a passphrase)
ssh-keygen -t ed25519 -f ~/.ssh/github-actions-hostinger -C "github-actions-church-website"

# View the public key
cat ~/.ssh/github-actions-hostinger.pub
```

---

## Step 2: Add Public Key to Hostinger VPS

Add the public key to your VPS's `authorized_keys`:

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP

# Add public key
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY_CONTENT" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# Verify
cat ~/.ssh/authorized_keys
```

---

## Step 3: Get Your VPS Connection Details

Collect these details for GitHub secrets:

```bash
# VPS IP Address
echo $HOSTINGER_VPS_HOST  # e.g., 192.168.1.100

# VPS User (usually 'root')
echo $HOSTINGER_VPS_USER  # root

# VPS SSH Port (usually 22)
echo $HOSTINGER_VPS_PORT  # 22 (default)
```

---

## Step 4: Add Secrets to GitHub

1. **Go to:** https://github.com/fhbck87/church-website-fhbck/settings/secrets/actions

2. **Click: "New repository secret"** and add these secrets:

### VPS Connection Secrets (Required)

| Secret Name | Value | Description |
|---|---|---|
| `HOSTINGER_VPS_HOST` | Your VPS IP address | The IP address of your Hostinger VPS |
| `HOSTINGER_VPS_USER` | `root` | SSH username (typically 'root') |
| `HOSTINGER_VPS_SSH_KEY` | Your private key content | SSH private key (from `~/.ssh/github-actions-hostinger`) |
| `HOSTINGER_VPS_PORT` | `22` | SSH port (optional, defaults to 22) |

### Application Secrets (From .env.production)

| Secret Name | Value | Description |
|---|---|---|
| `REACT_APP_API_URL` | `https://fhbckissimmee.org` | Your domain URL |
| `CORS_ORIGINS` | `https://fhbckissimmee.org,https://www.fhbckissimmee.org` | CORS allowed origins |
| `DB_PASSWORD` | Your database password | PostgreSQL password |
| `JWT_SECRET` | Your JWT secret | JWT signing key |
| `REACT_APP_ADMIN_EMAIL` | `admin@fhbckissimmee.org` | Admin email |
| `REACT_APP_ADMIN_PASSWORD` | Your admin password | Admin login password |
| `REACT_APP_ADMIN_NAME` | `Administrator` | Admin display name |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP server |
| `MAIL_PORT` | `587` | SMTP port |
| `MAIL_USERNAME` | Your email | Email account username |
| `MAIL_PASSWORD` | Your app password | Email app password |
| `MAIL_NOTIFY_TO` | `info@fhbckissimmee.org` | Notification email address |

### YouTube Integration (Optional)

| Secret Name | Value |
|---|---|
| `REACT_APP_YOUTUBE_API_KEY` | Your YouTube API key |
| `REACT_APP_YOUTUBE_CHANNEL_ID` | Your YouTube channel ID |

### Stripe Integration (Optional)

| Secret Name | Value |
|---|---|
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Your publishable key |
| `STRIPE_SECRET_KEY` | Your secret key |

---

## How to Add Secrets (Step-by-Step)

### For VPS SSH Key:

1. Copy your private key:
   ```bash
   cat ~/.ssh/github-actions-hostinger
   ```

2. Go to GitHub Settings → Secrets and variables → Actions

3. Click "New repository secret"

4. Name: `HOSTINGER_VPS_SSH_KEY`

5. Value: **Paste the entire private key content** (including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

6. Click "Add secret"

### For Other Secrets:

Repeat the same process for each secret in the tables above.

---

## Testing the Workflow

### Trigger Deployment Manually

1. Go to: https://github.com/fhbck87/church-website-fhbck/actions

2. Click: "Deploy to Hostinger VPS" workflow

3. Click: "Run workflow" → "Run workflow"

This manually triggers the deployment without needing a git push.

### View Workflow Execution

1. Go to Actions tab: https://github.com/fhbck87/church-website-fhbck/actions

2. Click on the running workflow to see logs

3. Check the "Deploy to Hostinger via SSH" step for detailed output

---

## Automatic Deployment

Once secrets are configured, deployment happens automatically:

```
git push origin master
    ↓
GitHub Actions triggered
    ↓
Build Docker images
    ↓
Push to GitHub Container Registry
    ↓
SSH into Hostinger VPS
    ↓
Pull latest code
    ↓
Start services with docker-compose
    ↓
Verify health
    ↓
✅ Live at https://fhbckissimmee.org
```

---

## Workflow Details

### Stages

1. **Build Stage**
   - Checks out code
   - Builds backend Docker image
   - Builds frontend Docker image
   - Pushes to GitHub Container Registry
   - Caches layers for faster builds

2. **Deploy Stage**
   - SSHes into Hostinger VPS
   - Pulls latest code from GitHub
   - Creates `.env.production` with secrets
   - Backs up database
   - Stops old containers
   - Pulls latest images
   - Starts new services
   - Verifies health

3. **Verification Stage**
   - Checks container status
   - Tests frontend health
   - Tests API health
   - Reports status

---

## Monitoring Deployments

### View Logs

1. Go to: https://github.com/fhbck87/church-website-fhbck/actions

2. Click on the latest workflow run

3. Expand "Deploy to Hostinger via SSH" section

4. Scroll through logs to see deployment progress

### Check Deployment Status

In the Actions tab, workflows show:
- ✅ Green checkmark = Successful
- ❌ Red X = Failed
- ⏳ Yellow circle = In progress

### View VPS Logs Directly

SSH into VPS and check Docker logs:

```bash
# All containers
docker-compose -f docker-compose.hostinger.yml logs -f

# Specific service
docker-compose -f docker-compose.hostinger.yml logs -f backend
docker-compose -f docker-compose.hostinger.yml logs -f frontend
```

---

## Troubleshooting

### ❌ Deployment fails with SSH connection error

**Problem:** `Permission denied (publickey)`

**Solution:**
1. Verify SSH key is added to VPS: `cat ~/.ssh/authorized_keys`
2. Check secret `HOSTINGER_VPS_SSH_KEY` contains full private key
3. Ensure key permissions on VPS: `chmod 600 ~/.ssh/authorized_keys`

### ❌ Workflow fails with "secrets not found"

**Problem:** Secret names not recognized

**Solution:**
1. Double-check secret names match exactly (case-sensitive)
2. Ensure secrets are in repository settings, not organization
3. Wait a few minutes after adding secrets before running workflow

### ❌ Docker images fail to build

**Problem:** Build step fails

**Solution:**
1. Check build logs in GitHub Actions
2. Run local build to test: `docker build -f backend/Dockerfile backend`
3. Verify Dockerfile paths are correct

### ❌ Deployment times out

**Problem:** SSH command takes too long

**Solution:**
1. Check VPS resources: `docker stats`
2. Check disk space: `df -h`
3. Increase timeout in workflow file if needed

### ❌ Services don't start after deployment

**Problem:** Containers failing to start

**Solution:**
1. SSH into VPS and check: `docker-compose -f docker-compose.hostinger.yml ps`
2. View logs: `docker-compose -f docker-compose.hostinger.yml logs`
3. Verify secrets in `.env.production`: `cat .env.production`
4. Check database connection

---

## Manual Deployment (Fallback)

If GitHub Actions fails, deploy manually:

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP
cd /opt/church-website

# Pull latest code
git pull origin master

# Deploy
sudo ./hostinger-deploy.sh deploy

# Check status
sudo ./hostinger-deploy.sh health
```

---

## Security Best Practices

✅ **Use dedicated SSH key** - Don't reuse personal keys  
✅ **Rotate SSH key** - Generate new keys periodically  
✅ **Limit secret access** - Only expose to necessary workflows  
✅ **Monitor deployments** - Review logs after each deployment  
✅ **Use environment variables** - Never hardcode secrets  
✅ **Backup before deploy** - Workflow creates automatic backups  

---

## Viewing Deployment History

1. Go to: https://github.com/fhbck87/church-website-fhbck/actions

2. All workflow runs are listed with:
   - Timestamp
   - Branch
   - Commit message
   - Status (✅ or ❌)
   - Duration

3. Click any run to see detailed logs

---

## Rollback (If Deployment Fails)

Workflow automatically backs up database before deployment:

```bash
# SSH into VPS
ssh root@YOUR_VPS_IP
cd /opt/church-website

# Restore from backup
sudo ./hostinger-deploy.sh restore /opt/backups/backup_pre_deploy_YYYYMMDD_HHMMSS.sql

# Restart services
sudo ./hostinger-deploy.sh restart
```

---

## Disabling/Pausing Workflow

If you need to stop automatic deployments:

1. Go to: https://github.com/fhbck87/church-website-fhbck/actions

2. Click "Deploy to Hostinger VPS" workflow

3. Click the 3-dot menu → "Disable workflow"

To re-enable:

1. Go to the workflow
2. Click the 3-dot menu → "Enable workflow"

---

## Next Steps

1. ✅ Generate SSH key: `ssh-keygen -t ed25519 -f ~/.ssh/github-actions-hostinger`

2. ✅ Add public key to VPS: `cat ~/.ssh/github-actions-hostinger.pub >> ~/.ssh/authorized_keys`

3. ✅ Add secrets to GitHub: https://github.com/fhbck87/church-website-fhbck/settings/secrets/actions

4. ✅ Test deployment: Push to master or manually trigger in Actions tab

5. ✅ Monitor logs: https://github.com/fhbck87/church-website-fhbck/actions

---

## Support

**Workflow file:** `.github/workflows/deploy.yml`

**GitHub Actions documentation:** https://docs.github.com/en/actions

**Hostinger VPS guide:** `HOSTINGER_DEPLOY_INSTRUCTIONS_FHBCKISSIMMEE.md`

---

**Last Updated:** 2026-08-09  
**Status:** ✅ Ready for Configuration
