// =============================================================================
// CONFIGURATION DU ROUTEUR VUE ROUTER (router/index.js)
// =============================================================================

import { createRouter, createWebHistory } from 'vue-router'

// Importation des vues de l'application
import MoviesListView from '@/views/MoviesListView.vue' // Rayon principal des films (catalogue, filtres, tri)
import MovieDetailView from '@/views/MovieDetailView.vue' // Fiche détaillée d'une cassette VHS
import LoginView from '@/views/LoginView.vue' // Formulaire d'identification "Carte Membre"

// Définition de l'instance du routeur
const router = createRouter({
  // Mode HTML5 History : permet d'avoir de vraies URLs propres sans hashtag (ex: /connexion au lieu de /#/connexion)
  history: createWebHistory(import.meta.env.BASE_URL),

  // Table de routage : associe chaque URL (path) à un composant de vue
  routes: [
    {
      path: '/',
      name: 'movies',
      component: MoviesListView, // Page d'accueil / Rayon des films
    },
    {
      // :id est un paramètre d'URL dynamique (accessible dans le composant via this.$route.params.id)
      path: '/movies/:id',
      name: 'movie-detail',
      component: MovieDetailView, // Fiche d'un film spécifique
    },
    {
      path: '/connexion',
      name: 'login',
      component: LoginView, // Page de connexion Carte Membre
    },
  ],
})

export default router

