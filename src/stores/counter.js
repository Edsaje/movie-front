// =============================================================================
// STORE PINIA EXEMPLE : COMPTEUR (counter.js)
// Démontre la syntaxe "Setup Store" (Composition API avec ref et computed)
// par opposition à la syntaxe "Options Store" utilisée dans auth.js.
// =============================================================================

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  // State : variable réactive ref(0)
  const count = ref(0)

  // Getter : propriété calculée computed()
  const doubleCount = computed(() => count.value * 2)

  // Action : fonction qui modifie l'état
  function increment() {
    count.value++
  }

  // Tout ce qui est retourné devient accessible aux composants abonnés
  return { count, doubleCount, increment }
})

