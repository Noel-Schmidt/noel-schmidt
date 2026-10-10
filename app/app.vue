<script setup lang="ts">
import { Volume2, VolumeX } from 'lucide-vue-next'
import { onBeforeUnmount, onMounted, ref } from 'vue'

import ContactLetter from '~/components/ContactLetter.vue'
import { playUiClick, soundsEnabled } from '~/utils/sounds'

const route = useRoute()
const contactOpen = useState('contact-letter-open', () => false)

const tileSize = 34
const tiles = ref<number[]>([])
const tileColumns = ref(1)
const paintedTiles = ref(new Set<number>())
const secretTiles = ref(new Set<number>())
const showSecretStamp = ref(false)
const clickEffects = ref<{ id: number; x: number; y: number }[]>([])
const cursor = ref({
  x: 0,
  y: 0,
  visible: false,
  overTile: false,
  interactive: false,
  pressed: false,
})
let hasFinePointer = false
let nextClickEffectId = 0
const clickEffectTimers = new Map<number, number>()
let secretStampTimer: number | undefined

function resizeTiles() {
  const columns = Math.max(1, Math.ceil(window.innerWidth / (tileSize + 1)))
  const rows = Math.max(1, Math.ceil(window.innerHeight / (tileSize + 1)))
  tileColumns.value = columns
  tiles.value = Array.from({ length: columns * rows }, (_, index) => index)
}

onMounted(() => {
  resizeTiles()
  window.addEventListener('resize', resizeTiles)
  window.addEventListener('pointerdown', createClickEffect)
  window.addEventListener('click', handleUiClick)
  hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  if (hasFinePointer) {
    document.documentElement.classList.add('has-custom-cursor')
    window.addEventListener('pointermove', updateCursor)
    window.addEventListener('pointerdown', pressCursor)
    window.addEventListener('pointerup', releaseCursor)
    window.addEventListener('pointerleave', hideCursor)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeTiles)
  window.removeEventListener('pointerdown', createClickEffect)
  window.removeEventListener('click', handleUiClick)
  window.removeEventListener('pointermove', updateCursor)
  window.removeEventListener('pointerdown', pressCursor)
  window.removeEventListener('pointerup', releaseCursor)
  window.removeEventListener('pointerleave', hideCursor)
  clickEffectTimers.forEach((timer) => window.clearTimeout(timer))
  clickEffectTimers.clear()
  if (secretStampTimer) window.clearTimeout(secretStampTimer)
  document.documentElement.classList.remove('has-custom-cursor')
})

function createClickEffect(event: PointerEvent) {
  if (event.button !== 0) return
  const target = event.target instanceof Element ? event.target : null
  if (!target?.closest('.background-tile, .spray-zone, a, button, [role="button"]')) return

  const id = ++nextClickEffectId
  clickEffects.value = [...clickEffects.value.slice(-7), { id, x: event.clientX, y: event.clientY }]
  const timer = window.setTimeout(() => {
    clickEffects.value = clickEffects.value.filter((effect) => effect.id !== id)
    clickEffectTimers.delete(id)
  }, 420)
  clickEffectTimers.set(id, timer)
}

function handleUiClick(event: MouseEvent) {
  const target = event.target instanceof Element ? event.target : null
  if (!target?.closest('.background-tile, a, button, [role="button"]')) return
  if (!target.closest('.arcade-cabinet')) playUiClick()
}

function toggleSound() {
  soundsEnabled.value = !soundsEnabled.value
}

function openContact() {
  contactOpen.value = true
}

function updateCursor(event: PointerEvent) {
  if (!hasFinePointer || event.pointerType === 'touch') return
  const target = event.target instanceof Element ? event.target : null
  cursor.value = {
    x: event.clientX,
    y: event.clientY,
    visible: true,
    overTile: Boolean(target?.closest('.background-tile, .spray-zone')),
    interactive: Boolean(target?.closest('a, button, [role="button"]')),
    pressed: cursor.value.pressed,
  }
}

