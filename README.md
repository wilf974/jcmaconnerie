# JC Maçonnerie - Site Vitrine & Dashboard

## Démarrage rapide (Docker)

Le projet est entièrement conteneurisé avec Docker.

### Prérequis
- Docker Desktop installé et lancé.

### Lancer le projet

1. Ouvrez un terminal dans le dossier `website`.
2. Lancez la commande suivante :

```bash
docker-compose up --build
```

Le site sera accessible à l'adresse : [http://localhost:3000](http://localhost:3000)

### Base de données
- PostgreSQL est utilisé comme base de données.
- Un utilisateur administrateur est créé au démarrage :
  - Email : `admin@jc-maconnerie.fr`
  - Mot de passe : `admin123`

## Développement
- Le dossier courant est monté dans le conteneur, donc les modifications de code sont prises en compte immédiatement (hot reload).
- La base de données est persistée dans un volume Docker `postgres_data`.
