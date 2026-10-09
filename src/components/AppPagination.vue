<script>
export default {
  name: 'AppPagination',

  data() {
    return {
      targetPage: '',
    }
  },

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

    jumpToPage() {
      const page = Number(this.targetPage)
      if (page >= 1 && page <= this.totalPages) {
        this.goToPage(page)
        this.targetPage = ''
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

    <!-- Sélecteur de page directe -->
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
