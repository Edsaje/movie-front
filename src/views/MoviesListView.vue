<script>
// =============================================================================
// IMPORTS
// =============================================================================
import api from '@/api' // Client HTTP Axios configuré avec baseURL et intercepteurs
import AppPagination from '@/components/AppPagination.vue' // Composant réutilisable pour la pagination
import MovieCard from '@/components/MovieCard.vue' // Composant d'affichage d'une jaquette VHS de film

export default {
  name: 'MoviesListView',

  // ===========================================================================
  // 1. DATA : État local réactif du composant
  // ===========================================================================
  data() {
    return {
      // Données des films
      movies: [], // Liste des 12 films de la page courante renvoyés par l'API
      loading: false, // Indicateur de chargement pour afficher le message VCR rétro
      error: null, // Message d'erreur éventuel en cas d'échec de la requête
      currentPage: 1, // Numéro de la page actuellement affichée
      totalItems: 0, // Nombre total de films correspondant aux critères (fourni par Hydra)

      // Filtres et recherche
      genres: [], // Liste de tous les rayons / genres disponibles (ex: Action, Horreur...)
      selectedGenre: '', // Identifiant du genre sélectionné ('' = tous les rayons)
      searchTitle: '', // Texte saisi dans la barre de recherche par titre
      sortBy: 'default', // Critère de tri sélectionné ('default', 'year-asc', 'rating-desc', etc.)

      // Navigation alphabétique
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), // Tableau des lettres ['A', 'B', ..., 'Z']
      selectedLetter: '', // Lettre sélectionnée pour filtrer les titres ('' = toutes les lettres)
    }
  },

  // ===========================================================================
  // 2. METHODS : Fonctions métier et gestionnaires d'événements
  // ===========================================================================
  methods: {
    /**
     * Charge les films depuis l'API Symfony / API Platform en appliquant tous les filtres.
     * @param {number} page - Le numéro de page à charger (par défaut 1)
     */
    async fetchMovies(page = 1) {
      this.loading = true
      this.error = null

      try {
        // Choix du bon endpoint selon qu'un genre est sélectionné ou non :
        // - Si un genre est choisi : /api/genres/{id}/movies (sous-ressource)
        // - Sinon : /api/movies (collection globale)
        const endpoint = this.selectedGenre ? `/genres/${this.selectedGenre}/movies` : '/movies'

        // Paramètres envoyés en Query String dans l'URL HTTP
        const params = {
          itemsPerPage: 12,
          page: page,
        }

        // Filtre par lettre initiale (géré par MovieLetterExtension côté backend)
        if (this.selectedLetter) {
          params.letter = this.selectedLetter
        }

        // Recherche par titre partiel (géré par PartialSearchFilter côté backend)
        if (this.searchTitle.trim()) {
          params.title = this.searchTitle.trim()
        }

        // Tri global côté serveur (géré par MovieSortExtension côté backend)
        if (this.sortBy && this.sortBy !== 'default') {
          params.sort = this.sortBy
        }

        // Envoi de la requête GET via notre instance Axios
        const response = await api.get(endpoint, { params })

        // API Platform (format JSON-LD / Hydra) encapsule les résultats dans `member`
        this.movies = response.data.member
        this.totalItems = response.data.totalItems
        this.currentPage = page
      } catch (err) {
        this.error = 'Impossible de charger les films du vidéoclub'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    /**
     * Récupère la liste des genres au démarrage pour peupler la liste déroulante des rayons.
     */
    async fetchGenres() {
      try {
        const res = await api.get('/genres?itemsPerPage=50')
        this.genres = res.data.member
      } catch (err) {
        console.error('Erreur chargement genres :', err)
      }
    },

    /**
     * Synchronise l'état local du composant (data) à partir des paramètres d'URL ($route.query).
     * Permet le partage d'URL direct et la conservation des filtres lors de l'historique navigateur.
     */
    syncFromRoute() {
      this.currentPage = Number(this.$route.query.page) || 1
      this.selectedGenre = this.$route.query.genre || ''
      this.selectedLetter = this.$route.query.letter || ''
      this.searchTitle = this.$route.query.title || ''
      this.sortBy = this.$route.query.sort || 'default'
    },

    /**
     * Met à jour l'URL sans recharger brutalement la page, en nettoyant les valeurs vides/par défaut.
     * @param {Object} changes - Les paramètres à ajouter ou modifier (ex: { page: 2 })
     * @param {boolean} replace - Si true, remplace l'entrée d'historique au lieu d'en empiler une (utile pour la frappe)
     */
    updateRouteQuery(changes = {}, replace = false) {
      const currentQuery = { ...this.$route.query }
      const newQuery = {
        ...currentQuery,
        ...changes,
      }

      // Nettoie l'URL : on supprime les clés inutiles pour garder une URL propre (ex: ?page=1 ou ?sort=default)
      if (!newQuery.genre) delete newQuery.genre
      if (!newQuery.letter) delete newQuery.letter
      if (!newQuery.title) delete newQuery.title
      if (!newQuery.sort || newQuery.sort === 'default') delete newQuery.sort
      if (!newQuery.page || Number(newQuery.page) <= 1) delete newQuery.page

      // Évite une navigation inutile si les paramètres sont rigoureusement identiques
      const isSame = JSON.stringify(newQuery) === JSON.stringify(currentQuery)
      if (isSame) return

      // Navigation via Vue Router
      if (replace) {
        this.$router.replace({ query: newQuery })
      } else {
        this.$router.push({ query: newQuery })
      }
    },

    /**
     * Déclenché lors de la saisie dans le champ de recherche par titre.
     * Réinitialise la lettre sélectionnée et remet la pagination à la page 1.
     */
    onSearchChange() {
      this.selectedLetter = ''
      this.updateRouteQuery(
        {
          title: this.searchTitle.trim() || undefined,
          letter: undefined,
          page: 1,
        },
        true, // Mode replace pour ne pas créer 50 entrées dans l'historique pendant la frappe
      )
    },

    /**
     * Déclenché lors de la sélection d'un genre / rayon dans la liste déroulante.
     */
    onGenreChange() {
      this.updateRouteQuery({
        genre: this.selectedGenre || undefined,
        page: 1,
      })
    },

    /**
     * Déclenché lors du changement d'option de tri.
     * Envoie le nouveau critère à l'URL et remet la pagination à 1.
     */
    onSortChange() {
      this.updateRouteQuery({
        sort: this.sortBy !== 'default' ? this.sortBy : undefined,
        page: 1,
      })
    },

    /**
     * Déclenché lors du clic sur une touche de l'alphabet rétro.
     * @param {string} letter - La lettre choisie (ou '' pour "TOUS")
     */
    selectLetter(letter) {
      this.selectedLetter = letter
      this.searchTitle = '' // Réinitialise la recherche par titre
      this.updateRouteQuery({
        letter: letter || undefined,
        title: undefined,
        page: 1,
      })
    },

    /**
     * Déclenché par le composant enfant AppPagination via l'événement personnalisé @change-page.
     * @param {number} page - Le nouveau numéro de page
     */
    changePage(page) {
      this.updateRouteQuery({ page })
    },
  },

  // ===========================================================================
  // 3. WATCH : Surveillance des changements de l'URL ($route.query)
  // ===========================================================================
  watch: {
    /**
     * Détecte tout changement d'URL (clic sur Précédent/Suivant, modification manuelle, etc.)
     * et recharge les données de l'API seulement si un paramètre pertinent a changé.
     */
    '$route.query'(newQuery, oldQuery) {
      const prevGenre = oldQuery?.genre || ''
      const prevLetter = oldQuery?.letter || ''
      const prevTitle = oldQuery?.title || ''
      const prevSort = oldQuery?.sort || 'default'
      const prevPage = Number(oldQuery?.page) || 1

      // On resynchronise d'abord les data du composant avec l'URL
      this.syncFromRoute()

      // Si au moins un filtre ou la page a changé, on interroge l'API
      if (
        this.selectedGenre !== prevGenre ||
        this.selectedLetter !== prevLetter ||
        this.searchTitle !== prevTitle ||
        this.sortBy !== prevSort ||
        this.currentPage !== prevPage
      ) {
        this.fetchMovies(this.currentPage)
      }
    },
  },

  // ===========================================================================
  // 4. COMPUTED : Propriétés calculées
  // ===========================================================================
  computed: {
    /**
     * Retourne la liste des films à afficher dans la grille.
     * Le tri étant désormais effectué à 100% côté serveur sur toute la base (23 500+ films),
     * cette propriété retourne directement `this.movies` reçus de l'API.
     */
    sortedMovies() {
      return this.movies
    },
  },

  // ===========================================================================
  // 5. COMPONENTS : Composants enfants enregistrés localement
  // ===========================================================================
  components: {
    MovieCard,
    AppPagination,
  },

  // ===========================================================================
  // 6. LIFECYCLE HOOKS : Initialisation au montage du composant
  // ===========================================================================
  mounted() {
    // 1. Lit l'URL de départ pour initialiser filtres et page
    this.syncFromRoute()
    // 2. Lance la première requête vers l'API pour récupérer les films
    this.fetchMovies(this.currentPage)
    // 3. Charge la liste des genres pour le select
    this.fetchGenres()
  },
}
</script>

<template>
  <!-- =========================================================================
       BARRE DE FILTRES RÉTRO (Recherche, Tri, Rayons)
       ========================================================================= -->
  <div class="vhs-filter-bar">
    <!-- Recherche textuelle par titre :
         v-model lie l'input à la variable `searchTitle`.
         @input déclenche `onSearchChange()` à chaque caractère tapé. -->
    <div class="filter-group search-group">
      <input
        v-model="searchTitle"
        @input="onSearchChange"
        type="text"
        placeholder="RECHERCHER UNE VHS (ex: Night Owls, Legend of the Guardians...)"
        class="vcr-filter-input"
      />

      <!-- Sélecteur de tri serveur :
           @change déclenche `onSortChange()` quand l'utilisateur change d'option. -->
      <div class="filter-group sort-group">
        <select v-model="sortBy" @change="onSortChange" class="vcr-filter-select">
          <option value="default">★ TRI PAR DÉFAUT ★</option>
          <option value="rating-desc">⭐ MEILLEURE NOTE D'ABORD</option>
          <option value="votes-desc">LE PLUS D'AVIS</option>
          <option value="votes-asc">LE MOINS D'AVIS</option>
          <option value="title-asc">TITRE (A → Z)</option>
          <option value="title-desc">TITRE (Z → A)</option>
          <option value="year-asc">PLUS ANCIENS D'ABORD</option>
        </select>
      </div>
    </div>

    <!-- Filtre par genre / rayon :
         v-for itère sur la collection de genres chargée depuis l'API. -->
    <div class="filter-group genre-group">
      <select v-model="selectedGenre" @change="onGenreChange" class="vcr-filter-select">
        <option value="">★ TOUS LES RAYONS (TOUS GENRES) ★</option>
        <option v-for="g in genres" :key="g.id" :value="g.id">★ Rayon {{ g.label }}</option>
      </select>
    </div>
  </div>

  <!-- =========================================================================
       ZONE PRINCIPALE (Clavier alphabétique, Grille de films, Pagination)
       ========================================================================= -->
  <div class="movies-view">
    <!-- Barre alphabétique façon touches de magnétoscope VCR :
         - :class="{ active: condition }" applique la classe CSS 'active' dynamiquement.
         - @click déclenche `selectLetter(lettre)`. -->
    <div class="alphabet-bar">
      <button
        class="alphabet-btn"
        :class="{ active: selectedLetter === '' }"
        @click="selectLetter('')"
      >
        ★ TOUS ★
      </button>
      <button
        v-for="letter in alphabet"
        :key="letter"
        class="alphabet-btn"
        :class="{ active: selectedLetter === letter }"
        @click="selectLetter(letter)"
      >
        {{ letter }}
      </button>
    </div>

    <!-- Message de chargement rétro -->
    <h3 v-if="loading" class="loading-message">📼 CHARGEMENT DE LA BANDE EN COURS...</h3>

    <!-- Message d'erreur en cas de défaillance API -->
    <p v-else-if="error" style="color: #ff007f">{{ error }}</p>

    <!-- Grille de jaquettes VHS :
         Chaque film est rendu via le composant enfant MovieCard avec sa prop `:movie="movie"`. -->
    <div v-else class="movies-grid">
      <MovieCard v-for="movie in sortedMovies" :key="movie.id" :movie="movie" />
    </div>

    <!-- Composant de pagination :
         Reçoit les infos en props et écoute l'événement émis `@change-page`. -->
    <AppPagination
      v-if="!loading && totalItems > 0"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="12"
      @change-page="changePage"
    />
  </div>
</template>

<style scoped>
/* =============================================================================
   GRILLE ET MISE EN PAGE DES FILMS
   ============================================================================= */
.movies-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)); /* 4 colonnes régulières */
  gap: 2rem;
  margin-top: 2rem;
}

