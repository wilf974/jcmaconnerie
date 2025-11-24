#!/bin/bash

# Configuration
DOMAIN="jcmaconnerie.woutils.com"
VPS_IP="168.231.84.168"
VPS_USER="root"
DEPLOY_PATH="/opt/apps"
APP_NAME="jcmaconnerie"

echo "🚀 Déploiement de ${APP_NAME} sur ${DOMAIN}"
echo "=================================================="

# Étape 1: Vérifier la connexion SSH
echo -e "\n✓ Vérification de la connexion au VPS..."
ssh -o ConnectTimeout=5 ${VPS_USER}@${VPS_IP} "echo 'Connexion OK'" || {
    echo "❌ Impossible de se connecter au VPS"
    exit 1
}

# Étape 2: Créer les répertoires sur le VPS
echo -e "\n✓ Préparation des répertoires sur le VPS..."
ssh ${VPS_USER}@${VPS_IP} << 'EOF'
    set -e
    mkdir -p /opt/apps/jcmaconnerie
    mkdir -p /opt/apps/jcmaconnerie/postgres_data
    mkdir -p /opt/apps/nginx_certs
    echo "Répertoires créés avec succès"
EOF

# Étape 3: Copier les fichiers du projet
echo -e "\n✓ Copie des fichiers du projet..."
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='.next' \
    --exclude='dev.db' --exclude='.env' \
    /home/user/jcmaconnerie/ ${VPS_USER}@${VPS_IP}:/opt/apps/jcmaconnerie/

# Étape 4: Créer le fichier .env.production sur le VPS
echo -e "\n✓ Configuration des variables d'environnement..."
ssh ${VPS_USER}@${VPS_IP} << 'ENVEOF'
    cat > /opt/apps/jcmaconnerie/.env.production << 'EOF'
DB_USER=jcmaconnerie_user
DB_PASSWORD=ChangeMe123!SecurePassword
DB_NAME=jcmaconnerie
DOMAIN=jcmaconnerie.woutils.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
EOF

    echo "✓ Fichier .env.production créé"
    echo "⚠️  ATTENTION: Modifiez les variables sensibles dans .env.production!"
ENVEOF

# Étape 5: Vérifier et générer les certificats SSL
echo -e "\n✓ Configuration SSL/HTTPS..."
ssh ${VPS_USER}@${VPS_IP} << 'SSLEOF'
    cd /opt/apps/jcmaconnerie

    if command -v certbot &> /dev/null; then
        echo "✓ Certbot trouvé"
    else
        echo "⚠️  Certbot n'est pas installé. Installez-le avec:"
        echo "   apt-get update && apt-get install -y certbot python3-certbot-nginx"
    fi

    # Créer les répertoires certbot
    mkdir -p ./certs/live/jcmaconnerie.woutils.com
    mkdir -p ./certs/archive/jcmaconnerie.woutils.com
SSLEOF

# Étape 6: Instructions finales
echo -e "\n=================================================="
echo "📋 PROCHAINES ÉTAPES à effectuer sur le VPS:"
echo "=================================================="
echo ""
echo "1️⃣  Connectez-vous au VPS:"
echo "   ssh root@${VPS_IP}"
echo ""
echo "2️⃣  Modifiez les variables d'environnement:"
echo "   nano /opt/apps/jcmaconnerie/.env.production"
echo ""
echo "3️⃣  Installez les dépendances nécessaires (si absent):"
echo "   apt-get update"
echo "   apt-get install -y docker.io docker-compose nginx certbot python3-certbot-nginx curl"
echo ""
echo "4️⃣  Générez le certificat SSL Let's Encrypt:"
echo "   certbot certonly --standalone -d jcmaconnerie.woutils.com"
echo ""
echo "5️⃣  Copiez les certificats SSL vers le bon répertoire:"
echo "   cp -r /etc/letsencrypt/live/jcmaconnerie.woutils.com /opt/apps/jcmaconnerie/certs/live/"
echo "   cp -r /etc/letsencrypt/archive/jcmaconnerie.woutils.com /opt/apps/jcmaconnerie/certs/archive/"
echo ""
echo "6️⃣  Lancez l'application avec Docker Compose:"
echo "   cd /opt/apps/jcmaconnerie"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "7️⃣  Vérifiez que tout fonctionne:"
echo "   docker-compose -f docker-compose.prod.yml logs -f web"
echo ""
echo "8️⃣  Configurez Nginx:"
echo "   cp /opt/apps/jcmaconnerie/nginx.conf /etc/nginx/sites-available/jcmaconnerie"
echo "   ln -s /etc/nginx/sites-available/jcmaconnerie /etc/nginx/sites-enabled/"
echo "   rm /etc/nginx/sites-enabled/default"
echo "   nginx -t"
echo "   systemctl restart nginx"
echo ""
echo "✅ Votre site sera accessible à: https://jcmaconnerie.woutils.com"
echo ""
