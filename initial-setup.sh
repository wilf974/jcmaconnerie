#!/bin/bash

set -e

DOMAIN="jcmaconnerie.woutils.com"
DEPLOY_PATH="/opt/apps/jcmaconnerie"
GIT_REPO="https://github.com/wilf974/jcmaconnerie.git"
GIT_BRANCH="claude/deploy-vps-https-01MEf7Rw5FvEWWYPvRKubogH"

echo "🚀 Installation initiale de ${DOMAIN}"
echo "================================================================"

# Vérifier que le script est lancé en tant que root
if [ "$EUID" -ne 0 ]; then
   echo "❌ Ce script doit être lancé en tant que root"
   exit 1
fi

# Étape 1: Installez les dépendances système
echo -e "\n1️⃣  Installation des dépendances système..."
apt-get update
apt-get install -y \
    docker.io \
    docker-compose \
    nginx \
    certbot \
    python3-certbot-nginx \
    curl \
    git \
    openssl \
    wget

echo "✓ Dépendances système installées"

# Démarrer Docker
systemctl enable docker
systemctl start docker

# Étape 2: Créer le répertoire parent
echo -e "\n2️⃣  Création des répertoires..."
mkdir -p /opt/apps
cd /opt/apps

# Étape 3: Cloner le repository Git
echo -e "\n3️⃣  Clonage du repository Git..."
if [ -d "${DEPLOY_PATH}" ]; then
    echo "⚠️  Le répertoire ${DEPLOY_PATH} existe déjà"
    echo "Mise à jour du repository..."
    cd ${DEPLOY_PATH}
    git fetch origin
    git checkout ${GIT_BRANCH}
    git pull origin ${GIT_BRANCH}
else
    echo "Clonage du repository..."
    git clone --branch ${GIT_BRANCH} ${GIT_REPO} jcmaconnerie
    cd ${DEPLOY_PATH}
fi

echo "✓ Repository cloné/mis à jour"
git log -1 --oneline

# Étape 4: Créer le fichier .env.production
echo -e "\n4️⃣  Configuration des variables d'environnement..."

if [ ! -f "${DEPLOY_PATH}/.env.production" ]; then
    echo "Création du fichier .env.production..."

    # Générer des secrets sécurisés
    DB_PASSWORD=$(openssl rand -base64 32)
    NEXTAUTH_SECRET=$(openssl rand -base64 32)

    cat > ${DEPLOY_PATH}/.env.production << EOF
# Database Configuration
DB_USER=jcmaconnerie_user
DB_PASSWORD=${DB_PASSWORD}
DB_NAME=jcmaconnerie

# Domain
DOMAIN=${DOMAIN}

# NextAuth Configuration
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=https://${DOMAIN}
EOF

    echo "✓ Fichier .env.production créé avec secrets générés automatiquement"
    echo ""
    echo "📝 Variables d'environnement générées:"
    echo "   DB_PASSWORD: ${DB_PASSWORD}"
    echo "   NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}"
    echo ""
else
    echo "✓ Fichier .env.production existe déjà"
fi

# Étape 5: Générer le certificat SSL
echo -e "\n5️⃣  Configuration SSL/HTTPS avec Let's Encrypt..."

if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    echo "Génération du certificat SSL pour ${DOMAIN}..."
    certbot certonly --standalone -d ${DOMAIN} --non-interactive --agree-tos --register-unsafely-without-email
    echo "✓ Certificat SSL généré"
else
    echo "✓ Certificat SSL déjà présent"
    echo "   Validité:"
    certbot certificates
fi

# Étape 6: Vérifier/créer les répertoires de certificats
echo -e "\n6️⃣  Configuration des certificats..."
mkdir -p ${DEPLOY_PATH}/certs/live
mkdir -p ${DEPLOY_PATH}/certs/archive

# Créer les symlinks vers les certificats Let's Encrypt
ln -sf /etc/letsencrypt/live/${DOMAIN} ${DEPLOY_PATH}/certs/live/ 2>/dev/null || true
ln -sf /etc/letsencrypt/archive/${DOMAIN} ${DEPLOY_PATH}/certs/archive/ 2>/dev/null || true

echo "✓ Certificats configurés"

# Étape 7: Créer les volumes Docker
echo -e "\n7️⃣  Préparation des volumes Docker..."
mkdir -p ${DEPLOY_PATH}/postgres_data
chmod 700 ${DEPLOY_PATH}/postgres_data

echo "✓ Volumes créés"

# Étape 8: Arrêter les services existants
echo -e "\n8️⃣  Arrêt des services existants..."
cd ${DEPLOY_PATH}
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose down 2>/dev/null || true

