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
      alphabet: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      selectedLetter: '',
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

        if (this.selectedLetter) {
          params.letter = this.selectedLetter
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
      this.selectedLetter = ''
    },

    selectLetter(letter) {
      this.selectedLetter = letter
      this.searchTitle = ''
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
    <h3 v-if="loading" class="loading-message">📼 CHARGEMENT DE LA BANDE EN COURS...</h3>
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
  border: 2px solid #facc15;
  box-shadow: 4px 4px 0px #ff007f;
}

.filter-group {
  flex: 1;
}

.vcr-filter-input,
.vcr-filter-select {
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: #05040a;
  color: #00e5ff;
  border: 2px solid #332652;
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

.vcr-filter-input:focus,
.vcr-filter-select:focus {
  border-color: #facc15;
  box-shadow: 3px 3px 0px #ff007f;
}

.vcr-filter-select option {
  background-color: #12101a;
  color: #f8fafc;
}

.loading-message {
  color: #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
  letter-spacing: 2px;
  text-align: center;
  margin: 3rem 0;
}

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
  border: 2px solid #332652;
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
