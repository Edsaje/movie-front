<script>
export default {
  name: 'AppPagination',

  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    itemsPerPage: {
      type: Number,
      default: 12,
    },
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalItems / this.itemsPerPage) || 1
    },
  },

  methods: {
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.$emit('change-page', page)
      }
    },
  },
}
</script>

<template>
  <div class="vhs-pagination">
    <!-- Rembobinage au tout début -->
    <button class="vcr-btn" :disabled="currentPage <= 1" @click="goToPage(1)">◀◀ DEBUT</button>

    <!-- Page précédente -->
    <button class="vcr-btn" :disabled="currentPage <= 1" @click="goToPage(currentPage - 1)">
      ◀ PREV
    </button>

    <!-- Compteur digital façon affichage LED de magnétoscope -->
    <div class="vcr-counter">
      <span class="counter-label">BANDE :</span>
      <span class="counter-digits">{{ currentPage }} / {{ totalPages }}</span>
      <span class="counter-total">({{ totalItems.toLocaleString() }} FILMS)</span>
    </div>

    <!-- Page suivante -->
    <button
      class="vcr-btn"
      :disabled="currentPage >= totalPages"
      @click="goToPage(currentPage + 1)"
    >
      NEXT ▶
    </button>

    <!-- Avance rapide jusqu'à la fin -->
    <button class="vcr-btn" :disabled="currentPage >= totalPages" @click="goToPage(totalPages)">
      FIN ▶▶
    </button>
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
  background-color: #1f1b2e;
  color: #facc15;
  border: 2px solid #facc15;
  padding: 0.6rem 1rem;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 3px 3px 0px #000;
  transition: all 0.1s;
}

.vcr-btn:hover:not(:disabled) {
  background-color: #facc15;
  color: #0b0914;
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0px #00e5ff;
}

.vcr-btn:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 1px 1px 0px #000;
}

.vcr-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: #475569;
  color: #64748b;
  box-shadow: none;
}

/* Compteur type afficheur digital vert/cyan rétro */
.vcr-counter {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background-color: #05040a;
  border: 2px solid #00e5ff;
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
  color: #facc15;
  font-size: 1.1rem;
}
</style>
