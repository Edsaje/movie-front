# 📼 CONTRESENS CRITIQUE — Rétro Vidéoclub

> Projet d'apprentissage et de formation approfondie à **Vue.js 3** & son écosystème moderne (Pinia, Vue Router, Vite, Axios).

---

## 🌟 À propos du projet

**Contresens Critique** est une application web monopage (SPA) reproduisant l'expérience d'un vidéo-club culte des années 80/90. 

L'application permet d'explorer un catalogue de plus de **23 500 films** présentés sous forme de véritables boîtiers de cassettes VHS, de filtrer par rayon (genre) ou par lettre alphabétique, de trier l'intégralité de la vidéothèque directement sur le serveur, de consulter les fiches détaillées, et de s'authentifier avec sa **"Carte Membre"** pour laisser des critiques sur le livre d'or de chaque film.

---

## 🎨 Direction Artistique (DA) : L'ambiance Vidéoclub 80s/90s & Synthwave

L'identité visuelle a été conçue pour plonger l'utilisateur dans l'âge d'or de la cassette vidéo :

* **Atmosphère Cathodique & CRT** : Lignes de balayage (*scanlines*) d'écran de télévision, arrière-plans sombres profonds (`#05040a`, `#0b0914`, `#12101a`).
* **Palette Néon Électrique** :
  * **Cyan néon** (`#00e5ff`) : pour les contours et les touches de commande VCR.
  * **Rose fuchsia / Magenta** (`#ff007f`) : pour les ombres dures décalées typiques des années 90 (*hard offset shadows* sans flou).
  * **Jaune doré rétro** (`#facc15`) : pour les étiquettes, les macarons "DISPO" et les bordures vintage.
* **Typographie Matricielle & Rétro** :
  * `'VT323'` (monospace matriciel) : pour l'affichage LED, les boutons magnétoscope et les compteurs de bande.
  * `'Chakra Petch'` : pour les titres géométriques et textes d'interface.
* **Composants Skewmorphiques** :
  * **Boîtiers VHS** (`MovieCard.vue`) : macaron biseauté "★ DISPO ★", bandes tricolores vintage (style JVC / Kodak / BASF) et étiquette papier matricielle avec cote IMDb.
  * **Carte Membre Adhérent** (`LoginView.vue`) : badge vintage avec bande magnétique et puce rétro.
  * **Commandes de Magnétoscope** (`AppPagination.vue`) : boutons de transport "◀◀ DÉBUT", "◀ PREV", "NEXT ▶", "FIN ▶▶" et compteur digital façon afficheur LED de magnétoscope.

---

## 🛠️ Architecture Technique & Fonctionnalités

### 1. Front-end (Vue.js 3 & Écosystème)
* **Vue 3** : Options API structurée, maintenable et documentée ligne par ligne (`data`, `methods`, `computed`, `watch`, `mounted`).
* **Vue Router** : Mode HTML5 History (`createWebHistory`), routes dynamiques (`/movies/:id`, `/connexion`), synchronisation bidirectionnelle fluide avec l'URL (`$route.query`) pour que les filtres, la recherche, le tri et la pagination soient partageables et conservés dans l'historique du navigateur.
* **Pinia** : Store réactif centralisé (`useAuthStore`) pour piloter la session utilisateur (token JWT, données du profil) avec persistance automatique dans le `localStorage`.
* **Axios & Intercepteurs HTTP** : Instance dédiée avec intercepteur automatique de requêtes injectant l'en-tête `Authorization: Bearer <token>` dès qu'un token est présent.

### 2. Back-end & API (Symfony & API Platform)
L'application consomme une API RESTful moderne propulsée par **Symfony** et **API Platform**, conteneurisée sous **Docker** avec le serveur d'application haute performance **FrankenPHP** :

