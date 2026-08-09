#!/bin/bash

##############################################################################
# Church Website - Hostinger VPS Deployment Script
# Usage: ./hostinger-deploy.sh [setup|deploy|backup|restore|logs|stop]
##############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOY_DIR="/opt/church-website"
COMPOSE_FILE="docker-compose.hostinger.yml"
ENV_FILE=".env.production"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if running as root or with sudo
check_privileges() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root or with sudo"
        exit 1
    fi
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    local missing=0
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        missing=1
    else
        log_success "Docker found: $(docker --version)"
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        missing=1
    else
        log_success "Docker Compose found: $(docker-compose --version)"
    fi
    
    if [ $missing -eq 1 ]; then
        log_error "Please install missing prerequisites"
        exit 1
    fi
}

# Generate secure random strings
generate_secret() {
    openssl rand -base64 32
}

generate_password() {
    openssl rand -hex 16
}

# Initial setup - create .env.production if not exists
setup_environment() {
    log_info "Setting up environment..."
    
    if [ -f "$ENV_FILE" ]; then
        log_warning ".env.production already exists. Skipping creation."
        return
    fi
    
    log_info "Generating secure credentials..."
    local jwt_secret=$(generate_secret)
    local db_password=$(generate_password)
    
    cat > "$ENV_FILE" << EOF
# ============================================================================
# Church Website - Production Environment Configuration
# ============================================================================

# Database Configuration
DB_PASSWORD=${db_password}

# JWT Configuration
JWT_SECRET=${jwt_secret}

# Frontend Configuration
REACT_APP_API_URL=https://yourdomain.com

# YouTube Integration (optional)
# REACT_APP_YOUTUBE_API_KEY=your-api-key
# REACT_APP_YOUTUBE_CHANNEL_ID=your-channel-id

# Stripe Integration (optional)
# REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
# STRIPE_SECRET_KEY=sk_live_...

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_NOTIFY_TO=admin@yourdomain.com

# CORS Configuration
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Admin Credentials (CHANGE IMMEDIATELY AFTER FIRST LOGIN)
REACT_APP_ADMIN_EMAIL=admin@yourdomain.com
REACT_APP_ADMIN_PASSWORD=ChangeMe123!
REACT_APP_ADMIN_NAME=Administrator

# ============================================================================
# SECURITY: Update all values above before deploying to production
# ============================================================================
EOF
    
    log_success ".env.production created"
    log_warning "⚠️  IMPORTANT: Edit .env.production with your configuration"
    echo ""
    echo "Required changes:"
    echo "  1. Domain: Change 'yourdomain.com' to your actual domain"
    echo "  2. Email: Configure MAIL_* settings (Gmail app password recommended)"
    echo "  3. Admin: Change REACT_APP_ADMIN_* with strong credentials"
    echo "  4. Optional: Add YouTube/Stripe API keys if needed"
    echo ""
}

# Setup directories
setup_directories() {
    log_info "Creating necessary directories..."
    
    mkdir -p ./uploads
    mkdir -p ./logs
    mkdir -p ./nginx/certs
    mkdir -p ./nginx/webroot
    
    chmod 755 ./uploads ./logs ./nginx/certs ./nginx/webroot
    
    log_success "Directories created"
}

# Create SSL certificates with Certbot
setup_ssl() {
    log_info "Setting up SSL certificates..."
    
    # Read domain from .env or prompt user
    local domain=$(grep "REACT_APP_API_URL" "$ENV_FILE" | cut -d'=' -f2 | sed 's|https://||' | sed 's|http://||' | sed 's|/||g')
    
    if [ -z "$domain" ]; then
        log_error "Could not extract domain from $ENV_FILE"
        log_info "Please manually configure REACT_APP_API_URL in $ENV_FILE"
        return
    fi
    
    log_info "Domain detected: $domain"
    
    if [ -f "./nginx/certs/live/$domain/fullchain.pem" ]; then
        log_warning "SSL certificate for $domain already exists, skipping..."
        return
    fi
    
    log_info "Requesting Let's Encrypt certificate for $domain..."
    
    docker run -it --rm \
        -v $(pwd)/nginx/certs:/etc/letsencrypt \
        certbot/certbot certonly \
        --standalone \
        -d "$domain" \
        -d "www.$domain" \
        --email admin@"$domain" \
        --agree-tos \
        --non-interactive \
        --renew-with-new-doms || log_warning "SSL setup may require manual intervention"
    
    log_success "SSL certificate setup complete"
}

# Build and deploy
deploy() {
    log_info "Starting deployment..."
    
    if [ ! -f "$ENV_FILE" ]; then
        log_error "$ENV_FILE not found. Please run './hostinger-deploy.sh setup' first"
        exit 1
    fi
    
    log_info "Building and starting services..."
    docker-compose -f "$COMPOSE_FILE" up -d --build
    
    sleep 10
    
    log_info "Checking service status..."
    docker-compose -f "$COMPOSE_FILE" ps
    
    log_success "Deployment complete!"
    echo ""
    echo "Service URLs:"
    echo "  Frontend: https://yourdomain.com"
    echo "  API: https://yourdomain.com/api"
    echo "  Swagger UI: https://yourdomain.com/api/swagger-ui"
    echo ""
}