function pressCursor() {
  cursor.value.pressed = true
}

function releaseCursor() {
  cursor.value.pressed = false
}

function hideCursor() {
  cursor.value.visible = false
}

function paintTile(tile: number) {
  const nextPaintedTiles = new Set(paintedTiles.value)
  nextPaintedTiles.add(tile)
  paintedTiles.value = nextPaintedTiles

  if (secretTiles.value.size) return

  const columns = tileColumns.value
  const rows = Math.floor(tiles.value.length / columns)
  for (let row = 1; row < rows - 1; row += 1) {
    for (let column = 1; column < columns - 1; column += 1) {
      const center = row * columns + column
      const cross = [center, center - columns, center + columns, center - 1, center + 1]
      if (cross.every((index) => nextPaintedTiles.has(index))) {
        secretTiles.value = new Set(cross)
        showSecretStamp.value = true
        secretStampTimer = window.setTimeout(() => {
          showSecretStamp.value = false
        }, 2400)
        return
      }
    }
  }
}

function paintWhileDragging(tile: number, event: PointerEvent) {
  if (event.buttons === 1) paintTile(tile)
}
</script>

<template>
  <Teleport to="body">
    <span
      v-for="effect in clickEffects"
      :key="effect.id"
      class="click-effect"
      :style="{ left: `${effect.x}px`, top: `${effect.y}px` }"
      aria-hidden="true"
      ><span></span
    ></span>

    <div
      v-if="cursor.visible"
      class="custom-cursor"
      :class="{
        'is-spray-can': cursor.overTile,
        'is-interactive': cursor.interactive,
        'is-pressed': cursor.pressed,
      }"
      :style="{ left: `${cursor.x}px`, top: `${cursor.y}px` }"
      aria-hidden="true"
    >
      <svg v-if="cursor.overTile" viewBox="0 0 52 52" class="cursor-spray" fill="none">
        <path class="spray-particles" d="M5 4l-2-2M10 3V0M3 10H0M14 6l2-2" />
        <g class="spray-can-body">
          <path
            d="m18 17 18 18-8 8-18-18a5.7 5.7 0 0 1 8-8Z"
            fill="#ff5a35"
            stroke="#171714"
            stroke-width="2.4"
          />
          <path
            d="m13 29 8-8 10 10-8 8-10-10Z"
            fill="#f4f0e7"
            stroke="#171714"
            stroke-width="1.6"
          />
          <path d="m16 14 5-5 8 8-5 5-8-8Z" fill="#171714" />
          <path d="m20 10 4-4 5 5-4 4" fill="#e7d84d" stroke="#171714" stroke-width="1.8" />
          <path d="m27 38 5 5-4 4-5-5" fill="#171714" />
        </g>
      </svg>
      <svg v-else viewBox="0 0 34 40" class="cursor-pointer" fill="none">
        <path
          d="M3 2.5 30.5 22l-11.4 1.2-5.6 11.5L3 2.5Z"
          fill="#ff5a35"
          stroke="#171714"
          stroke-width="2.8"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  </Teleport>

  <Transition name="secret-stamp">
    <div v-if="showSecretStamp" class="secret-stamp" role="status" aria-live="polite">
      <span class="secret-stamp-mark" aria-hidden="true">+</span>
      <span>Nice pattern.</span>
    </div>
  </Transition>

  <div class="card-stage" @contextmenu.prevent>
    <div class="tile-field" :style="{ '--tile-columns': tileColumns }" aria-hidden="true">
      <span
        v-for="tile in tiles"
        :key="tile"
        class="background-tile"
        :class="{ 'is-painted': paintedTiles.has(tile), 'is-secret': secretTiles.has(tile) }"
        @pointerdown.prevent="paintTile(tile)"
        @pointerenter="paintWhileDragging(tile, $event)"
      ></span>
    </div>

    <button
      type="button"
      class="sound-toggle"
      :aria-pressed="soundsEnabled"
      :aria-label="soundsEnabled ? 'Mute sounds' : 'Enable sounds'"
      @click="toggleSound"
    >
      <Volume2 v-if="soundsEnabled" aria-hidden="true" />
      <VolumeX v-else aria-hidden="true" />
      <span>{{ soundsEnabled ? 'Sound on' : 'Sound off' }}</span>
    </button>

    <div class="business-card">
      <header class="card-header">
        <NuxtLink to="/" class="wordmark" aria-label="Noel Schmidt — home">
          <span>NOEL SCHMIDT</span>
        </NuxtLink>

        <nav class="card-nav" aria-label="Portfolio">
          <NuxtLink to="/" exact-active-class="is-active">Intro</NuxtLink>
          <NuxtLink to="/about" exact-active-class="is-active">About</NuxtLink>
          <NuxtLink to="/work" exact-active-class="is-active">Work</NuxtLink>
          <button
            type="button"
            class="contact-trigger"
            :class="{ 'is-active': contactOpen }"
            @click="openContact"
          >
            Contact
          </button>
        </nav>
      </header>

      <main class="card-content">
        <Transition name="card-page" mode="out-in">
          <div :key="route.path" class="card-page-content">
            <NuxtPage />
          </div>
        </Transition>
      </main>
    </div>
  </div>
  <ContactLetter v-model:open="contactOpen" />
