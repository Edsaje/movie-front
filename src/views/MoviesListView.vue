<script>
import api from '@/api'
import MovieCard from '@/components/MovieCard.vue'

export default {
  name: 'MoviesListView',
  data() {
    return {
      movies: [],
      loading: false,
      error: null,
    }
  },

  components: {
    MovieCard,
  },

  methods: {
    async fetchMovies() {
      this.loading = true
      this.error = null

      try {
        const response = await api.get('/movies?itemsPerPage=12&page=1')
        console.log('Données reçues : ', response.data)
        this.movies = response.data.member
      } catch (err) {
        this.error = 'Impossible de charger les films du vidéoclub'
        console.error(err)
      } finally {
        this.loading = false
      }
    },
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
