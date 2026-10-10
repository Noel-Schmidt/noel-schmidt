<script setup lang="ts">
import { Info, RotateCcw } from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref } from 'vue'

import { playGameSound } from '~/utils/sounds'

const roundLength = 25
const patterns = [
  [1, 4, 5, 6, 9, 10, 13],
  [0, 3, 5, 6, 9, 10, 12, 15],
  [1, 2, 4, 7, 8, 11, 13, 14],
  [0, 1, 4, 7, 10, 13, 14, 15],
]
const patternIndex = ref(0)
const painted = ref<number[]>([])
const completed = ref(0)
const timeLeft = ref(roundLength)
const isPlaying = ref(false)
const hasPlayed = ref(false)
const gameOver = ref(false)
const showInfo = ref(false)
const targetPattern = computed(() => patterns[patternIndex.value] ?? patterns[0]!)
const timerProgress = computed(() => `${(timeLeft.value / roundLength) * 100}%`)
const roundNumber = computed(() => String(completed.value + 1).padStart(2, '0'))
let timer: ReturnType<typeof setInterval> | undefined

function startGame() {
  if (timer) clearInterval(timer)
  playGameSound('start')
  gameOver.value = false
  patternIndex.value = Math.floor(Math.random() * patterns.length)
  painted.value = []
  completed.value = 0
  timeLeft.value = roundLength
  isPlaying.value = true
  hasPlayed.value = true
  timer = setInterval(() => {
    timeLeft.value -= 1
    if (timeLeft.value <= 0) endGame()
  }, 1000)
}

function togglePaint(index: number) {
  if (!isPlaying.value) return
  const isPainted = painted.value.includes(index)
  const nextPainted = isPainted
    ? painted.value.filter((tile) => tile !== index)
    : [...painted.value, index]
  painted.value = nextPainted

  if (
    nextPainted.length === targetPattern.value.length &&
    targetPattern.value.every((tile) => nextPainted.includes(tile))
  ) {
    playGameSound('complete')
    completed.value += 1
    patternIndex.value = (patternIndex.value + 1) % patterns.length
    painted.value = []
  } else {
    playGameSound(
      isPainted ? 'erase' : targetPattern.value.includes(index) ? 'paint' : 'miss',
      index
    )
  }
}