</template>

<style>
:root {
  --paper: #f4f0e7;
  --paper-shadow: #e9e4d8;
  --ink: #171714;
  --muted-ink: #56554f;
  --orange: #ff5a35;
}

html,
body,
#__nuxt {
  min-height: 100%;
  margin: 0;
}

@media (hover: hover) and (pointer: fine) {
  html.has-custom-cursor,
  html.has-custom-cursor * {
    cursor: none !important;
  }
}

.card-stage {
  position: relative;
  display: grid;
  grid-template-rows: 42px minmax(0, 1fr);
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  place-items: center;
  overflow: hidden;
  padding: 0.4rem 0.8rem 0.8rem;
  background: var(--paper-shadow);
  color: var(--ink);
  -webkit-user-select: none;
  user-select: none;
}

.custom-cursor {
  position: fixed;
  z-index: 1000;
  width: 36px;
  height: 42px;
  pointer-events: none;
  transform: translate(-3px, -3px);
  transition:
    width 160ms ease,
    height 160ms ease,
    filter 160ms ease;
}

.custom-cursor.is-interactive:not(.is-spray-can) {
  filter: drop-shadow(2px 2px 0 var(--orange));
}

.custom-cursor.is-pressed {
  transform: translate(-3px, -3px) scale(0.88);
}

.sound-toggle {
  z-index: 2;
  display: inline-flex;
  min-height: 34px;
  align-items: center;
  justify-self: end;
  gap: 0.4rem;
  border: 1px solid var(--ink);
  background: var(--paper);
  padding: 0 0.65rem;
  color: var(--ink);
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--ink);
  font: inherit;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition:
    transform 150ms ease,
    background-color 150ms ease,
    box-shadow 150ms ease;
}

.sound-toggle:hover {
  transform: translate(-1px, -1px);
  background: var(--orange);
  box-shadow: 3px 3px 0 var(--ink);
}

.sound-toggle svg {
  width: 16px;
  height: 16px;
}

.sound-toggle:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 3px;
}

.secret-stamp {
  position: fixed;
  z-index: 1001;
  right: 1.25rem;
  bottom: 1.25rem;
  display: flex;
  min-height: 46px;
  align-items: center;
  gap: 0.6rem;
  border: 2px solid var(--ink);
  background: var(--paper);
  padding: 0.45rem 0.8rem;
  color: var(--ink);
  box-shadow: 4px 4px 0 var(--orange);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  pointer-events: none;
}

.secret-stamp-mark {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border: 1px solid var(--ink);
  background: var(--orange);
  font-size: 1.2rem;
  line-height: 1;
}

