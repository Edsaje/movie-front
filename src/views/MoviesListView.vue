<script>
import api from '@/api'
import AppPagination from '@/components/AppPagination.vue'
import MovieCard from '@/components/MovieCard.vue'

export default {
  name: 'MoviesListView',
  data() {
    return {
      movies: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalItems: 0,
      genres: [],
      selectedGenre: '',
      searchTitle: '',
      sortBy: 'default',
    }
  },

  methods: {
    async fetchMovies(page = 1) {
      this.loading = true
      this.error = null

      try {
        const endpoint = this.selectedGenre ? `/genres/${this.selectedGenre}/movies` : '/movies'

        const params = {
          itemsPerPage: 12,
          page: page,
        }

        if (this.searchTitle.trim()) {
          params.title = this.searchTitle.trim()
        }
        const response = await api.get(endpoint, { params })
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

    async fetchGenres() {
      try {
        const res = await api.get('/genres?itemsPerPage=50')
        this.genres = res.data.member
      } catch (err) {
        console.error('Erreur chargement genres :', err)
      }
    },

    onFilterChange() {
      this.fetchMovies(1)
    },
  },

  computed: {
    sortedMovies() {
      const list = [...this.movies]

      // Tri par note
      if (this.sortBy === 'rating-desc') {
        return list.sort((a, b) => (Number(b.imdb?.rating) || 0) - (Number(a.imdb?.rating) || 0))
      }

      // Tri par nombre d'avis / votes (NOUVEAU)
      if (this.sortBy === 'votes-desc') {
        return list.sort((a, b) => (Number(b.imdb?.votes) || 0) - (Number(a.imdb?.votes) || 0))
      }
      if (this.sortBy === 'votes-asc') {
        return list.sort((a, b) => (Number(a.imdb?.votes) || 0) - (Number(b.imdb?.votes) || 0))
      }

      // Tri par titre
      if (this.sortBy === 'title-asc') {
        return list.sort((a, b) => a.title.localeCompare(b.title))
      }
      if (this.sortBy === 'title-desc') {
        return list.sort((a, b) => b.title.localeCompare(a.title))
      }

      // Tri par année
      if (this.sortBy === 'year-asc') {
        return list.sort((a, b) => a.year - b.year)
      }

      return list
    },
  },

  components: {
    MovieCard,
    AppPagination,
  },

  mounted() {
    this.fetchMovies()
    this.fetchGenres()
  },
}
</script>

<template>
  <!-- Barre de filtres rétro -->
  <div class="vhs-filter-bar">
    <!-- Recherche par titre -->
    <div class="filter-group search-group">
      <input
        v-model="searchTitle"
        @input="onFilterChange"
        type="text"
        placeholder="RECHERCHER UNE CASSETTE (ex: Night Owls...)"
        class="vcr-filter-input"
      />

      <!-- Sélecteur de tri -->
      <div class="filter-group sort-group">
        <select v-model="sortBy" class="vcr-filter-select">
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

    <!-- Filtre par genre -->
    <div class="filter-group genre-group">
      <select v-model="selectedGenre" @change="onFilterChange" class="vcr-filter-select">
        <option value="">★ TOUS LES RAYONS (TOUS GENRES) ★</option>
        <option v-for="g in genres" :key="g.id" :value="g.id">★ Rayon {{ g.label }}</option>
      </select>
    </div>
  </div>
  <div class="movies-view">
    <h2>Rayon Cassettes</h2>
    <h3 v-if="loading">Chargement de la bande en cours...</h3>
    <p v-else-if="error" style="color: #ff007f">{{ error }}</p>
    <div v-else class="movies-grid">
      <MovieCard v-for="movie in sortedMovies" :key="movie.id" :movie="movie" />
    </div>
    <AppPagination
      v-if="!loading && totalItems > 0"
      :currentPage="currentPage"
      :totalItems="totalItems"
      :itemsPerPage="12"
      @change-page="fetchMovies"
    />
  </div>
</template>

<style scoped>
.movies-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.vhs-filter-bar {
  display: flex;
  gap: 1.5rem;
  margin: 1.5rem 0 2rem;
  padding: 1rem;
  background-color: #12101a;
  border: 2px solid #332652;
  box-shadow: 4px 4px 0px #facc15;
}

.filter-group {
  flex: 1;
}

.vcr-filter-input,
.vcr-filter-select {
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: #05040a;
  color: #facc15;
  border: 2px solid #332652;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 1px;
  outline: none;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.vcr-filter-input:focus,
.vcr-filter-select:focus {
  border-color: #00e5ff;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
}

.vcr-filter-select option {
  background-color: #12101a;
  color: #f8fafc;
}
</style>
