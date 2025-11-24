#!/bin/bash

set -e

DEPLOY_PATH="/opt/apps/jcmaconnerie"
GIT_BRANCH="claude/deploy-vps-https-01MEf7Rw5FvEWWYPvRKubogH"

echo "🔄 Mise à jour de l'application"
echo "================================================================"

cd ${DEPLOY_PATH}

# Vérifier qu'on est dans le bon répertoire
if [ ! -f "${DEPLOY_PATH}/docker-compose.prod.yml" ]; then
    echo "❌ Erreur: ${DEPLOY_PATH}/docker-compose.prod.yml introuvable"
    echo "Assurez-vous d'être dans le répertoire de l'application"
    exit 1
fi

# Étape 1: Récupérer les dernières modifications du repository
echo -e "\n1️⃣  Récupération du code source..."
git fetch origin ${GIT_BRANCH}
git pull origin ${GIT_BRANCH}
echo "✓ Code source mis à jour"
git log -1 --oneline

# Étape 2: Arrêter les conteneurs actuels
echo -e "\n2️⃣  Arrêt des conteneurs..."
docker-compose -f docker-compose.prod.yml down
echo "✓ Conteneurs arrêtés"

# Étape 3: Reconstruire l'image Docker
echo -e "\n3️⃣  Reconstruction de l'image Docker..."
docker-compose -f docker-compose.prod.yml build
echo "✓ Image construite"

# Étape 4: Relancer les conteneurs
echo -e "\n4️⃣  Lancement des conteneurs..."
docker-compose -f docker-compose.prod.yml up -d
echo "✓ Conteneurs lancés"

# Étape 5: Attendre le démarrage
echo "⏳ Attendre le démarrage des services (30 secondes)..."
sleep 30

# Étape 6: Vérifier la santé
echo -e "\n5️⃣  Vérification de la santé des conteneurs..."
docker-compose -f docker-compose.prod.yml ps

if docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    echo "✅ Application mise à jour avec succès!"
    echo ""
    echo "📊 Statut:"
    docker-compose -f docker-compose.prod.yml ps
    echo ""
    echo "📝 Voir les logs:"
    echo "   docker-compose -f docker-compose.prod.yml logs -f web"
else
    echo "⚠️  Certains conteneurs ne démarrent pas"
    echo "Vérifiez les logs:"
    docker-compose -f docker-compose.prod.yml logs
    exit 1
fi
