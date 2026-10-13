<script>
// =============================================================================
// IMPORTS
// =============================================================================
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'LoginView',

  // ===========================================================================
  // 1. DATA : Saisie de l'adhérent
  // ===========================================================================
  data() {
    return {
      email: '',
      password: '',
    }
  },

  // ===========================================================================
  // 2. COMPUTED : Lecture réactive de l'état du store Pinia
  // ===========================================================================
  computed: {
    // Instance du store d'authentification
    authStore() {
      return useAuthStore()
    },
    // Indicateur de chargement (désactive le bouton pendant la requête)
    loading() {
      return this.authStore.loading
    },
    // Message d'erreur renvoyé par l'API
    error() {
      return this.authStore.error
    },
  },

  // ===========================================================================
  // 3. METHODS : Actions de connexion
  // ===========================================================================
  methods: {
    /**
     * Déclenché lors de la soumission du formulaire.  
     */
    async handleSubmit() {
      if (!this.email || !this.password) return

      // Appel de l'action `login` de notre store Pinia
      const success = await this.authStore.login(this.email, this.password)

      // Si la connexion a réussi, on redirige l'adhérent vers le rayon des films
      if (success) {
        this.$router.push('/')
      }
    },

    /**
     * Outil pratique : pré-remplit les identifiants valides de l'API en un clic.  
     */
    fillDemoCredentials() {
      this.email = 'test1@test.com'
      this.password = 'password'
    },
  },

  // ===========================================================================
  // 4. LIFECYCLE HOOKS
  // ===========================================================================
  mounted() {
    // Si l'utilisateur est déjà connecté, pas besoin de se reconnecter : redirection accueil
    if (this.authStore.isAuthenticated) {
      this.$router.replace('/')
    }
  },
}
</script>

<template>
  <div class="login-page">
    <!-- CONTENEUR EFFET "CARTE D'ADHÉRENT VHS" -->
    <div class="member-card">
      <!-- Bande magnétique rétro -->
      <div class="magnetic-strip">
        <span class="strip-text">RETRO-MAGNETIC STRIP • RETRO-MAGNETIC STRIP</span>
      </div>

      <!-- En-tête de la carte -->
      <div class="card-header">
        <div class="card-title-group">
          <span class="vhs-badge">MEMBRE OFFICIEL</span>
          <h2 class="card-title">CARTE D'ADHÉRENT DU VIDÉOCLUB</h2>
        </div>
        <div class="chip-graphic">📼</div>
      </div>

      <!-- Message d'erreur VCR -->
      <div v-if="error" class="vcr-error-box">
        <span class="error-icon">⚠️</span>
        <span>{{ error }}</span>
      </div>

      <!-- Formulaire de connexion -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Champ Email -->
        <div class="form-group">
          <label for="email" class="form-label">
            <span class="label-neon">★</span> ADRESSE ÉLECTRONIQUE (EMAIL)
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="ex: jean.dupont@retro.fr"
            class="vcr-input"
            :disabled="loading"
          />
        </div>

        <!-- Champ Mot de passe -->
        <div class="form-group">
          <label for="password" class="form-label">
            <span class="label-neon">★</span> CODE SECRET (MOT DE PASSE)
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••••••"
            class="vcr-input"
            :disabled="loading"
          />
        </div>

        <!-- Bouton de soumission / insertion de carte -->
        <button type="submit" class="insert-card-btn" :disabled="loading">
          <span v-if="loading">📼 LECTURE DE LA CARTE EN COURS...</span>
          <span v-else>► INSÉRER LA CARTE (S'IDENTIFIER)</span>
        </button>
      </form>

      <!-- Puce de test d'identifiants de démonstration -->
      <div class="demo-box">
        <span class="demo-title">★ ACCÈS DE DÉMONSTRATION ★</span>
        <p class="demo-desc">Cliquez pour pré-remplir la carte d'adhérent n°1 :</p>
        <button type="button" @click="fillDemoCredentials" class="demo-fill-btn">
          ⚡ Pré-remplir avec test1@test.com
        </button>
      </div>

      <!-- Pied de carte -->
      <div class="card-footer">
        <span>CLUB N° 8492-VHS</span>
        <span>VALABLE À VIE</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* =============================================================================                                                                                                       
       PAGE & MISE EN PAGE CENTRÉE                                                                                                                                                         
       ============================================================================= */
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
}