.secret-stamp-enter-active,
.secret-stamp-leave-active {
  transition:
    opacity 180ms ease,
    transform 220ms cubic-bezier(0.2, 0.7, 0.2, 1);
}

.secret-stamp-enter-from,
.secret-stamp-leave-to {
  opacity: 0;
  transform: translateY(8px) rotate(-3deg);
}

.click-effect {
  position: fixed;
  z-index: 999;
  width: 2.2rem;
  height: 2.2rem;
  pointer-events: none;
  transform: translate(-50%, -50%);
  animation: ink-click 380ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

.click-effect::before {
  position: absolute;
  inset: 0.45rem;
  border: 2px solid var(--ink);
  background: var(--orange);
  clip-path: polygon(
    50% 0,
    61% 27%,
    88% 13%,
    75% 40%,
    100% 50%,
    75% 60%,
    88% 87%,
    61% 73%,
    50% 100%,
    39% 73%,
    12% 87%,
    25% 60%,
    0 50%,
    25% 40%,
    12% 13%,
    39% 27%
  );
  content: '';
}

.click-effect::after {
  position: absolute;
  inset: 0.12rem;
  border: 1px solid var(--ink);
  border-radius: 50%;
  content: '';
}

.click-effect > span {
  position: absolute;
  top: 0.05rem;
  right: 0.18rem;
  width: 0.32rem;
  height: 0.32rem;
  border: 1px solid var(--ink);
  border-radius: 50%;
  background: var(--orange);
}

@keyframes ink-click {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.35) rotate(-12deg);
  }
  55% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(4deg);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.35) rotate(12deg);
  }
}

