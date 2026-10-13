<script>
// =============================================================================
// COMPOSANT DE PAGINATION VCR (AppPagination.vue)
// Affiche les commandes de transport de bande (DÉBUT, PRÉCÉDENT, SUIVANT, FIN)
// et l'afficheur digital du compteur de cassettes.
// =============================================================================

export default {
  name: 'AppPagination',

  // ===========================================================================
  // 1. DATA : État local
  // ===========================================================================
  data() {
    return {
      // Valeur saisie dans le champ "ALLER À" pour le saut direct de page
      targetPage: '',
    }
  },

  // ===========================================================================
  // 2. PROPS : Données transmises par le parent
  // ===========================================================================
  props: {
    // Page actuelle (1, 2, 3...)
    currentPage: {
      type: Number,
      default: 1,
    },
    // Nombre total d'éléments renvoyés par l'API (totalItems d'Hydra)
    totalItems: {
      type: Number,
      required: true,
    },
    // Nombre d'éléments par page (12 par défaut)
    itemsPerPage: {
      type: Number,
      default: 12,
    },
  },

  // ===========================================================================
  // 3. COMPUTED : Propriétés calculées
  // ===========================================================================
  computed: {
    /**
     * Calcule le nombre total de pages nécessaires.
     * Exemple : 23 539 films / 12 films par page = 1 962 pages.
     */
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage) || 1
    },
  },

  // ===========================================================================
  // 4. METHODS : Déclencheurs d'événements
  // ===========================================================================
  methods: {
    /**
     * Émet l'événement personnalisé 'change-page' vers le parent si la page est valide.
     * Le parent écoute cet événement via @change-page="changePage".
     * @param {number} page
     */
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('change-page', page)
      }
    },

    /**
     * Valide et exécute le saut direct vers la page saisie manuellement.
     */
    jumpToPage() {
      const page = Number(this.targetPage)
      if (page >= 1 && page <= this.totalPages) {
        this.goToPage(page)
        this.targetPage = '' // Réinitialise l'input
      }
    },
  },
}
</script>

<template>
  <div class="vhs-pagination">
    <!-- Rembobinage rapide au début (Page 1) -->
    <button class="vcr-btn" :disabled="currentPage <= 1" @click="goToPage(1)">◀◀ DEBUT</button>

    <!-- Page précédente (Page courante - 1) -->
    <button class="vcr-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
      ◀ PREV
    </button>

    <!-- Compteur digital vert/cyan façon afficheur LED de magnétoscope -->
    <div class="vcr-counter">
      <span class="counter-label">BANDE :</span>
      <span class="counter-digits">{{ currentPage }} / {{ totalPages }}</span>
      <span class="counter-total">({{ totalItems.toLocaleString() }} FILMS)</span>
    </div>

    <!-- Page suivante (Page courante + 1) -->
    <button
      class="vcr-btn"
      :disabled="currentPage >= totalPages"
      @click="goToPage(currentPage + 1)"
    >
      NEXT ▶
    </button>

    <!-- Avance rapide jusqu'à la dernière page -->
    <button class="vcr-btn" :disabled="currentPage >= totalPages" @click="goToPage(totalPages)">
      FIN ▶▶
    </button>

    <!-- Outil de saut direct vers un numéro de page spécifique -->
    <div class="vcr-jump-box">
      <span class="jump-label">ALLER À : </span>
      <input
        v-model.number="targetPage"
        @keyup.enter="jumpToPage"
        type="number"
        :min="1"
        :max="totalPages"
        placeholder="N°"
        class="vcr-jump-input"
      />
      <button class="vcr-jump-btn" @click="jumpToPage">GO ▶</button>
    </div>
  </div>
</template>

<style scoped>
.vhs-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0 2rem;
  padding: 1.2rem;
  background-color: #12101a;
  border: 2px solid #facc15;
  box-shadow: 4px 4px 0px #ff007f;
}

/* Boutons de contrôle style touches de magnétoscope */
.vcr-btn {
  background-color: #05040a;
  color: #00e5ff;
  text-shadow: 0 0 4px rgba(0, 229, 255, 0.5);
  border: 2px solid #00e5ff;
  padding: 0.5rem 1rem;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.15s;
}

.vcr-btn:hover:not(:disabled) {
  background-color: #ff007f;
  color: #ffffff;
  border-color: #ff007f;
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0px #facc15;
  text-shadow: none;
}

.vcr-btn:active:not(:disabled) {
  background-color: #facc15;
  color: #0b0914;
  border-color: #facc15;
  transform: translate(-2px, -2px);
  box-shadow: 3px 3px 0px #ff007f;
}

.vcr-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: #332652;
  color: #64748b;
  text-shadow: none;
  box-shadow: none;
}

/* Compteur type afficheur digital vert/cyan rétro */
.vcr-counter {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: #05040a;
  border: 2px solid #facc15;
  padding: 0.5rem 1.2rem;
  font-family: 'VT323', monospace;
  box-shadow: inset 0 0 8px rgba(0, 229, 255, 0.4);
}

.counter-label {
  color: #94a3b8;
  font-size: 1.2rem;
}

.counter-digits {
  color: #00e5ff;
  font-size: 1.8rem;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 0 0 6px #00e5ff;
}

.counter-total {
  color: #00e5ff;
  font-size: 1.1rem;
}

.vcr-jump-box {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-left: 1.5rem;
  padding: 0.4rem 0.8rem;
  background-color: #05040a;
  border: 2px solid #facc15;
  box-shadow: 3px 3px 0px #ff007f;
}

.jump-label {
  font-family: 'VT323', monospace;
  color: #00e5ff;
  font-size: 1.2rem;
  letter-spacing: 1px;
  text-shadow: 0 0 4px rgba(0, 229, 255, 0.5);
}

.vcr-jump-input {
  width: 70px;
  padding: 0.3rem 0.5rem;
  background-color: #12101a;
  color: #00e5ff;
  border: 2px solid #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  text-align: center;
  outline: none;
  text-shadow: 0 0 6px #00e5ff;
  transition: border-color 0.2s;
}

.vcr-jump-input:focus {
  border-color: #facc15;
}

.vcr-jump-input::placeholder {
  color: rgba(0, 229, 255, 0.4);
}

.vcr-jump-btn {
  background-color: #05040a;
  color: #00e5ff;
  text-shadow: 0 0 4px rgba(0, 229, 255, 0.5);
  border: 2px solid #00e5ff;
  padding: 0.3rem 0.7rem;
  font-family: 'VT323', monospace;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.15s;
}

.vcr-jump-btn:hover {
  background-color: #ff007f;
  color: #ffffff;
  border-color: #ff007f;
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0px #facc15;
  text-shadow: none;
}

.vcr-jump-btn:active {
  background-color: #facc15;
  color: #0b0914;
  border-color: #facc15;
  transform: translate(-2px, -2px);
  box-shadow: 3px 3px 0px #ff007f;
}
</style>