function endGame() {
  if (timer) clearInterval(timer)
  timer = undefined
  isPlaying.value = false
  gameOver.value = true
  playGameSound('timeout')
}

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="tile-mini-game" aria-label="Tile painting game">
    <div class="arcade-cabinet" :class="{ 'is-playing': isPlaying }">
      <header class="arcade-hud">
        <div class="round-stamp"
          ><small>ROUND</small><strong>{{ roundNumber }}</strong></div
        >
        <div class="score-mark"
          ><small>WALLS</small><strong>{{ String(completed).padStart(2, '0') }}</strong></div
        >
        <div class="timer-mark" :style="{ '--timer-progress': timerProgress }" aria-live="polite">
          <span
            ><strong>{{ timeLeft }}</strong
            ><small>SEC</small></span
          >
        </div>
        <div class="info-wrap">
          <button
            type="button"
            class="game-info"
            :aria-expanded="showInfo"
            aria-controls="game-instructions"
            aria-label="How to play"
            @click="showInfo = !showInfo"
            ><Info aria-hidden="true"
          /></button>
          <Transition name="info-pop">
            <div v-if="showInfo" id="game-instructions" class="info-popover" role="status">
              Match the orange pattern on the left. Tap or spray across the tiles on the right.
              Finish one to reveal the next.
            </div>
          </Transition>
        </div>
      </header>

      <div class="game-canvases">
        <div class="canvas-wrap">
          <span class="canvas-label">Stencil</span>
          <div class="game-board stencil-board" role="img" aria-label="Stencil pattern to copy">
            <span
              v-for="index in 16"
              :key="index"
              class="game-cell"
              :class="{ 'is-target': targetPattern.includes(index - 1) }"
            />
          </div>
        </div>
        <span class="canvas-arrow" aria-hidden="true">&rarr;</span>
        <div class="canvas-wrap wall-wrap">
          <span class="canvas-label">Wall</span>
          <div
            class="game-board paint-board"
            role="group"
            aria-label="Paint board. Select tiles to match the stencil."
          >
            <button
              v-for="index in 16"
              :key="index"
              type="button"
              class="game-cell spray-zone"
              :class="{ 'is-painted': painted.includes(index - 1) }"
              :disabled="!isPlaying"
              :aria-label="`Tile ${index}${painted.includes(index - 1) ? ', painted' : ''}`"
              @pointerdown.prevent="togglePaint(index - 1)"
              @pointerenter="
                (event) => {
                  if (event.buttons === 1) togglePaint(index - 1)
                }
              "
              @click="
                (event) => {
                  if (event.detail === 0) togglePaint(index - 1)
                }
              "
            />
          </div>
          <Transition name="ready-stamp">
            <div v-if="!isPlaying" class="ready-stamp" aria-hidden="true">
              <strong>{{ hasPlayed ? 'TIME!' : 'READY?' }}</strong>
            </div>
          </Transition>
        </div>
      </div>

      <footer class="arcade-controls">
        <button
          type="button"
          class="game-start"
          :class="{ 'is-playing': isPlaying }"
          :aria-label="isPlaying ? 'Restart round' : hasPlayed ? 'Play again' : 'Play'"
          @click="startGame"
        >
          <svg v-if="!isPlaying" class="play-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
          <RotateCcw v-else aria-hidden="true" />
        </button>
      </footer>

      <Transition name="game-over">
        <section v-if="gameOver" class="game-over-screen" role="status" aria-live="polite">
          <span class="game-over-kicker">TIME'S UP</span>
          <strong class="game-over-score">{{ String(completed).padStart(2, '0') }}</strong>
          <span class="game-over-caption">{{ completed === 1 ? 'wall' : 'walls' }} painted</span>
          <button type="button" class="game-over-restart" @click="startGame">
            Play again <RotateCcw aria-hidden="true" />
          </button>
        </section>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.tile-mini-game {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #17171430;
  background: var(--paper-shadow);
  padding: clamp(1.25rem, 4vw, 3.5rem);
}

.arcade-cabinet {
  position: relative;
  display: flex;
  width: min(100%, 31rem);
  flex-direction: column;
  border: 2px solid var(--ink);
  background: var(--paper);
  box-shadow: 7px 7px 0 #17171425;
  transition:
    box-shadow 180ms ease,
    transform 180ms ease;
}

.game-over-screen {
  position: absolute;
  z-index: 4;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  border: 2px solid var(--ink);
  background: var(--paper);
  color: var(--ink);
}

.game-over-kicker {
  color: var(--muted-ink);
  font-size: 0.65rem;
  font-weight: 850;
  letter-spacing: 0.14em;
}

.game-over-score {
  color: var(--orange);
  font-size: clamp(4.5rem, 10vw, 7rem);
  font-weight: 950;
  letter-spacing: -0.09em;
  line-height: 0.9;
  text-shadow: 3px 3px 0 var(--ink);
}

.game-over-caption {
  font-size: 0.8rem;
  font-weight: 750;
}

.game-over-restart {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.65rem;
  border: 2px solid var(--ink);
  background: var(--orange);
  padding: 0 0.9rem;
  color: var(--ink);
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--ink);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  transition:
    transform 140ms ease,
    box-shadow 140ms ease;
}

.game-over-restart:hover {
  transform: translate(-2px, -2px);
  box-shadow: 5px 5px 0 var(--ink);
}

.game-over-restart svg {
  width: 16px;
  height: 16px;
}

.game-over-restart:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 3px;
}

.game-over-enter-active,
.game-over-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}

.game-over-enter-from,
.game-over-leave-to {
  opacity: 0;
  transform: scale(0.97);
}

.arcade-cabinet.is-playing {
  box-shadow: 8px 8px 0 #ff5a3555;
  transform: translate(-1px, -1px);
}

.arcade-hud {
  display: flex;
  min-height: 58px;
  align-items: center;
  gap: clamp(0.55rem, 2vw, 1.2rem);
  border-bottom: 2px solid var(--ink);
  background: var(--paper-shadow);
  padding: 0.45rem 0.75rem;
}

