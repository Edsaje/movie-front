import { defineStore } from 'pinia'
import api from '@/api'

export const useAuthStore = defineStore('auth', {
  // ===========================================================================
  // 1. STATE : Données réactives du store
  // ===========================================================================
  state: () => ({
    // Initialisation depuis le stockage local du navigateur pour survivre au rafraîchissement (F5)
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false, // Indicateur de chargement pendant la requête de connexion
    error: null, // Message d'erreur éventuel
  }),

  // ===========================================================================
  // 2. GETTERS : Données dérivées calculées
  // ===========================================================================
  getters: {
    // Renvoie true si un token existe, false sinon
    isAuthenticated: (state) => !!state.token,
    // Nom d'utilisateur de l'adhérent (avec fallback sécurisé si user est null)
    username: (state) => state.user?.username || '',
  },

  // ===========================================================================
  // 3. ACTIONS : Méthodes qui modifient le state
  // ===========================================================================
  actions: {
    /**
     * Envoie les identifiants à l'API Symfony (/api/auth) et stocke le token JWT reçu.
     * @param {string} email
     * @param {string} password
     * @returns {Promise<boolean>}
     */
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        // 1. Requête POST vers notre endpoint Symfony d'authentification
        const response = await api.post('/auth', {
          email,
          password,
        })

        // 2. Récupération du token JWT et de l'objet utilisateur
        const { token, user } = response.data

        // 3. Mise à jour de l'état réactif Pinia
        this.token = token
        this.user = user

        // 4. Sauvegarde dans le localStorage
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))

        return true
      } catch (err) {
        // 5. Gestion fine de l'erreur (401 = mauvais identifiants)
        if (err.response?.status === 401) {
          this.error = 'Identifiants incorrects. Vérifiez votre carte ou votre mot de passe !'
        } else {
          this.error = 'Erreur lors de la connexion au vidéoclub.'
        }
        return false
      } finally {
        this.loading = false
      }
    },

    /**
     * Déconnecte l'utilisateur en réinitialisant Pinia et le localStorage.
     */
    logout() {
      this.token = null
      this.user = null
      this.error = null

      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
