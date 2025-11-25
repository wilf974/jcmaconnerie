# Historique des modifications - JC Maçonnerie

## 25/11/2025

### Déploiement VPS et corrections
- **Problème résolu** : `PrismaClientInitializationError` durant le build Docker
  - Ajout de `export const dynamic = 'force-dynamic'` sur toutes les pages admin et publiques utilisant Prisma
- **Problème résolu** : Ports déjà alloués (5432, 3000)
  - PostgreSQL : 10432:5432
  - Next.js : 10300:3000
- **Problème résolu** : Variables d'environnement manquantes
  - Configuration du fichier `.env` sur le VPS
- **Problème résolu** : Upload d'images échouait silencieusement
  - Création d'une route API `/api/upload` dédiée
  - Composant client `BeforeAfterForm` pour gérer les uploads
- **Problème résolu** : Erreur 413 Payload Too Large
  - Augmentation de `serverActions.bodySizeLimit` à 20mb
  - Ajout de `client_max_body_size 50m` dans Nginx
- **Problème résolu** : Images 404 après upload
  - Création de la route `/app/uploads/[...path]/route.ts` pour servir les fichiers dynamiquement
- **Problème résolu** : Erreur TypeScript Next.js 16 (params Promise)
  - Correction du type `params` dans les route handlers

### Amélioration du slider Avant/Après
- Inversion de la logique : l'image "avant" est à droite et disparaît en glissant
- Labels centrés et plus grands
- Affichage conditionnel des labels (seulement quand l'image correspondante est complètement visible)
- Animation fade-in/out sur les labels

### Confirmation visuelle formulaires
- Composant `ContactForm` avec état de succès animé
- Composant `ReviewForm` avec confirmation après soumission d'avis
- Gestion des états loading/error/success

## Structure du projet

### Pages publiques
- `/` - Accueil avec hero, métamorphoses, services, témoignages
- `/services` - Liste des services
- `/realisations` - Galerie des projets
- `/avis` - Avis clients + formulaire de soumission
- `/contact` - Formulaire de contact

### Pages admin (`/admin`)
- `/admin/accueil` - Configuration du hero
- `/admin/services` - Gestion des services
- `/admin/realisations` - Gestion des projets
- `/admin/temoignages` - Modération des avis
- `/admin/messages` - Messages reçus
- `/admin/avant-apres` - Gestion des comparaisons
- `/admin/footer` - Configuration du pied de page

### Composants
- `Navbar.tsx` - Navigation responsive
- `Footer.tsx` - Pied de page dynamique
- `BeforeAfterSlider.tsx` - Slider comparatif
- `BeforeAfterForm.tsx` - Formulaire d'upload avant/après