/* =============================================================================
   BARRE DE FILTRES VHS / RÉTRO
   ============================================================================= */
.vhs-filter-bar {
  display: flex;
  gap: 1.5rem;
  margin: 1.5rem 0 2rem;
  padding: 1rem;
  background-color: #12101a;
  border: 2px solid #facc15; /* Bordure dorée vintage */
  box-shadow: 4px 4px 0px #ff007f; /* Ombre dure décalée néon rose */
}

.filter-group {
  flex: 1;
}

/* Champs de saisie et listes déroulantes style écran cathodique / console VCR */
.vcr-filter-input,
.vcr-filter-select {
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: #05040a;
  color: #00e5ff; /* Cyan néon */
  border: 2px solid #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 1px;
  outline: none;
  text-shadow: 0 0 4px rgba(0, 229, 255, 0.4);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.vcr-filter-input::placeholder {
  color: rgba(0, 229, 255, 0.5);
  font-family: 'VT323', monospace;
}

/* Effet au focus : l'input prend une lueur dorée et rose */
.vcr-filter-input:focus,
.vcr-filter-select:focus {
  border-color: #facc15;
  box-shadow: 3px 3px 0px #ff007f;
}

.vcr-filter-select option {
  background-color: #12101a;
  color: #f8fafc;
}

/* =============================================================================
   MESSAGE DE CHARGEMENT VCR
   ============================================================================= */
.loading-message {
  color: #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
  letter-spacing: 2px;
  text-align: center;
  margin: 3rem 0;
}

/* =============================================================================
   BARRE ALPHABÉTIQUE RÉTRO
   ============================================================================= */
.alphabet-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 2rem;
  padding: 0.8rem;
  background-color: #12101a;
  border: 2px solid #facc15;
  box-shadow: 4px 4px 0px #ff007f;
}

.alphabet-btn {
  background-color: #05040a;
  color: #00e5ff;
  text-shadow: 0 0 4px rgba(0, 229, 255, 0.5);
  border: 2px solid #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  padding: 0.3rem 0.6rem;
  min-width: 2.4rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s;
}

/* Survol : s'illumine en rose avec ombre jaune */
.alphabet-btn:hover {
  background-color: #ff007f;
  color: #ffffff;
  border-color: #ff007f;
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0px #facc15;
}

/* Touche active sélectionnée : fond jaune, ombre rose */
.alphabet-btn.active {
  background-color: #facc15;
  color: #0b0914;
  border-color: #facc15;
  font-weight: bold;
  transform: translate(-2px, -2px);
  box-shadow: 3px 3px 0px #ff007f;
}
</style>