.cursor-pointer,
.cursor-spray {
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.cursor-spray .spray-can-body {
  transform-origin: 27px 27px;
  transition: transform 140ms ease;
}

.cursor-spray .spray-particles {
  stroke: var(--orange);
  stroke-width: 2.2;
  stroke-linecap: round;
  animation: spray-pulse 460ms ease-in-out infinite alternate;
}

.custom-cursor.is-pressed .spray-can-body {
  transform: rotate(-8deg) translate(-1px, 1px);
}

@keyframes spray-pulse {
  from {
    opacity: 0.35;
    transform: translate(1px, 1px);
  }
  to {
    opacity: 1;
    transform: translate(-1px, -1px);
  }
}

.tile-field {
  position: absolute;
  z-index: 0;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(var(--tile-columns), 34px);
  grid-auto-rows: 34px;
  gap: 1px;
  align-content: start;
  justify-content: start;
  background-color: var(--paper);
  background-image:
    linear-gradient(var(--paper-shadow) 1px, transparent 1px),
    linear-gradient(90deg, var(--paper-shadow) 1px, transparent 1px);
  background-size: 35px 35px;
  cursor: crosshair;
  pointer-events: auto;
}

.background-tile {
  background: transparent;
  transition:
    background-color 160ms ease,
    box-shadow 220ms ease;
}

.background-tile:hover {
  z-index: 1;
  background: var(--orange);
  box-shadow: inset 0 0 0 2px #ffb28e;
}

.background-tile:active {
  background: var(--orange);
}

.background-tile.is-painted {
  background: var(--orange);
}

.background-tile.is-secret {
  animation: secret-tile-flash 850ms cubic-bezier(0.2, 0.7, 0.2, 1) both;
}

@keyframes secret-tile-flash {
  0% {
    background: var(--orange);
    box-shadow: inset 0 0 0 2px var(--ink);
    transform: scale(0.78);
  }
  55% {
    background: #e7d84d;
    box-shadow: inset 0 0 0 2px var(--ink);
    transform: scale(1.08);
  }
  100% {
    background: var(--orange);
    box-shadow: inset 0 0 0 0 transparent;
    transform: scale(1);
  }
}

.business-card {
  grid-row: 2;
  position: relative;
  z-index: 1;
  display: flex;
  width: min(1560px, 100%);
  height: min(960px, calc(100dvh - 4rem));
  flex-direction: column;
  border: 1px solid var(--ink);
  background: var(--paper);
  box-shadow: 9px 9px 0 var(--ink);
}

.card-header {
  display: flex;
  min-height: 78px;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid #17171430;
  padding: 0 clamp(1.25rem, 3vw, 3rem);
}

.wordmark {
  display: inline-flex;
  min-height: 44px;
  flex: 0 0 auto;
  align-items: center;
  gap: 0;
  color: var(--ink);
  font-size: 0.82rem;
  font-weight: 850;
  letter-spacing: -0.02em;
  text-decoration: none;
}

.card-nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.card-nav a,
.card-nav .contact-trigger {
  position: relative;
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  padding-inline: 0.9rem;
  color: #69675f;
  font-size: 0.82rem;
  font-weight: 650;
  text-decoration: none;
  transition: color 180ms ease;
}

.card-nav .contact-trigger {
  border: 0;
  background: transparent;
  font-family: inherit;
  cursor: pointer;
}

.card-nav a::after,
.card-nav .contact-trigger::after {
  position: absolute;
  right: 0.9rem;
  bottom: -1px;
  left: 0.9rem;
  height: 2px;
  background: var(--orange);
  content: '';
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 180ms ease;
}

.card-nav a:hover,
.card-nav a.is-active,
.card-nav .contact-trigger:hover,
.card-nav .contact-trigger.is-active {
  color: var(--ink);
}

.card-nav a:hover::after,
.card-nav a.is-active::after,
.card-nav .contact-trigger:hover::after,
.card-nav .contact-trigger.is-active::after {
  transform: scaleX(1);
}

.card-content {
  position: relative;
  display: flex;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

.card-content > * {
  width: 100%;
}

.card-page-content {
  position: relative;
  z-index: 1;
  display: flex;
  min-width: 0;
  min-height: 0;
  width: 100%;
  flex: 1;
}

.card-page-content > * {
  width: 100%;
}

.page-panel {
  display: grid;
  min-width: 0;
  min-height: 0;
  flex: 1;
  grid-template-columns: 1.03fr 0.97fr;
  grid-template-rows: minmax(0, 1fr);
}

.panel-copy {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(2rem, 5vw, 5.5rem);
}

.panel-copy h1,
.panel-copy h2 {
  margin-top: 0.35rem;
  font-size: clamp(3.4rem, 6.3vw, 6.5rem);
  font-weight: 900;
  letter-spacing: -0.075em;
  line-height: 0.87;
}

.panel-copy h1 span,
.panel-copy h2 span {
  color: var(--orange);
}

.panel-copy .lead {
  max-width: 29rem;
  margin-top: 1.5rem;
  color: var(--muted-ink);
  font-size: clamp(0.95rem, 1.2vw, 1.1rem);
  line-height: 1.65;
}

.panel-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1.25rem;
  margin-top: 1.7rem;
}

.primary-action,
.text-action,
.email-action {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  gap: 0.5rem;
  border: 2px solid var(--ink);
  padding: 0 1rem;
  font-size: 0.84rem;
  font-weight: 750;
  text-decoration: none;
  box-shadow: 3px 3px 0 #17171435;
  transition:
    transform 150ms ease,
    color 150ms ease,
    background-color 150ms ease,
    box-shadow 150ms ease;
}

.primary-action {
  background: var(--orange);
  color: var(--ink);
  cursor: pointer;
}

.primary-action:hover,
.text-action:hover,
.email-action:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 #17171435;
  background: var(--orange);
  color: var(--ink);
}

.text-action,
.email-action {
  background: var(--paper);
  color: var(--ink);
}

.primary-action:active,
.text-action:active,
.email-action:active {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #17171435;
}

.project-list {
  width: 100%;
  max-width: 31rem;
  margin-top: 1.5rem;
  border-top: 1px solid #17171435;
  list-style: none;
  padding: 0;
}

.project-row {
  display: flex;
  min-height: 62px;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid #17171435;
  color: var(--ink);
  text-decoration: none;
  transition:
    color 180ms ease,
    padding 180ms ease;
}

