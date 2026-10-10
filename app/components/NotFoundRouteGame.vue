<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const tileCount = 16
const homeTile = ref(-1)
const checkedTiles = ref(new Set<number>())
const foundHome = ref(false)
const hint = ref('Tap a tile to look for the route home.')
let previousDistance: number | null = null

const checkedCount = computed(() => checkedTiles.value.size)

onMounted(() => {
  homeTile.value = Math.floor(Math.random() * tileCount)
})

function guess(index: number) {
  if (homeTile.value < 0 || foundHome.value || checkedTiles.value.has(index)) return

  const nextChecked = new Set(checkedTiles.value)
  nextChecked.add(index)
  checkedTiles.value = nextChecked

  if (index === homeTile.value) {
    foundHome.value = true
    hint.value = 'Route found. You’re back on track!'
    return
  }

  const rowDistance = Math.abs(Math.floor(index / 4) - Math.floor(homeTile.value / 4))
  const columnDistance = Math.abs((index % 4) - (homeTile.value % 4))
  const distance = rowDistance + columnDistance

  if (previousDistance === null) hint.value = 'Not that tile. Try another one.'
  else if (distance < previousDistance) hint.value = 'Warmer! Keep going.'
  else if (distance > previousDistance) hint.value = 'Colder! Try another direction.'
  else hint.value = 'About the same. Try nearby.'

  previousDistance = distance
}
</script>

<template>
  <section class="route-hunt" aria-labelledby="route-hunt-title">
    <header class="hunt-header">
      <h2 id="route-hunt-title">Find the way home</h2>
      <span>{{ checkedCount.toString().padStart(2, '0') }} / 16</span>
    </header>

    <div class="hunt-board" role="group" aria-label="Sixteen tiles. One hides the route home.">
      <button
        v-for="tile in tileCount"
        :key="tile"
        type="button"
        class="hunt-tile"
        :class="{
          'is-checked': checkedTiles.has(tile - 1),
          'is-home': foundHome && homeTile === tile - 1,
        }"
        :disabled="checkedTiles.has(tile - 1) || foundHome"
        :aria-label="`Tile ${tile}${foundHome && homeTile === tile - 1 ? ', route home found' : checkedTiles.has(tile - 1) ? ', checked' : ''}`"
        :aria-pressed="checkedTiles.has(tile - 1)"
        @click="guess(tile - 1)"
      >
        <span v-if="foundHome && homeTile === tile - 1" aria-hidden="true">⌂</span>
        <span v-else-if="checkedTiles.has(tile - 1)" aria-hidden="true">×</span>
      </button>
    </div>

    <p class="sr-only" aria-live="polite">{{ hint }}</p>
    <NuxtLink v-if="foundHome" class="home-found-link" to="/">Take me home</NuxtLink>
  </section>
</template>

<style scoped>
.route-hunt {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #17171430;
  background: var(--paper-shadow);
  padding: clamp(1.25rem, 4vw, 3.5rem);
}

.hunt-header {
  display: flex;
  width: min(100%, 21rem);
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.8rem;
}

.hunt-header h2 {
  margin: 0;
  font-size: 1rem;
  font-weight: 850;
  letter-spacing: -0.045em;
}

.hunt-header > span {
  color: var(--muted-ink);
  font-size: 0.65rem;
  font-variant-numeric: tabular-nums;
}

.hunt-board {
  display: grid;
  width: min(100%, 21rem);
  grid-template-columns: repeat(4, minmax(44px, 1fr));
  gap: clamp(0.35rem, 1.4vw, 0.65rem);
  padding: 0.65rem;
  border: 2px solid var(--ink);
  background: var(--ink);
  box-shadow: 6px 6px 0 #17171424;
}

.hunt-tile {
  display: grid;
  min-width: 0;
  min-height: 44px;
  aspect-ratio: 1;
  place-items: center;
  border: 0;
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  font: inherit;
  font-size: 1.5rem;
  font-weight: 900;
  transition:
    background-color 140ms ease,
    color 140ms ease,
    transform 140ms ease;
}

.hunt-tile:not(:disabled):hover {
  transform: scale(0.88) rotate(-3deg);
  background: var(--orange);
}

.hunt-tile.is-checked {
  background: var(--paper-shadow);
  color: var(--muted-ink);
}

.hunt-tile.is-home {
  background: var(--orange);
  color: var(--ink);
  animation: home-tile-found 260ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.hunt-tile:focus-visible {
  position: relative;
  z-index: 1;
  outline: 3px solid var(--orange);
  outline-offset: -4px;
}

.home-found-link {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  margin-top: 0.3rem;
  border: 2px solid var(--ink);
  background: var(--orange);
  padding-inline: 0.9rem;
  color: var(--ink);
  box-shadow: 3px 3px 0 #17171435;
  font-size: 0.78rem;
  font-weight: 800;
  text-decoration: none;
}

.home-found-link:hover {
  transform: translate(-1px, -1px);
  box-shadow: 4px 4px 0 #17171435;
}

.home-found-link:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 3px;
}

@keyframes home-tile-found {
  from {
    transform: scale(0.65) rotate(-8deg);
  }
  to {
    transform: scale(1) rotate(0);
  }
}

@media (max-width: 760px) {
  .route-hunt {
    border-top: 1px solid #17171430;
    border-left: 0;
    padding: 1.25rem;
  }
}

@media (max-width: 540px) {
  .route-hunt {
    padding: 1rem 1.25rem 1.25rem;
  }

  .hunt-board {
    width: min(100%, 17rem);
    gap: 0.35rem;
    padding: 0.45rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hunt-tile,
  .hunt-tile.is-home,
  .home-found-link {
    animation: none;
    transition: none;
  }
}
</style>
