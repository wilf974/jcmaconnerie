#!/bin/bash

set -e

DOMAIN="jcmaconnerie.woutils.com"
DEPLOY_PATH="/opt/apps/jcmaconnerie"

echo "🔧 Configuration de ${DOMAIN} sur le VPS"
echo "================================================================"

# Vérifier que le script est lancé en tant que root
if [ "$EUID" -ne 0 ]; then
   echo "❌ Ce script doit être lancé en tant que root"
   exit 1
fi

# Étape 1: Installez les dépendances
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
    openssl

# Démarrer Docker
systemctl enable docker
systemctl start docker

echo "✓ Dépendances installées"

# Étape 2: Générer le certificat SSL si absent
echo -e "\n2️⃣  Configuration SSL/HTTPS..."

if [ ! -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" ]; then
    echo "Génération du certificat SSL pour ${DOMAIN}..."
    certbot certonly --standalone -d ${DOMAIN} --non-interactive --agree-tos --register-unsafely-without-email
else
    echo "✓ Certificat SSL déjà présent"
fi

# Étape 3: Créer le symlink vers les certificats
echo "✓ Création des symlinks pour les certificats..."
mkdir -p ${DEPLOY_PATH}/certs/live
mkdir -p ${DEPLOY_PATH}/certs/archive
ln -sf /etc/letsencrypt/live/${DOMAIN} ${DEPLOY_PATH}/certs/live/ 2>/dev/null || true
ln -sf /etc/letsencrypt/archive/${DOMAIN} ${DEPLOY_PATH}/certs/archive/ 2>/dev/null || true

# Étape 4: Vérifier les variables d'environnement
echo -e "\n3️⃣  Vérification des variables d'environnement..."

if [ ! -f "${DEPLOY_PATH}/.env.production" ]; then
    echo "❌ Le fichier .env.production n'existe pas"
    exit 1
fi

echo "✓ Variables d'environnement configurées"

# Étape 5: Arrêter les services existants
echo -e "\n4️⃣  Arrêt des services existants..."
cd ${DEPLOY_PATH}
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
docker-compose down 2>/dev/null || true

# Étape 6: Construire et lancer Docker Compose
echo -e "\n5️⃣  Construction et lancement de l'application..."
cd ${DEPLOY_PATH}
docker-compose -f docker-compose.prod.yml up -d

# Attendre que les services soient prêts
echo "⏳ Attendre le démarrage des services (30 secondes)..."
sleep 30

# Étape 7: Vérifier la santé des conteneurs
echo -e "\n6️⃣  Vérification de la santé des conteneurs..."
if docker-compose -f docker-compose.prod.yml ps | grep -q "healthy"; then
    echo "✓ Les conteneurs sont sains"
else
    echo "⚠️  Vérifiez les logs:"
    docker-compose -f docker-compose.prod.yml logs
fi

# Étape 8: Configurer Nginx
echo -e "\n7️⃣  Configuration de Nginx..."

# Backup de la config par défaut
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
    exit 1
fi

# Étape 9: Configurer le renouvellement auto des certificats
echo -e "\n8️⃣  Configuration du renouvellement automatique SSL..."
# Le renouvellement est déjà automatique avec certbot, créons juste un hook
mkdir -p /etc/letsencrypt/renewal-hooks/post
cat > /etc/letsencrypt/renewal-hooks/post/restart-nginx.sh << 'HOOKEOF'
#!/bin/bash
systemctl reload nginx
HOOKEOF
chmod +x /etc/letsencrypt/renewal-hooks/post/restart-nginx.sh

# Créer une tâche cron pour le renouvellement (si absent)
if ! crontab -l 2>/dev/null | grep -q certbot; then
    (crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
fi

# Étape 10: Afficher le résumé
echo -e "\n================================================================"
echo "✅ Configuration terminée avec succès!"
echo "================================================================"
echo ""
echo "📊 Statut des services:"
docker-compose -f docker-compose.prod.yml ps
echo ""
echo "🌐 Votre site est accessible à: https://${DOMAIN}"
echo ""
echo "📝 Commandes utiles:"
echo ""
echo "  Voir les logs:"
echo "    cd ${DEPLOY_PATH}"
echo "    docker-compose -f docker-compose.prod.yml logs -f web"
echo ""
echo "  Redémarrer l'application:"
echo "    cd ${DEPLOY_PATH}"
echo "    docker-compose -f docker-compose.prod.yml restart"
echo ""
echo "  Vérifier les certificats SSL:"
echo "    certbot certificates"
echo ""
echo "  Mettre à jour le code (après git pull):"
echo "    cd ${DEPLOY_PATH}"
echo "    docker-compose -f docker-compose.prod.yml build"
echo "    docker-compose -f docker-compose.prod.yml up -d"
echo ""