.round-stamp {
  display: flex;
  min-width: 3.6rem;
  align-items: center;
  gap: 0.4rem;
  border-right: 1px solid #17171445;
  padding-right: 0.7rem;
}

.round-stamp small,
.score-mark small {
  color: var(--muted-ink);
  font-size: 0.52rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.round-stamp strong,
.score-mark strong {
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.score-mark {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}
.timer-mark {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  margin-left: auto;
  border-radius: 50%;
  background: conic-gradient(var(--orange) var(--timer-progress), #17171420 0);
  font-variant-numeric: tabular-nums;
}
.timer-mark > span {
  display: flex;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--paper-shadow);
}
.timer-mark strong {
  font-size: 0.75rem;
}
.timer-mark small {
  margin-left: 0.1rem;
  font-size: 0.42rem;
  font-weight: 800;
}

.info-wrap {
  position: relative;
  z-index: 2;
}
.game-info {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid var(--ink);
  border-radius: 50%;
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--orange);
  transition:
    transform 150ms ease,
    box-shadow 150ms ease;
}
.game-info:hover {
  transform: translate(-1px, -1px) rotate(-8deg);
  box-shadow: 3px 3px 0 var(--orange);
}
.game-info svg {
  width: 17px;
  height: 17px;
  stroke-width: 2.5;
}
.game-info:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 3px;
}
.info-popover {
  position: absolute;
  top: calc(100% + 0.65rem);
  right: 0;
  width: min(16rem, 70vw);
  border: 1px solid var(--ink);
  background: var(--paper);
  padding: 0.8rem;
  color: var(--ink);
  box-shadow: 4px 4px 0 #17171425;
  font-size: 0.7rem;
  line-height: 1.45;
}
.info-popover::before {
  position: absolute;
  top: -5px;
  right: 12px;
  width: 8px;
  height: 8px;
  border-top: 1px solid var(--ink);
  border-left: 1px solid var(--ink);
  background: var(--paper);
  content: '';
  transform: rotate(45deg);
}
.info-pop-enter-active,
.info-pop-leave-active {
  transition:
    opacity 130ms ease,
    transform 130ms ease;
}
.info-pop-enter-from,
.info-pop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.game-canvases {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.45rem, 2vw, 1.1rem);
  padding: clamp(0.75rem, 2vw, 1.15rem) 0.5rem;
}

.canvas-wrap {
  position: relative;
  display: grid;
  gap: 0.4rem;
}
.wall-wrap {
  transform: rotate(1.5deg);
  transition: transform 180ms ease;
}
.wall-wrap:hover {
  transform: rotate(0deg) scale(1.025);
}
.canvas-label {
  color: var(--muted-ink);
  font-size: 0.62rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.game-board {
  display: grid;
  width: clamp(6rem, 14vw, 9.5rem);
  aspect-ratio: 1;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 3px;
  padding: 4px;
  border: 2px solid var(--ink);
  background: var(--ink);
  box-shadow: 3px 3px 0 #17171420;
}

.game-cell {
  min-width: 0;
  min-height: 0;
  border: 0;
  background: var(--paper);
}

.stencil-board .is-target {
  background: var(--orange);
  animation: stencil-flicker 2.4s ease-in-out infinite alternate;
}
.stencil-board .is-target:nth-child(3n) {
  animation-delay: -0.8s;
}

.paint-board .game-cell {
  cursor: crosshair;
  transition:
    background-color 100ms ease,
    transform 130ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.paint-board .game-cell:disabled {
  cursor: default;
}
.paint-board .game-cell:not(:disabled):hover {
  transform: scale(0.87) rotate(-3deg);
}
.paint-board .game-cell.is-painted {
  background: var(--orange);
  animation: paint-hit 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.paint-board .game-cell:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: -3px;
}
.canvas-arrow {
  color: var(--orange);
  font-size: 1.5rem;
  font-weight: 900;
  text-shadow: 1px 1px 0 var(--ink);
}

.ready-stamp {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  min-width: 4.8rem;
  min-height: 2rem;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  border: 2px solid var(--ink);
  background: var(--orange);
  padding: 0.25rem 0.5rem;
  box-shadow: 3px 3px 0 var(--ink);
  color: var(--ink);
  transform: translate(-50%, -50%) rotate(-8deg);
  pointer-events: none;
}
.ready-stamp strong {
  font-size: 0.8rem;
  font-weight: 950;
  letter-spacing: 0.04em;
}
.ready-stamp-enter-active,
.ready-stamp-leave-active {
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}
.ready-stamp-enter-from,
.ready-stamp-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(5deg) scale(0.75);
}

.arcade-controls {
  display: flex;
  min-height: 58px;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-top: 2px solid var(--ink);
  background: #171714;
  padding: 0.5rem 0.75rem;
}

.game-start {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border: 2px solid var(--ink);
  background: var(--orange);
  padding: 0;
  color: var(--ink);
  cursor: pointer;
  border-radius: 50%;
  box-shadow:
    3px 3px 0 var(--paper),
    5px 5px 0 #ff5a3555;
  transition:
    background-color 150ms ease,
    transform 150ms ease,
    box-shadow 150ms ease;
}
.game-start svg {
  width: 23px;
  height: 23px;
  stroke-width: 2.5;
}
.game-start .play-icon {
  fill: currentColor;
  stroke: none;
}

.game-start:hover {
  transform: translate(-2px, -2px) rotate(-2deg);
  box-shadow: 5px 5px 0 var(--paper);
}
.game-start:active {
  transform: translate(1px, 1px) scale(0.97);
  box-shadow: 1px 1px 0 var(--paper);
}
.game-start:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 3px;
}