a.project-row:hover {
  padding-inline: 0.4rem;
  color: var(--orange);
}

.project-row strong,
.project-row small {
  display: block;
}

.project-row strong {
  font-size: 0.9rem;
}

.project-row small {
  margin-top: 0.2rem;
  color: #77746a;
  font-size: 0.7rem;
}

.card-content a:focus-visible,
.card-nav a:focus-visible,
.card-nav button:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 3px;
}

.card-page-enter-active,
.card-page-leave-active {
  transition:
    opacity 220ms ease,
    transform 220ms ease;
}

.card-page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.card-page-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (hover: none) {
  .background-tile:hover {
    box-shadow: none;
  }
}

@media (max-width: 760px) {
  .card-stage {
    padding: 0.35rem 0.7rem 0.7rem;
  }

  .business-card {
    height: calc(100dvh - 3.7rem);
    box-shadow: 5px 5px 0 var(--ink);
  }

  .card-header {
    min-height: 68px;
    padding-inline: 1.1rem;
  }

  .page-panel {
    grid-template-columns: 1fr 0.78fr;
  }

  .panel-copy {
    padding: 1.6rem;
  }

  .panel-copy h1,
  .panel-copy h2 {
    font-size: clamp(3rem, 7vw, 4.8rem);
  }
}

@media (max-width: 540px) {
  .card-stage {
    padding: 0.25rem 0.5rem 0.5rem;
  }

  .business-card {
    height: calc(100dvh - 3.5rem);
    box-shadow: 3px 3px 0 var(--ink);
  }

  .card-header {
    min-height: 100px;
    flex-wrap: wrap;
    gap: 0;
    padding: 0.4rem 0.8rem 0;
  }

  .wordmark {
    min-height: 38px;
    font-size: 0.72rem;
  }

  .card-nav {
    width: 100%;
    justify-content: space-between;
    gap: 0;
  }

  .card-nav a,
  .card-nav .contact-trigger {
    min-height: 40px;
    flex: 1;
    justify-content: center;
    padding-inline: 0.3rem;
    font-size: 0.74rem;
  }

  .card-nav a::after,
  .card-nav .contact-trigger::after {
    right: 0.4rem;
    left: 0.4rem;
  }

  .page-panel {
    grid-template-columns: 1fr;
    grid-template-rows: minmax(14rem, 1fr) minmax(14rem, 1fr);
  }

  .panel-copy {
    min-height: 0;
    justify-content: center;
    padding: 0.8rem 1.25rem;
  }

  .panel-copy h1,
  .panel-copy h2 {
    margin-top: 0.2rem;
    font-size: clamp(2.5rem, 10vw, 3.6rem);
  }

  .panel-copy .lead {
    max-width: 23rem;
    margin-top: 0.7rem;
    font-size: 0.85rem;
  }

  .panel-actions,
  .project-list {
    margin-top: 0.8rem;
  }

  .project-row {
    min-height: 48px;
  }
}

@media (max-width: 360px) {
  .panel-copy {
    padding-inline: 0.9rem;
  }

  .panel-copy h1,
  .panel-copy h2 {
    font-size: clamp(2.35rem, 10vw, 3rem);
  }
}

@media (max-height: 540px) {
  .card-header {
    min-height: 54px;
  }

  .panel-copy {
    padding-block: 0.7rem;
  }

  .panel-copy h1,
  .panel-copy h2 {
    margin-top: 0.6rem;
    font-size: clamp(2.3rem, 5vw, 3.2rem);
  }

  .panel-copy .lead {
    display: -webkit-box;
    overflow: hidden;
    margin-top: 0.65rem;
    font-size: 0.8rem;
    line-height: 1.4;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .panel-actions,
  .project-list {
    margin-top: 0.7rem;
  }

  .project-row {
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .click-effect {
    display: none;
  }

  .background-tile.is-secret {
    animation: none;
  }

  .spray-particles {
    animation: none;
  }

  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
