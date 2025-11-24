# Guide de Déploiement - JC Maçonnerie

## 📋 Prérequis

- **VPS avec accès root** (Debian/Ubuntu)
- **Domaine**: `jcmaconnerie.woutils.com` pointé vers `168.231.84.168`
- **SSH** configuré et fonctionnel
- **Git** installé sur votre machine locale

## 🚀 Étapes de déploiement

### 1. Préparation locale

Rendez les scripts exécutables :

```bash
chmod +x /home/user/jcmaconnerie/deploy.sh
chmod +x /home/user/jcmaconnerie/setup-vps.sh
```

### 2. Lancer le déploiement initial

Depuis votre machine locale, lancez le script de déploiement :

```bash
cd /home/user/jcmaconnerie
./deploy.sh
```

Ce script va :
- Tester la connexion SSH
- Créer les répertoires sur le VPS
- Copier tous les fichiers du projet
- Créer un fichier `.env.production` basique

### 3. Configuration manuelle sur le VPS

Connectez-vous au VPS :

```bash
ssh root@168.231.84.168
cd /opt/apps/jcmaconnerie
```

**Modifiez les variables d'environnement sensibles** :

```bash
nano .env.production
```

Générez un secret sécurisé pour NextAuth :

```bash
openssl rand -base64 32
```

Changez au minimum :
- `DB_PASSWORD` → mot de passe de base de données sécurisé
- `NEXTAUTH_SECRET` → clé générée ci-dessus

### 4. Lancer le script de configuration du VPS

Sur le VPS, lancez le script d'installation automatisé :

```bash
chmod +x /opt/apps/jcmaconnerie/setup-vps.sh
/opt/apps/jcmaconnerie/setup-vps.sh
```

Ce script va automatiquement :
- ✅ Installer Docker, Docker Compose, Nginx, Certbot
- ✅ Générer un certificat SSL Let's Encrypt
- ✅ Configurer Nginx en tant que reverse proxy
- ✅ Lancer les conteneurs Docker
- ✅ Configurer le renouvellement automatique des certificats

### 5. Vérification

Vérifiez que tout fonctionne :

```bash
# Vérifier le statut des conteneurs
docker-compose -f /opt/apps/jcmaconnerie/docker-compose.prod.yml ps

# Voir les logs
docker-compose -f /opt/apps/jcmaconnerie/docker-compose.prod.yml logs -f web

# Vérifier Nginx
curl https://jcmaconnerie.woutils.com
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
