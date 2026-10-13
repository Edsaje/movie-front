<script>
// =============================================================================
// COMPOSANT FICHE DÉTAILLÉE D'UN FILM (MovieDetailView.vue)
// Affiche toutes les informations d'une cassette VHS spécifique :
// Affiche HD, durée, genres, synopsis, réalisateurs, acteurs, et critiques du club.
// =============================================================================

import api from '@/api' // Client HTTP Axios configuré
import { useAuthStore } from '@/stores/auth' // Store Pinia pour vérifier l'adhérent connecté

export default {
  name: 'MovieDetailView',

  // ===========================================================================
  // 1. DATA : État local
  // ===========================================================================
  data() {
    return {
      // Données du film
      movie: null,
      loading: true,
      error: null,
      imageError: false,

      // Données des critiques du club
      reviews: [], // Liste des avis reçus de /api/movies/{id}/reviews
      loadingReviews: false, // Indicateur de chargement des avis
      newReviewContent: '', // Texte de la nouvelle critique en cours de frappe
      submittingReview: false, // Indicateur d'envoi en cours
      reviewError: null, // Message d'erreur éventuel lors de l'envoi
      reviewSuccess: false, // Notification de succès temporaire
    }
  },

  // ===========================================================================
  // 2. COMPUTED : Lecture réactive du store
  // ===========================================================================
  computed: {
    authStore() {
      return useAuthStore()
    },
  },

  // ===========================================================================
  // 3. METHODS : Récupération des données et actions
  // ===========================================================================
  methods: {
    /**
     * Interroge l'API Symfony (/api/movies/{id}) pour charger le film sélectionné.  
     */
    async fetchMovieDetails() {
      this.loading = true
      this.error = null

      try {
        const movieId = this.$route.params.id
        const response = await api.get(`/movies/${movieId}`)
        this.movie = response.data
      } catch (err) {
        this.error = 'Impossible de retrouver cette VHS dans les archives du vidéoclub'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    /**
     * Récupère la liste des avis d'adhérents pour ce film (/api/movies/{id}/reviews).  
     */
    async fetchReviews() {
      this.loadingReviews = true
      try {
        const movieId = this.$route.params.id
        const response = await api.get(`/movies/${movieId}/reviews`)
        this.reviews = response.data.member || []
      } catch (err) {
        console.error('Erreur chargement critiques :', err)
      } finally {
        this.loadingReviews = false
      }
    },

    /**
     * Envoie une nouvelle critique pour ce film via POST /api/reviews.  
     */
    async submitReview() {
      // Sécurité : ne rien envoyer si le texte est vide ou si l'utilisateur n'est pas connecté
      if (!this.newReviewContent.trim() || !this.authStore.isAuthenticated) return

      this.submittingReview = true
      this.reviewError = null
      this.reviewSuccess = false

      try {
        const movieId = this.$route.params.id
        const payload = {
          content: this.newReviewContent.trim(),
          movie: `/api/movies/${movieId}`,
          user: `/api/users/${this.authStore.user.id}`,
        }

        // L'intercepteur Axios ajoute automatiquement l'en-tête Authorization: Bearer <token>
        const response = await api.post('/reviews', payload)

        // Ajout immédiat au début de la liste sans recharger toute la page
        this.reviews.unshift(response.data)

        // Réinitialisation du formulaire et affichage du message de succès
        this.newReviewContent = ''
        this.reviewSuccess = true

        // Efface le message de succès après 4 secondes
        setTimeout(() => {
          this.reviewSuccess = false
        }, 4000)
      } catch (err) {
        this.reviewError = "Impossible d'enregistrer votre critique. Veuillez réessayer !"
        console.error(err)
      } finally {
        this.submittingReview = false
      }
    },

    /**
     * Formate une date ISO en format lisible français (ex: 13/10/2026 à 10:25).  
     * @param {string} dateStr  
     */
    formatDate(dateStr) {
      if (!dateStr) return ''
      const date = new Date(dateStr)
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    /**
     * Bouton retour intelligent avec conservation de l'historique de recherche/filtres.  
     */
    goBack() {
      if (window.history.length > 1) {
        this.$router.back()
      } else {
        this.$router.push('/')
      }
    },
  },

  // ===========================================================================
  // 4. LIFECYCLE HOOKS
  // ===========================================================================
  mounted() {
    this.fetchMovieDetails()
    this.fetchReviews()
  },
}
</script>

<template>
  <div class="movie-detail-view">
    <!-- Bouton de retour au rayon films avec conservation de l'historique -->
    <button @click="goBack" class="vcr-back-btn">◀ RETOUR AU RAYON FILMS</button>

    <!-- Message de chargement rétro -->
    <div v-if="loading" class="detail-loading">📼 LECTURE DE LA VHS EN COURS...</div>

    <!-- Message d'erreur en cas de film introuvable -->
    <div v-else-if="error" class="detail-error">
      {{ error }}
    </div>

    <!-- Fiche détaillée complète du film -->
    <div v-else-if="movie" class="movie-detail-card">
      <!-- Colonne gauche : Grande affiche du film -->
      <div class="detail-poster">
        <img
          v-if="movie.poster && !imageError"
          :src="movie.poster"
          :alt="movie.title"
          @error="imageError = true"
        />
        <div v-else class="no-poster">IMAGE NON DISPO</div>
      </div>

      <!-- Colonne droite : Informations complètes -->
      <div class="detail-info">
        <!-- Titre principal -->
        <h1 class="detail-title">{{ movie.title }}</h1>

        <!-- Titre original s'il diffère du titre français -->
        <p
          class="detail-original-title"
          v-if="movie.originalTitle && movie.originalTitle !== movie.title"
        >
          Titre original : {{ movie.originalTitle }}
        </p>

        <!-- Badges d'informations rapides (Année, Durée, Note, Avis) -->
        <div class="detail-badges">
          <span class="vhs-badge">ANNÉE : {{ movie.year || '?' }}</span>
          <span class="vhs-badge" v-if="movie.duration">DURÉE : {{ movie.duration }} MIN</span>
          <span class="vhs-badge highlight"> ⭐ NOTE : {{ movie.imdb?.rating || '?' }} / 10 </span>
          <span class="vhs-badge" v-if="movie.imdb?.votes">
            AVIS : {{ Number(movie.imdb.votes).toLocaleString() }}
          </span>
        </div>

        <!-- Étiquettes des genres / rayons -->
        <div class="detail-genres" v-if="movie.genres?.length">
          <span class="genre-tag" v-for="genre in movie.genres" :key="genre.id">
            ★ {{ genre.label }}
          </span>
        </div>

        <!-- Synopsis du film -->
        <div class="detail-section">
          <h3>SYNOPSIS / INTRIGUE</h3>
          <p class="detail-plot">{{ movie.plot || 'Aucun résumé disponible sur la jaquette.' }}</p>
        </div>

        <!-- Équipe de réalisation -->
        <div class="detail-section" v-if="movie.directors?.length">
          <h3>RÉALISATION</h3>
          <p>{{ movie.directors.map((d) => d.fullName).join(', ') }}</p>
        </div>

        <!-- Distribution / Acteurs -->
        <div class="detail-section" v-if="movie.castMembers?.length">
          <h3>DISTRIBUTION</h3>
          <p>{{ movie.castMembers.map((a) => a.fullName).join(', ') }}</p>
        </div>
      </div>
    </div>
    <!-- =======================================================================                                                                                                       
             SECTION CRITIQUES DU VIDÉOCLUB                                                                                                                                                
             ======================================================================= -->
    <section v-if="movie" class="reviews-section">
      <!-- En-tête de la section -->
      <div class="reviews-header">
        <h2 class="reviews-title">
          📼 LE LIVRE D'OR DU VIDÉOCLUB
          <span class="reviews-count">({{ reviews.length }} AVIS)</span>
        </h2>
      </div>

      <!-- CAS 1 : ADHÉRENT CONNECTÉ -> Formulaire de rédaction -->
      <div v-if="authStore.isAuthenticated" class="review-form-card">
        <h3 class="form-title">★ LAISSER VOTRE AVIS D'ADHÉRENT ({{ authStore.username }}) ★</h3>

        <form @submit.prevent="submitReview" class="review-form">
          <textarea
            v-model="newReviewContent"
            placeholder="Donnez votre avis sur cette cassette (état de la bande, intrigue, jeu d'acteurs...)"
            rows="3"
            required
            class="review-textarea"
            :disabled="submittingReview"
          ></textarea>

          <div class="form-actions">
            <button
              type="submit"
              class="vcr-submit-review-btn"
              :disabled="submittingReview || !newReviewContent.trim()"
            >
              <span v-if="submittingReview">📼 ENREGISTREMENT SUR LA BANDE...</span>
              <span v-else>► ENREGISTRER MA CRITIQUE</span>
            </button>

            <!-- Notification de succès temporaire -->
            <span v-if="reviewSuccess" class="review-success-msg">
              ✓ CRITIQUE ENREGISTRÉE SUR LA BANDE !
            </span>
            <!-- Alerte d'erreur -->
            <span v-if="reviewError" class="review-error-msg"> ⚠️ {{ reviewError }} </span>
          </div>
        </form>
      </div>

      <!-- CAS 2 : NON CONNECTÉ -> Invitation à insérer la Carte Membre -->
      <div v-else class="review-login-prompt">
        <span class="prompt-icon">🔒</span>
        <div class="prompt-text">
          <p class="prompt-title">ACCÈS RÉSERVÉ AUX ADHÉRENTS</p>
          <p class="prompt-desc">
            Vous devez être muni de votre Carte Membre pour laisser une critique sur cette cassette.
          </p>
        </div>
        <router-link to="/connexion" class="vcr-prompt-btn">
          ► INSÉRER MA CARTE MEMBRE
        </router-link>
      </div>

      <!-- LISTE DES CRITIQUES -->
      <div v-if="loadingReviews" class="reviews-loading">📼 CHARGEMENT DES AVIS D'ADHÉRENTS...</div>

      <!-- Si aucun avis n'existe encore -->
      <div v-else-if="reviews.length === 0" class="no-reviews">
        <p class="no-reviews-title">★ AUCUNE CRITIQUE POUR LE MOMENT ★</p>
        <p class="no-reviews-desc">
          Soyez le premier adhérent à laisser votre empreinte sur cette bande !
        </p>
      </div>

      <!-- Affichage des avis sous forme de fiches de prêt rétro -->
      <div v-else class="reviews-list">
        <div v-for="rev in reviews" :key="rev.id" class="review-item">
          <div class="review-item-header">
            <span class="review-user">📼 ADHÉRENT : {{ rev.user?.username || 'Anonyme' }}</span>
            <span class="review-date">{{ formatDate(rev.createdAt) }}</span>
          </div>
          <p class="review-content">{{ rev.content }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.movie-detail-view {
  max-width: 1200px;
  margin: 0 auto;
}

.vcr-back-btn {
  display: inline-block;
  background-color: #05040a;
  color: #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 2px;
  text-shadow: 0 0 4px rgba(0, 229, 255, 0.5);
  border: 2px solid #00e5ff;
  padding: 0.4rem 1.2rem;
  text-transform: uppercase;
  text-decoration: none;
  margin-bottom: 2rem;
  transition: all 0.15s;
  cursor: pointer;
}

.vcr-back-btn:hover {
  background-color: #ff007f;
  color: #ffffff;
  border-color: #ff007f;
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0px #facc15;
  text-shadow: none;
}

.vcr-back-btn:active {
  background-color: #facc15;
  color: #0b0914;
  border-color: #facc15;
  transform: translate(-2px, -2px);
  box-shadow: 3px 3px 0px #ff007f;
}

.movie-detail-card {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 2.5rem;
  background-color: #12101a;
  border: 3px solid #facc15;
  box-shadow: 6px 6px 0px #ff007f;
  padding: 2rem;
}

.detail-poster {
  position: relative;
  width: 100%;
  min-height: 500px;
  background-color: #0b0914;
  border: 3px solid #facc15;
  box-shadow: 6px 6px 0px #ff007f;
  overflow: hidden;
  display: flex;
}

.detail-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.no-poster {
  width: 100%;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'VT323', monospace;
  font-size: 1.6rem;
  color: #e11d48;
  background-color: #0b0914;
  letter-spacing: 2px;
  text-align: center;
  padding: 1rem;
}

.detail-title {
  font-family: 'VT323', monospace;
  font-size: 3rem;
  color: #facc15;
  text-shadow: 0 0 10px rgba(250, 204, 21, 0.5);
  margin-bottom: 0.5rem;
}

.detail-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin: 1.2rem 0;
}

.vhs-badge {
  background-color: #05040a;
  color: #00e5ff;
  border: 1px solid #00e5ff;
  padding: 0.2rem 0.6rem;
  font-family: 'VT323', monospace;
  font-size: 1.15rem;
  letter-spacing: 1px;
}

.vhs-badge.highlight {
  color: #facc15;
  border-color: #facc15;
}

.detail-section {
  margin-top: 1.5rem;
  border-top: 1px dashed #332652;
  padding-top: 1rem;
}

.detail-section h3 {
  font-family: 'VT323', monospace;
  color: #00e5ff;
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
}

.detail-loading {
  color: #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.8rem;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.8);
  letter-spacing: 2px;
  text-align: center;
  margin: 3rem 0;
}

.detail-error {
  color: #ff007f;
  font-family: 'VT323', monospace;
  font-size: 1.5rem;
  text-align: center;
  margin: 3rem 0;
}

.detail-genres {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin: 0.5rem 0 1rem;
}

.genre-tag {
  background-color: #05040a;
  color: #ff007f;
  border: 1px solid #ff007f;
  font-family: 'VT323', monospace;
  font-size: 1.15rem;
  padding: 0.2rem 0.6rem;
  letter-spacing: 1px;
}

.detail-plot {
  line-height: 1.6;
  font-size: 1.05rem;
  color: #e2e8f0;
}
.reviews-section {
  margin-top: 3rem;
  background-color: #12101a;
  border: 3px solid #00e5ff; /* Liseré cyan néon */
  box-shadow: 6px 6px 0px #ff007f; /* Ombre dure rose */
  padding: 2rem;
}

.reviews-header {
  border-bottom: 2px dashed #facc15;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.reviews-title {
  font-family: 'VT323', monospace;
  font-size: 2rem;
  color: #facc15;
  letter-spacing: 2px;
  text-shadow: 0 0 6px rgba(250, 204, 21, 0.5);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.reviews-count {
  font-size: 1.3rem;
  color: #00e5ff;
}

/* Formulaire d'avis */
.review-form-card {
  background-color: #05040a;
  border: 2px solid #facc15;
  padding: 1.5rem;
  margin-bottom: 2.5rem;
  box-shadow: 3px 3px 0px #ff007f;
}

.form-title {
  font-family: 'VT323', monospace;
  font-size: 1.4rem;
  color: #facc15;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.review-textarea {
  width: 100%;
  padding: 1rem;
  background-color: #0b0914;
  color: #f8fafc;
  border: 2px solid #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 1px;
  resize: vertical;
  outline: none;
  transition: all 0.2s;
}

.review-textarea:focus {
  border-color: #facc15;
  box-shadow: 3px 3px 0px #ff007f;
}

.form-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.vcr-submit-review-btn {
  background-color: #05040a;
  color: #00e5ff;
  border: 2px solid #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.4rem;
  letter-spacing: 1px;
  padding: 0.6rem 1.4rem;
  cursor: pointer;
  transition: all 0.15s;
}

.vcr-submit-review-btn:hover:not(:disabled) {
  background-color: #ff007f;
  color: #ffffff;
  border-color: #ff007f;
  box-shadow: 3px 3px 0px #facc15;
  transform: translate(-1px, -1px);
}

.vcr-submit-review-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.review-success-msg {
  color: #4ade80;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 1px;
}

.review-error-msg {
  color: #ff007f;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
}

/* Invitation de connexion */
.review-login-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #05040a;
  border: 2px dashed #00e5ff;
  padding: 1.2rem 1.8rem;
  margin-bottom: 2.5rem;
  gap: 1.5rem;
}

.prompt-icon {
  font-size: 2rem;
}

.prompt-text {
  flex: 1;
}

.prompt-title {
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  color: #facc15;
  letter-spacing: 1px;
}

.prompt-desc {
  font-size: 0.95rem;
  color: #94a3b8;
}

.vcr-prompt-btn {
  background-color: #05040a;
  color: #00e5ff;
  border: 2px solid #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 1px;
  padding: 0.5rem 1.2rem;
  text-decoration: none;
  transition: all 0.15s;
  white-space: nowrap;
}

.vcr-prompt-btn:hover {
  background-color: #ff007f;
  color: #ffffff;
  border-color: #ff007f;
  box-shadow: 2px 2px 0px #facc15;
  transform: translate(-1px, -1px);
}

/* Liste des critiques */
.reviews-loading,
.no-reviews {
  text-align: center;
  padding: 2.5rem 1rem;
  font-family: 'VT323', monospace;
  color: #94a3b8;
}

.reviews-loading {
  color: #00e5ff;
  font-size: 1.5rem;
}

.no-reviews-title {
  font-size: 1.5rem;
  color: #facc15;
  letter-spacing: 1px;
  margin-bottom: 0.4rem;
}

.no-reviews-desc {
  font-size: 1.1rem;
  color: #64748b;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.review-item {
  background-color: #05040a;
  border: 1px solid #2a243d;
  border-left: 4px solid #facc15; /* Liseré doré vintage */
  padding: 1.2rem;
  box-shadow: 3px 3px 0px #000;
}

.review-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed #2a243d;
  padding-bottom: 0.5rem;
  margin-bottom: 0.8rem;
  font-family: 'VT323', monospace;
  font-size: 1.2rem;
}

.review-user {
  color: #00e5ff;
  letter-spacing: 1px;
}

.review-date {
  color: #64748b;
  font-size: 1rem;
}

.review-content {
  color: #f1f5f9;
  font-size: 1.05rem;
  line-height: 1.5;
  white-space: pre-line;
}
</style>
