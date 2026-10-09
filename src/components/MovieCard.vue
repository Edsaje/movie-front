<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <div class="vhs-tape-box">
    <!-- Macaron "DISPO EN RAYON" collé de travers -->
    <div class="vhs-sticker">★ DISPO ★</div>

    <!-- Affiche du film -->
    <div class="poster-frame">
      <img v-if="movie.poster" :src="movie.poster" :alt="movie.title" />
      <div v-else class="no-poster">IMAGE NON DISPO</div>
    </div>

    <!-- Les 3 bandes de couleur vintage (JVC / Kodak style) -->
    <div class="vhs-stripes">
      <span class="stripe-red"></span>
      <span class="stripe-orange"></span>
      <span class="stripe-yellow"></span>
    </div>

    <!-- Étiquette de la cassette avec police matricielle -->
    <div class="tape-label">
      <h3 class="tape-title">{{ movie.title }}</h3>
      <div class="tape-meta">
        <span class="tape-year">ANNEE: {{ movie.year }}</span>
        <span class="tape-rating">⭐ {{ movie.imdb?.rating || '?' }}/10 </span>
      </div>
      <div class="tape-footer">
        <span class="tape-genres">
          {{
            movie.genres
              ?.map((g) => g.label)
              .slice(0, 2)
              .join(' • ') || 'TOUS PUBLICS'
          }}
        </span>
        <span class="tape-votes">
          {{ movie.imdb?.votes ? Number(movie.imdb.votes).toLocaleString() + ' AVIS' : '0 AVIS' }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Le boîtier de cassette noir épais */
.vhs-tape-box {
  position: relative;
  background-color: #12101a;
  border: 3px solid #facc15;
  border-radius: 0px;
  overflow: hidden;
  /* Ombre dure 90s rose fluo (pas de flou !) */
  box-shadow: 6px 6px 0px #ff007f;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  cursor: pointer;
}

.vhs-tape-box:hover {
  transform: translate(-3px, -3px);
  box-shadow: 9px 9px 0px #00e5ff; /* Ombre passe en bleu cyan au survol */
}

/* L'étiquette fluo */
.vhs-sticker {
  position: absolute;
  top: 10px;
  right: -5px;
  background: #ff007f;
  color: #ffffff;
  font-family: 'VT323', monospace;
  font-size: 1.1rem;
  padding: 2px 10px;
  transform: rotate(6deg);
  border: 1px solid #ffffff;
  box-shadow: 2px 2px 0px #000;
  z-index: 2;
  font-weight: bold;
}

/* Cadre de l'affiche */
.poster-frame {
  width: 100%;
  height: 340px;
  background: #000;
  border-bottom: 2px solid #332652;
}

.poster-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.no-poster {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'VT323', monospace;
  font-size: 1.3rem;
  color: #e11d48;
  background: #0b0914;
}

/* Les 3 bandes vintage */
.vhs-stripes {
  display: flex;
  height: 6px;
}
.stripe-red {
  flex: 1;
  background-color: #e11d48;
}
.stripe-orange {
  flex: 1;
  background-color: #f97316;
}
.stripe-yellow {
  flex: 1;
  background-color: #facc15;
}

/* L'étiquette collée au bas de la cassette */
.tape-label {
  background-color: #f8fafc;
  color: #0f172a;
  padding: 0.8rem;
  border-top: 1px solid #94a3b8;
}

.tape-title {
  font-family: 'VT323', monospace;
  font-size: 1.5rem;
  font-weight: 900;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: 1px;
}

.tape-meta {
  display: flex;
  justify-content: space-between;
  font-family: 'VT323', monospace;
  font-size: 1.2rem;
  margin-top: 0.2rem;
  color: #334155;
  font-weight: bold;
}

.tape-rating {
  color: #b45309;
}

.tape-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.65rem;
  color: #64748b;
  margin-top: 0.4rem;
  padding-top: 0.3rem;
  border-top: 1px dashed #cbd5e1;
  font-weight: 700;
  letter-spacing: 1px;
}
</style>