# Backup database
backup_database() {
    log_info "Creating database backup..."
    
    local backup_file="backup_church_db_$(date +%Y%m%d_%H%M%S).sql"
    
    docker-compose -f "$COMPOSE_FILE" exec -T postgres pg_dump -U church_admin church_db > "$backup_file"
    
    if [ -f "$backup_file" ]; then
        log_success "Database backed up to: $backup_file"
        ls -lh "$backup_file"
    else
        log_error "Backup failed"
        exit 1
    fi
}

# Restore database from backup
restore_database() {
    if [ -z "$1" ]; then
        log_error "Backup file path required: ./hostinger-deploy.sh restore <backup-file>"
        exit 1
    fi
    
    if [ ! -f "$1" ]; then
        log_error "Backup file not found: $1"
        exit 1
    fi
    
    log_warning "This will restore the database from: $1"
    read -p "Continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log_info "Restore cancelled"
        return
    fi
    
    log_info "Restoring database..."
    cat "$1" | docker-compose -f "$COMPOSE_FILE" exec -T postgres psql -U church_admin church_db
    
    log_success "Database restored"
}

# View logs
view_logs() {
    log_info "Displaying logs (Ctrl+C to stop)..."
    docker-compose -f "$COMPOSE_FILE" logs -f
}

# Stop services
stop_services() {
    log_info "Stopping all services..."
    docker-compose -f "$COMPOSE_FILE" down
    log_success "Services stopped"
}

# Restart specific service
restart_service() {
    local service=$1
    if [ -z "$service" ]; then
        log_error "Service name required"
        echo "Available services: frontend, backend, postgres, certbot"
        exit 1
    fi
    
    log_info "Restarting $service..."
    docker-compose -f "$COMPOSE_FILE" restart "$service"
    log_success "$service restarted"
}

# Update and redeploy
update() {
    log_info "Pulling latest changes..."
    git pull origin main
    
    log_info "Redeploying with latest code..."
    docker-compose -f "$COMPOSE_FILE" up -d --build
    
    sleep 10
    
    log_success "Update complete"
    docker-compose -f "$COMPOSE_FILE" ps
}

# Check health status
health_check() {
    log_info "Checking service health..."
    echo ""
    
    # Check services running
    docker-compose -f "$COMPOSE_FILE" ps
    echo ""
    
    # Check frontend
    log_info "Testing frontend endpoint..."
    if curl -sk https://yourdomain.com &> /dev/null; then
        log_success "Frontend is responding"
    else
        log_warning "Frontend check failed (might be SSL issue)"
    fi
    
    # Check API
    log_info "Testing API endpoint..."
    if curl -sk https://yourdomain.com/api/health &> /dev/null; then
        log_success "API is responding"
    else
        log_warning "API check failed"
    fi
}

# Display help
show_help() {
    cat << EOF
${BLUE}Church Website - Hostinger VPS Deployment Script${NC}

${GREEN}Usage:${NC}
    ./hostinger-deploy.sh [COMMAND] [OPTIONS]

${GREEN}Commands:${NC}
    setup               Initialize environment and create .env.production
    deploy              Build and deploy all services (requires setup first)
    ssl                 Setup SSL certificates with Let's Encrypt
    update              Pull latest code and redeploy
    backup              Create database backup
    restore <file>      Restore database from backup file
    logs                View real-time service logs
    health              Check service health status
    restart <service>   Restart specific service (frontend|backend|postgres|certbot)
    stop                Stop all services
    help                Display this help message

${GREEN}Examples:${NC}
    # First-time setup
    sudo ./hostinger-deploy.sh setup
    # Then edit .env.production with your domain and settings
    
    # Deploy to production
    sudo ./hostinger-deploy.sh deploy
    
    # Setup SSL certificates
    sudo ./hostinger-deploy.sh ssl
    
    # View logs
    sudo ./hostinger-deploy.sh logs
    
    # Backup database
    ./hostinger-deploy.sh backup
    
    # Update code
    sudo ./hostinger-deploy.sh update

${YELLOW}Important:${NC}
    1. Run with sudo for docker commands
    2. Edit .env.production before first deployment
    3. Change admin password immediately after first login
    4. Keep backups in secure location

For detailed information, see HOSTINGER_DEPLOYMENT_GUIDE.md
EOF
}

##############################################################################
# Main Script Execution
##############################################################################

COMMAND="${1:-help}"

case "$COMMAND" in
    setup)
        check_privileges
        check_prerequisites
        setup_environment
        setup_directories
        log_success "Setup complete! Next steps:"
        echo "  1. Edit .env.production with your configuration"
        echo "  2. Run: sudo ./hostinger-deploy.sh ssl"
        echo "  3. Run: sudo ./hostinger-deploy.sh deploy"
        ;;
    deploy)
        check_privileges
        check_prerequisites
        deploy
        ;;
    ssl)
        check_privileges
        check_prerequisites
        setup_ssl
        ;;
    backup)
        check_privileges
        backup_database
        ;;
    restore)
        check_privileges
        restore_database "$2"
        ;;
    logs)
        view_logs
        ;;
    stop)
        check_privileges
        stop_services
        ;;
    restart)
        check_privileges
        restart_service "$2"
        ;;
    update)
        check_privileges
        check_prerequisites
        update
        ;;
    health)
        health_check
        ;;
    help)
        show_help
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        show_help
        exit 1
        ;;
esac

exit 0
