<script>
export default {
  name: 'App',
}
</script>

<template>
  <div class="vhs-app">
    <!-- Barre de navigation style Enseigne Vidéoclub -->
    <header class="vhs-header">
      <div class="vhs-brand">
        <router-link to="/" class="vhs-logo">
          <span class="vhs-icon">📼</span>
          <span class="vhs-title">CONTRESENS<span class="highlight">CRITIQUE</span></span>
        </router-link>
        <span class="vhs-slogan"
          >★ BE KIND, REWIND ★ (ça veut dire "soyez aimable, rembobinez")</span
        >
      </div>

      <nav class="vhs-nav">
        <router-link to="/" class="vhs-link">Rayon Films</router-link>
        <router-link to="/connexion" class="vhs-btn-card"> Carte Membre </router-link>
      </nav>
    </header>

    <!-- Contenu principal -->
    <main class="vhs-main">
      <router-view />
    </main>

    <!-- Footer rétro stylisé -->
    <footer class="vhs-footer">
      <p>
        <span class="footer-highlight">★ RETROVIDÉO CLUB ★</span>
        Ouvert 7j/7 & 24h/24 • Retour des cassettes avant 19h •
        <span class="footer-neon">MERCI DE REMBOBINER VOS BANDES 📼</span>
      </p>
    </footer>
  </div>
</template>

<style>
/* Reset & Import police rétro */
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;700;900&family=VT323&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family:
    'Chakra Petch',
    -apple-system,
    sans-serif;
  background-color: #0b0914;
  color: #f1f5f9;
  /* Léger effet scanlines de téléviseur cathodique */
  background-image: linear-gradient(rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0.2) 50%);
  background-size: 100% 4px;
}

.vhs-app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header style Enseigne néon */
.vhs-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 3rem;
  background-color: #12101a;
  border-bottom: 3px solid #facc15;
  box-shadow: 0 3px 0px #ff007f;
}

.vhs-brand {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.vhs-logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
  font-weight: 900;
  font-size: 1.8rem;
  letter-spacing: 2px;
  color: #ffffff;
  text-transform: uppercase;
}

.vhs-title .highlight {
  color: #facc15;
  text-shadow: 0 0 10px rgba(250, 204, 21, 0.6);
}

.vhs-slogan {
  font-family: 'VT323', monospace;
  color: #00e5ff;
  font-size: 1.1rem;
  letter-spacing: 3px;
  text-shadow: 0 0 5px rgba(0, 229, 255, 0.6);
}

/* Liens de navigation */
.vhs-nav {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.vhs-link {
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
  transition: all 0.2s;
}

.vhs-link:hover {
  color: #facc15;
  text-shadow: 0 0 8px #facc15;
}

/* Bouton Carte Membre rétro */
.vhs-btn-card {
  background-color: #05040a;
  color: #00e5ff !important;
  text-decoration: none;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 2px;
  text-shadow: 0 0 4px rgba(0, 229, 255, 0.5);
  border: 2px solid #00e5ff;
  padding: 0.4rem 1.2rem;
  text-transform: uppercase;
  transition: all 0.15s;
}

.vhs-btn-card:hover {
  background-color: #ff007f;
  color: #ffffff !important;
  border-color: #ff007f;
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0px #facc15;
  text-shadow: none;
}

.vhs-btn-card:active {
  background-color: #facc15;
  color: #0b0914 !important;
  border-color: #facc15;
  transform: translate(-2px, -2px);
  box-shadow: 3px 3px 0px #ff007f;
}

/* Contenu principal */
.vhs-main {
  flex: 1;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 2.5rem 2rem;
}

/* Footer rétro */
.vhs-footer {
  text-align: center;
  padding: 1.5rem 2rem;
  background-color: #12101a;
  border-top: 3px solid #facc15;
  box-shadow: 0 -3px 0px #ff007f;
  color: #00e5ff;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  letter-spacing: 2px;
  text-shadow: 0 0 5px rgba(0, 229, 255, 0.4);
}

.footer-highlight {
  color: #facc15;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(250, 204, 21, 0.6);
  margin-right: 0.5rem;
}

.footer-neon {
  color: #ff007f;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(255, 0, 127, 0.6);
  margin-left: 0.5rem;
}
</style>