/* =============================================================================                                                                                                       
       LA CARTE MEMBRE (Boîtier vintage plastifié)                                                                                                                                         
       ============================================================================= */
.member-card {
  width: 100%;
  max-width: 540px;
  background-color: #12101a;
  border: 3px solid #00e5ff; /* Liseré cyan néon */
  box-shadow: 8px 8px 0px #ff007f; /* Ombre dure décalée rose synthwave */
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

/* Bande magnétique noire en haut de la carte */
.magnetic-strip {
  background-color: #05040a;
  border: 1px solid #2a243d;
  padding: 0.4rem;
  margin: -2rem -2rem 1.5rem -2rem;
  text-align: center;
}

.strip-text {
  font-family: 'VT323', monospace;
  font-size: 0.9rem;
  color: #4b5563;
  letter-spacing: 4px;
}

/* En-tête de la carte */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px dashed #facc15;
  padding-bottom: 1.2rem;
  margin-bottom: 1.8rem;
}

.vhs-badge {
  display: inline-block;
  background-color: #ff007f;
  color: #ffffff;
  font-family: 'VT323', monospace;
  font-size: 1.1rem;
  padding: 0.1rem 0.6rem;
  letter-spacing: 2px;
  margin-bottom: 0.3rem;
}

.card-title {
  font-family: 'VT323', monospace;
  font-size: 1.8rem;
  color: #facc15;
  letter-spacing: 2px;
  text-shadow: 0 0 6px rgba(250, 204, 21, 0.5);
}

.chip-graphic {
  font-size: 2.5rem;
  filter: drop-shadow(0 0 8px rgba(0, 229, 255, 0.6));
}

/* Message d'erreur VCR clignotant */
.vcr-error-box {
  background-color: rgba(255, 0, 127, 0.15);
  border: 2px solid #ff007f;
  color: #ff007f;
  padding: 0.8rem 1rem;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
  box-shadow: 3px 3px 0px #facc15;
}

/* Formulaire */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 1px;
  color: #00e5ff;
}

.label-neon {
  color: #facc15;
}

/* Inputs rétro */
.vcr-input {
  width: 100%;
  padding: 0.8rem 1rem;
  background-color: #05040a;
  color: #f8fafc;
  border: 2px solid #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.4rem;
  letter-spacing: 1px;
  outline: none;
  transition: all 0.2s;
}

.vcr-input:focus {
  border-color: #facc15;
  box-shadow: 3px 3px 0px #ff007f;
}

/* Bouton principal "Insérer la carte" */
.insert-card-btn {
  background-color: #05040a;
  color: #00e5ff;
  border: 2px solid #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.5rem;
  letter-spacing: 2px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: all 0.15s;
  text-shadow: 0 0 5px rgba(0, 229, 255, 0.5);
}

.insert-card-btn:hover:not(:disabled) {
  background-color: #ff007f;
  color: #ffffff;
  border-color: #ff007f;
  box-shadow: 4px 4px 0px #facc15;
  transform: translate(-2px, -2px);
  text-shadow: none;
}

.insert-card-btn:active:not(:disabled) {
  background-color: #facc15;
  color: #05040a;
  border-color: #facc15;
  box-shadow: 2px 2px 0px #ff007f;
  transform: translate(0px, 0px);
}

.insert-card-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Encadré d'identifiants démo */
.demo-box {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #090711;
  border: 1px dashed #facc15;
  text-align: center;
}

.demo-title {
  display: block;
  font-family: 'VT323', monospace;
  font-size: 1.2rem;
  color: #facc15;
  letter-spacing: 2px;
  margin-bottom: 0.3rem;
}

.demo-desc {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 0.8rem;
}

.demo-fill-btn {
  background-color: #12101a;
  color: #facc15;
  border: 1px solid #facc15;
  font-family: 'VT323', monospace;
  font-size: 1.1rem;
  padding: 0.4rem 1rem;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.15s;
}

.demo-fill-btn:hover {
  background-color: #facc15;
  color: #05040a;
  box-shadow: 2px 2px 0px #00e5ff;
}

/* Pied de carte */
.card-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #2a243d;
  font-family: 'VT323', monospace;
  font-size: 1rem;
  color: #64748b;
  letter-spacing: 2px;
}
</style>