* **Format de données JSON-LD / Hydra** : L'API expose ses ressources au standard JSON-LD (`@id`, `@type`, `member`, `totalItems`), permettant une pagination et une découverte dynamique des liens.
* **Authentification sécurisée par JWT** : Gérée via `LexikJWTAuthenticationBundle` sur la route `POST /api/auth`, fournissant un jeton Bearer Token d'une durée de validité (TTL) d'une heure.
* **Base de données SQLite & Volume de données** : Héberge plus de **23 500 films**, leurs métadonnées IMDb/RottenTomatoes, leurs genres, acteurs, réalisateurs et avis d'utilisateurs.
* **Extensions Doctrine ORM & Fonctions DQL sur-mesure** :
  * `MovieLetterExtension` : Filtrage optimisé par lettre initiale (`LOWER(m.title) LIKE :letter%`).
  * `MovieSortExtension` & fonction DQL personnalisée `JSON_EXTRACT_NUMERIC` : Permet d'exécuter un tri natif SQL/DQL sur l'ensemble de la base de 23 500+ films, y compris sur les valeurs imbriquées dans des colonnes JSON brutes (`imdb.rating`, `imdb.votes`).

### 3. Principaux Endpoints exploités
| Méthode | Endpoint | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/movies` | Catalogue paginé (paramètres `page`, `itemsPerPage`, `title`, `letter`, `sort`) | Public |
| `GET` | `/api/movies/{id}` | Fiche complète d'un film (synopsis, note, équipe technique, casting) | Public |
| `GET` | `/api/genres` | Liste des 50 genres disponibles (Rayons du vidéoclub) | Public |
| `GET` | `/api/genres/{id}/movies` | Films appartenant à un rayon spécifique | Public |
| `POST` | `/api/auth` | Authentification adhérent et délivrance du token JWT | Public |
| `GET` | `/api/movies/{id}/reviews` | Liste des avis et critiques d'adhérents pour un film | Public |
| `POST` | `/api/reviews` | Publication d'un avis d'adhérent sur une cassette | 🔒 Adhérent connecté (Bearer JWT) |

### 4. Fonctionnalités Clés
* 🔎 **Recherche et Navigation Alphabétique** : Recherche en temps réel par titre partiel et clavier alphabétique rétro (A-Z ou TOUS).
* 🏷️ **Rayons par Genre** : Filtrage par collection de genres chargée dynamiquement depuis l'API.
* ⚡ **Tri Serveur Complet sur 23 500+ Films** : Tri global (année, meilleure note IMDb, nombre d'avis ou alphabétique) exécuté côté backend Symfony / API Platform via des extensions Doctrine ORM personnalisées.
* 📼 **Fiche Détail VHS** : Consultation complète (affiche, synopsis, durée, note, réalisateurs, distribution) avec bouton de retour intelligent préservant les filtres de recherche.
* 💳 **Espace Adhérent & Critiques** : Authentification JWT, en-tête dynamique (badge d'adhérent + bouton d'éjection), et publication de critiques en direct sur le film avec actualisation instantanée sans rechargement.
* 🗜️ **Optimisation & Scripts NPM** : Commande personnalisée `npm run compress` exploitant `sharp` pour compresser les images du projet et mesurer les gains en Ko.

---

## 🚀 Installation & Commandes

### 1. Cloner et installer les dépendances
```bash
git clone git@github.com:Edsaje/movie-front.git
cd movie-front
npm install
```

### 2. Variables d'environnement (.env)
Créer un fichier `.env` à la racine :
```env
VITE_API_URL=http://localhost:8000/api
```

### 3. Commandes disponibles
* **Lancer le serveur de développement** :
  ```bash
  npm run dev
  ```
* **Compiler pour la production** :
  ```bash
  npm run build
  ```
* **Compresser les images du projet** (script personnalisé) :
  ```bash
  npm run compress
  ```
* **Linter le code (oxlint + ESLint)** :
  ```bash
  npm run lint
  ```
* **Formater le code (Prettier)** :
  ```bash
  npm run format
  ```