@keyframes stencil-flicker {
  from {
    opacity: 0.78;
  }
  to {
    opacity: 1;
  }
}
@keyframes paint-hit {
  from {
    transform: scale(0.65) rotate(-8deg);
  }
  to {
    transform: scale(1) rotate(0);
  }
}
@media (max-width: 760px) {
  .tile-mini-game {
    padding: 1.25rem;
  }
  .game-board {
    width: clamp(6.5rem, 19vw, 8.5rem);
  }
}

@media (max-width: 540px) {
  .tile-mini-game {
    border-top: 1px solid #17171430;
    border-left: 0;
    padding: 0.6rem 0.8rem;
  }
  .arcade-hud {
    min-height: 43px;
    gap: 0.5rem;
    padding: 0.3rem 0.5rem;
  }
  .round-stamp {
    min-width: 2.9rem;
    gap: 0.25rem;
    padding-right: 0.45rem;
  }
  .round-stamp small,
  .score-mark small {
    font-size: 0.43rem;
  }
  .round-stamp strong,
  .score-mark strong {
    font-size: 0.78rem;
  }
  .timer-mark {
    width: 34px;
    height: 34px;
  }
  .timer-mark > span {
    width: 28px;
    height: 28px;
  }
  .timer-mark strong {
    font-size: 0.62rem;
  }
  .timer-mark small {
    font-size: 0.35rem;
  }
  .game-info {
    width: 28px;
    height: 28px;
  }
  .game-info svg {
    width: 13px;
    height: 13px;
  }
  .game-canvases {
    gap: 0.45rem;
    padding: 0.6rem 0.35rem;
  }
  .game-board {
    width: min(23vw, 6.5rem);
    gap: 2px;
    padding: 3px;
  }
  .canvas-wrap {
    gap: 0.2rem;
  }
  .canvas-label {
    font-size: 0.48rem;
  }
  .canvas-arrow {
    font-size: 1rem;
  }
  .arcade-controls {
    min-height: 43px;
    padding: 0.3rem 0.5rem;
  }
  .game-start {
    width: 36px;
    height: 36px;
  }
  .game-start svg {
    width: 19px;
    height: 19px;
  }
  .info-popover {
    right: -0.3rem;
    width: min(13rem, 72vw);
    font-size: 0.62rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .arcade-cabinet,
  .wall-wrap,
  .paint-board .game-cell,
  .game-start,
  .game-info,
  .game-over-enter-active,
  .game-over-leave-active,
  .game-over-restart,
  .stencil-board .is-target,
  .paint-board .game-cell.is-painted,
  .ready-stamp-enter-active,
  .ready-stamp-leave-active,
  .info-pop-enter-active,
  .info-pop-leave-active {
    animation: none;
    transition: none;
  }
}
</style>