# Étape 9: Construire et lancer Docker Compose
echo -e "\n9️⃣  Construction et lancement de l'application..."
cd ${DEPLOY_PATH}
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

echo "⏳ Attendre le démarrage des services (40 secondes)..."
sleep 40

# Étape 10: Vérifier la santé des conteneurs
echo -e "\n🔟 Vérification de la santé des conteneurs..."
docker-compose -f docker-compose.prod.yml ps

if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✓ Les conteneurs sont lancés"
else
    echo "⚠️  Certains conteneurs ne démarrent pas"
    echo "Vérifiez les logs:"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi

# Étape 11: Configurer Nginx
echo -e "\n1️⃣1️⃣  Configuration de Nginx..."

# Supprimer la config par défaut si elle existe
if [ -f "/etc/nginx/sites-enabled/default" ]; then
    rm /etc/nginx/sites-enabled/default
fi

# Copier la configuration Nginx
cp ${DEPLOY_PATH}/nginx.conf /etc/nginx/sites-available/${DOMAIN}
ln -sf /etc/nginx/sites-available/${DOMAIN} /etc/nginx/sites-enabled/ 2>/dev/null || true

# Tester la configuration Nginx
if nginx -t; then
    echo "✓ Configuration Nginx valide"
    systemctl restart nginx
    systemctl enable nginx
else
    echo "❌ Erreur dans la configuration Nginx"
    cat /var/log/nginx/error.log
    exit 1
fi

# Étape 12: Configurer le renouvellement auto des certificats
echo -e "\n1️⃣2️⃣  Configuration du renouvellement automatique SSL..."

# Créer un hook pour redémarrer Nginx après renouvellement
mkdir -p /etc/letsencrypt/renewal-hooks/post
cat > /etc/letsencrypt/renewal-hooks/post/restart-nginx.sh << 'HOOKEOF'
#!/bin/bash
systemctl reload nginx
HOOKEOF
chmod +x /etc/letsencrypt/renewal-hooks/post/restart-nginx.sh

# Créer une tâche cron pour le renouvellement (si absent)
if ! crontab -l 2>/dev/null | grep -q certbot; then
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
    echo "✓ Tâche cron de renouvellement SSL créée"
else
    echo "✓ Tâche cron de renouvellement SSL déjà existante"
fi

# Étape 13: Tester l'accès HTTPS
echo -e "\n1️⃣3️⃣  Test de l'accès HTTPS..."
sleep 3
if curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN} | grep -q "200\|301\|302"; then
    echo "✓ Site accessible en HTTPS"
else
    echo "⚠️  Impossible d'accéder au site"
    echo "Vérifiez les logs Nginx:"
    tail -20 /var/log/nginx/error.log
fi

# Étape 14: Afficher le résumé final
echo -e "\n================================================================"
echo "✅ Installation terminée avec succès!"
echo "================================================================"
echo ""
echo "🌐 Votre site est maintenant accessible à:"
echo "   https://${DOMAIN}"
echo ""
echo "📊 Statut des services:"
docker-compose -f ${DEPLOY_PATH}/docker-compose.prod.yml ps
echo ""
echo "📝 Identifiants de connexion par défaut:"
echo "   Email: admin@jc-maconnerie.fr"
echo "   Mot de passe: admin123"
echo ""
echo "🔐 Variables sensibles générées:"
echo "   DB_PASSWORD: ${DB_PASSWORD}"
echo "   NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}"
echo "   (Sauvegardées dans: ${DEPLOY_PATH}/.env.production)"
echo ""
echo "📋 Fichier de configuration:"
echo "   ${DEPLOY_PATH}/.env.production"
echo ""
echo "📖 Documentation complète:"
echo "   ${DEPLOY_PATH}/DEPLOY.md"
echo ""
echo "📞 Commandes utiles:"
echo ""
echo "   Voir les logs en temps réel:"
echo "     cd ${DEPLOY_PATH}"
echo "     docker-compose -f docker-compose.prod.yml logs -f web"
echo ""
echo "   Redémarrer l'application:"
echo "     cd ${DEPLOY_PATH}"
echo "     docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "   Arrêter l'application:"
echo "     cd ${DEPLOY_PATH}"
echo "     docker-compose -f docker-compose.prod.yml down"
echo ""
echo "   Vérifier les certificats SSL:"
echo "     certbot certificates"
echo ""
echo "   Renouveler les certificats manuellement:"
echo "     certbot renew --dry-run"
echo "     certbot renew"
echo ""
echo "🔄 Mise à jour du code:"
echo "   cd ${DEPLOY_PATH}"
echo "   git pull origin ${GIT_BRANCH}"
echo "   docker-compose -f docker-compose.prod.yml build"
echo "   docker-compose -f docker-compose.prod.yml up -d"
echo ""
