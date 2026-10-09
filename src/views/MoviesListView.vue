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
    }
  },

  methods: {
    async fetchMovies(page = 1) {
      this.loading = true
      this.error = null

      try {
        const response = await api.get(`/movies?itemsPerPage=12&page=${page}`)
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
  },

  components: {
    MovieCard,
    AppPagination,
  },

  mounted() {
    this.fetchMovies()
  },
}
</script>

<template>
  <div class="movies-view">
    <h2>Rayon Cassettes</h2>
    <h3 v-if="loading">Chargement de la bande en cours...</h3>
    <p v-else-if="error" style="color: #ff007f">{{ error }}</p>
    <div v-else class="movies-grid">
      <MovieCard v-for="movie in movies" :key="movie.id" :movie="movie" />
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
</style>
