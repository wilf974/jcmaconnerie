# Guide de Déploiement - JC Maçonnerie

## 📋 Prérequis

- **VPS avec accès root** (Debian/Ubuntu)
- **Domaine**: `jcmaconnerie.woutils.com` pointé vers `168.231.84.168`
- **SSH** configuré et fonctionnel
- **Git** installé sur votre machine locale

## 🚀 Étapes de déploiement

### ⚡ Option 1 : Installation automatique complète (Recommandé)

**Ceci est la méthode la plus simple et la plus rapide.**

Connectez-vous directement au VPS avec SSH et lancez :

```bash
ssh root@168.231.84.168

# Téléchargez et lancez le script d'installation
bash <(curl -s https://raw.githubusercontent.com/wilf974/jcmaconnerie/claude/deploy-vps-https-01MEf7Rw5FvEWWYPvRKubogH/initial-setup.sh)
```

**Ce script automatisé va :**
- ✅ Installer Docker, Docker Compose, Nginx, Certbot et Git
- ✅ Cloner le repository avec la bonne branche
- ✅ Générer un certificat SSL Let's Encrypt
- ✅ Générer les variables d'environnement sécurisées
- ✅ Construire et lancer les conteneurs Docker
- ✅ Configurer Nginx en tant que reverse proxy HTTPS
- ✅ Configurer le renouvellement automatique SSL
- ✅ Tester l'accès HTTPS

**C'est tout ! Votre site sera accessible à `https://jcmaconnerie.woutils.com` une fois le script terminé.**

---

### ⚙️ Option 2 : Installation manuelle étape par étape

Si vous préférez faire chaque étape manuellement :

#### 2.1. Connectez-vous au VPS

```bash
ssh root@168.231.84.168
```

#### 2.2. Installez les dépendances système

```bash
apt-get update
apt-get install -y docker.io docker-compose nginx certbot python3-certbot-nginx curl git openssl
systemctl enable docker
systemctl start docker
```

#### 2.3. Clonez le repository

```bash
mkdir -p /opt/apps
cd /opt/apps
git clone --branch claude/deploy-vps-https-01MEf7Rw5FvEWWYPvRKubogH https://github.com/wilf974/jcmaconnerie.git jcmaconnerie
cd jcmaconnerie
```

#### 2.4. Créez le fichier .env.production

```bash
cat > .env.production << 'EOF'
DB_USER=jcmaconnerie_user
DB_PASSWORD=$(openssl rand -base64 32)
DB_NAME=jcmaconnerie
DOMAIN=jcmaconnerie.woutils.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://jcmaconnerie.woutils.com
EOF
```

#### 2.5. Générez le certificat SSL

```bash
certbot certonly --standalone -d jcmaconnerie.woutils.com --non-interactive --agree-tos --register-unsafely-without-email
```

#### 2.6. Lancez l'application

```bash
cd /opt/apps/jcmaconnerie
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

#### 2.7. Configurez Nginx

```bash
cp nginx.conf /etc/nginx/sites-available/jcmaconnerie.woutils.com
ln -sf /etc/nginx/sites-available/jcmaconnerie.woutils.com /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t
systemctl restart nginx
systemctl enable nginx
```

#### 2.8. Configurez le renouvellement automatique SSL

```bash
mkdir -p /etc/letsencrypt/renewal-hooks/post
cat > /etc/letsencrypt/renewal-hooks/post/restart-nginx.sh << 'HOOKEOF'
#!/bin/bash
systemctl reload nginx
HOOKEOF
chmod +x /etc/letsencrypt/renewal-hooks/post/restart-nginx.sh

(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'") | crontab -
```

#### 2.9. Vérifiez que tout fonctionne

```bash
cd /opt/apps/jcmaconnerie
docker-compose -f docker-compose.prod.yml ps
curl https://jcmaconnerie.woutils.com
```

---

### ✅ Vérification finale

Une fois l'installation terminée, vérifiez :

```bash
# Vérifier le statut des conteneurs
docker-compose -f /opt/apps/jcmaconnerie/docker-compose.prod.yml ps

# Voir les logs
docker-compose -f /opt/apps/jcmaconnerie/docker-compose.prod.yml logs -f web

# Vérifier Nginx
curl https://jcmaconnerie.woutils.com

# Vérifier le certificat SSL
certbot certificates
```

## 📁 Structure des fichiers créés

```
/opt/apps/jcmaconnerie/
├── .env.production              # Variables d'environnement (à configurer)
├── docker-compose.prod.yml      # Configuration Docker pour production
├── Dockerfile.prod              # Dockerfile optimisé pour production
├── nginx.conf                   # Configuration Nginx avec SSL
├── setup-vps.sh                 # Script d'installation du VPS
├── certs/                       # Certificats SSL (symlinké)
├── postgres_data/               # Données PostgreSQL (volume)
└── [autres fichiers du projet]
```

## 🔄 Mises à jour ultérieures

Pour mettre à jour l'application après un commit Git :

```bash
# Sur votre machine locale
cd /home/user/jcmaconnerie
git pull origin main
./deploy.sh

# Sur le VPS
cd /opt/apps/jcmaconnerie
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

## 🆘 Dépannage

### Les conteneurs ne démarrent pas

```bash
cd /opt/apps/jcmaconnerie
docker-compose -f docker-compose.prod.yml logs web
docker-compose -f docker-compose.prod.yml logs postgres
```

### Erreur SSL

Vérifiez le certificat :

```bash
certbot certificates
ls -la /etc/letsencrypt/live/jcmaconnerie.woutils.com/
```

Renouvelez manuellement si nécessaire :

```bash
certbot renew --dry-run
certbot renew
```

### Connexion PostgreSQL

Accédez au conteneur :

```bash
docker-compose -f docker-compose.prod.yml exec postgres psql -U jcmaconnerie_user -d jcmaconnerie
```

### Redémarrer l'application

```bash
cd /opt/apps/jcmaconnerie
docker-compose -f docker-compose.prod.yml restart
```

## 🔒 Sécurité

- Les certificats SSL sont **auto-renouvelés** par une tâche cron
- Les variables sensibles sont dans `.env.production` (**ne pas commiter**)
- Les données PostgreSQL sont persistées dans un volume Docker
- Nginx configure les en-têtes de sécurité (HSTS, CSP, etc.)

## 📞 Support

Pour les logs détaillés :

```bash
journalctl -u docker.service -f
docker-compose -f docker-compose.prod.yml logs --tail=50 web
```

## ✅ Checklist de déploiement

- [ ] Fichiers `.env.production` configurés avec des secrets sécurisés
- [ ] Certificat SSL généré avec Let's Encrypt
- [ ] Docker et Docker Compose installés sur le VPS
- [ ] Nginx configuré et fonctionnel
- [ ] Application accessible via HTTPS
- [ ] Base de données PostgreSQL en bonne santé
- [ ] Logs vérifiés et sans erreurs
- [ ] Certificats auto-renouvellement activés
