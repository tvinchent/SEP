# Application de Suggestions d'Activités Adaptées

## Présentation générale

L'activité physique est primordiale dans la gestion des maladies comme la Sclérose En Plaque ou Charcot. Plus généralement, il est recommandé à tous de pratiquer régulièrement de l'activité physique. Notre application vise à motiver les utilisateurs en leur suggérant des activités adaptés à leurs capacités.

## Introduction technique

Cette application aide les utilisateurs à trouver des activités sur mesure, en utilisant une intelligence artificielle pour générer des suggestions et Google Maps pour les afficher sur une carte.

## Version 0.3

- Utiliser Node pour l'API en utilisant une structure ViteJS
- Ajout d'un loading
- Affiche par défaut le texte de la première activité
- Markers cliquables
- Appel à l'api au chargement de la page

## Version 0.2

- Ajout de la geolicalisation de l'utilisateur
- Affichage des infos des activités en dessous de la carte
- Fix des warning relatifs à l'utilisation d'une mauvaise version de map

## TODO

- 2 pages dont la première est un QCM simple puis renvoie vers la page principale
--
- refaire l'API via PHP car l'API node ne tourne que
  - en local
  - lorsque mon server est lancé
--
- Faire l'appli avec l'IA Gemini (en effectuant la requête via Gemini)
- Relancer la recherche sur la base de la position courante de la carte et non les coords geolocalisés
- Porter l'application sur Android avec Expo
- Ajouter des fonctionnalités : persistance de données, personnalisation (budget, durée - ouvert maintenant, type - culturel, social, physique + autres cf questionnaire) avec "Commencez tout de suite - Faire le questionnaire (2 minutes)"

## Question @ Google

- Comment utiliser Gemini
- Comment faire en sorte de rechercher sur la fenêtre courante

## Synopsis de la vidéo

- Présentation générale (script DONE)
- Présentation de l'équipe (TODO)
- Présentation de l'application (TODO)
- Présentation technique (script DONE)

## Améliorations proposées par GPT

### 1. Amélioration de l'Interface Utilisateur (UI/UX)

- **Framework CSS Moderne** : Intégrez un framework comme **Bootstrap**, **Tailwind CSS** ou **Materialize** pour améliorer l'esthétique et la réactivité de l'interface.
- **Design Responsive** : Assurez-vous que l'application est optimisée pour une utilisation sur ordinateurs, tablettes et smartphones.
- **Thème Sombre/Clair** : Offrez aux utilisateurs la possibilité de choisir entre un thème sombre et clair pour améliorer le confort visuel.

### 2. Filtrage et Personnalisation Avancés

- **Filtres Supplémentaires** : Ajoutez des options pour filtrer les activités par catégorie, localisation, coût, durée, etc.
- **Moteur de Recherche** : Intégrez une barre de recherche pour permettre aux utilisateurs de trouver des activités spécifiques.
- **Personnalisation des Préférences** : Permettez aux utilisateurs de sauvegarder leurs préférences pour des suggestions plus personnalisées.

### 3. Authentification et Gestion des Utilisateurs

- **Système d'Inscription et de Connexion** : Implémentez une authentification sécurisée pour permettre aux utilisateurs de créer des comptes.
- **Profils Utilisateurs** : Offrez la possibilité de gérer un profil, d'enregistrer des activités favorites, de voir l'historique des recherches, etc.
- **Connexion via Réseaux Sociaux** : Facilitez l'inscription et la connexion via des plateformes comme Google, Facebook ou Twitter.

### 4. Base de Données et Persistance des Données

- **Intégration d'une Base de Données** : Utilisez une base de données relationnelle (MySQL, PostgreSQL) ou NoSQL (MongoDB) pour stocker les activités, les utilisateurs et les préférences.
- **Gestion des Sessions** : Maintenez les sessions utilisateur pour une expérience continue.
- **Sauvegarde des Données** : Implémentez des mécanismes de sauvegarde et de récupération des données pour assurer leur intégrité.

### 5. Optimisation des Requêtes API

- **Mise en Cache** : Utilisez un système de mise en cache comme Redis pour stocker temporairement les réponses fréquentes de l'API OpenAI.
- **Réduction des Appels API** : Enregistrez localement les activités générées pour minimiser les coûts et améliorer les temps de réponse.
- **Contrôle des Erreurs** : Améliorez la gestion des erreurs pour fournir des messages clairs à l'utilisateur en cas de problème.

### 6. Localisation et Internationalisation

- **Support Multilingue** : Ajoutez la prise en charge de plusieurs langues pour toucher un public plus large.
- **Formats Régionaux** : Adaptez les formats de date, heure et unités de mesure en fonction de la localisation de l'utilisateur.

### 7. Accessibilité

- **Conformité aux Normes WCAG** : Assurez-vous que l'application est accessible aux personnes en situation de handicap en respectant les directives pour l'accessibilité des contenus Web.
- **Navigation au Clavier** : Permettez la navigation complète de l'application via le clavier.
- **Descriptions Alternatives** : Ajoutez des descriptions textuelles pour les images et les éléments interactifs.

### 8. Sécurité et Conformité

- **HTTPS** : Assurez-vous que toutes les communications sont sécurisées via SSL/TLS.
- **Validation et Sanitation des Entrées** : Protégez l'application contre les injections SQL, XSS et autres vulnérabilités en validant toutes les entrées utilisateur.
- **Protection des Clés API** : Stockez les clés API de manière sécurisée côté serveur et ne les exposez pas dans le code client.

### 9. Tests et Qualité du Code

- **Tests Unitaires** : Écrivez des tests unitaires pour le backend et le frontend afin d'assurer la fiabilité du code.
- **Tests d'Intégration** : Vérifiez que les différentes composantes de l'application fonctionnent bien ensemble.
- **Linting et Formatage** : Utilisez des outils comme ESLint et Prettier pour maintenir un code propre et cohérent.

### 10. Déploiement et Scalabilité

- **Déploiement sur le Cloud** : Envisagez de déployer l'application sur des plateformes cloud comme AWS, Google Cloud ou Heroku.
- **Scalabilité Horizontale** : Préparez l'application à gérer une augmentation du trafic en mettant en place du load balancing et des instances multiples.
- **CI/CD** : Implémentez des pipelines d'intégration et de déploiement continus pour faciliter les mises à jour.

### 11. Fonctionnalités Supplémentaires

- **Notifications** : Intégrez des notifications par email ou SMS pour informer les utilisateurs de nouvelles activités ou mises à jour.
- **Commentaires et Évaluations** : Permettez aux utilisateurs de laisser des commentaires et des notes sur les activités.
- **Partage sur les Réseaux Sociaux** : Ajoutez des options pour partager des activités sur les plateformes sociales.

### 12. Analyse et Suivi

- **Intégration d'Outils d'Analyse** : Utilisez des outils comme Google Analytics pour suivre l'utilisation de l'application.
- **Feedback Utilisateur** : Mettez en place des sondages ou des formulaires pour recueillir les retours des utilisateurs.

© 2024 EPSI Lille