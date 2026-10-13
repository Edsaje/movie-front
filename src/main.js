// =============================================================================
// POINT D'ENTRÉE PRINCIPAL DE L'APPLICATION VUE.JS (main.js)
// =============================================================================

import { createApp } from 'vue' // Fonction fondamentale de Vue 3 pour créer une instance d'application
import { createPinia } from 'pinia' // Gestionnaire d'état global réactif (Store)

import App from './App.vue' // Composant racine qui contient le layout (Header, Main, Footer)
import router from './router' // Instance de Vue Router configurée avec nos routes

// 1. Création de l'application Vue à partir du composant racine App
const app = createApp(App)

// 2. Enregistrement des plugins essentiels :
// - Pinia : active la gestion d'état réactive (authStore, etc.) partout dans les composants
app.use(createPinia())
// - Vue Router : active la navigation par URL (<router-link>, <router-view>, $route, $router)
app.use(router)

// 3. Montage de l'application dans la balise HTML <div id="app"></div> du fichier index.html
app.mount('#app')

