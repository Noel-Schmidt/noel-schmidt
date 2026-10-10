<script setup lang="ts">
import { ref } from 'vue'

type HighlightPart = 'game' | 'web' | null

const selectedPart = ref<HighlightPart>(null)

function togglePart(part: NonNullable<HighlightPart>) {
  selectedPart.value = selectedPart.value === part ? null : part
}
</script>

<template>
  <section class="about-graphic" aria-label="From games to useful web projects">
    <figure class="graphic-frame">
      <svg
        viewBox="0 0 640 500"
        role="group"
        aria-labelledby="journey-title journey-description"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title id="journey-title">From games to the web</title>
        <desc id="journey-description">
          A blocky game world flows into a browser window, where a cursor selects a tool.
        </desc>

        <rect
          x="18"
          y="18"
          width="604"
          height="464"
          fill="var(--paper)"
          stroke="var(--ink)"
          stroke-width="2"
        />

        <path d="M48 82h544M48 418h544" stroke="var(--ink)" stroke-opacity=".14" />
        <path d="M48 82h92" stroke="var(--orange)" stroke-width="4" />

        <g
          class="game-block"
          :class="{ 'is-selected': selectedPart === 'game' }"
          role="button"
          tabindex="0"
          aria-label="Highlight the block from the game world"
          :aria-pressed="selectedPart === 'game'"
          @click="togglePart('game')"
          @keydown.enter.prevent="togglePart('game')"
          @keydown.space.prevent="togglePart('game')"
        >
          <g stroke="var(--ink)" stroke-width="3" stroke-linejoin="round">
            <path class="block-top" d="m78 194 93-53 94 53-94 54z" fill="var(--paper-shadow)" />
            <path class="block-left" d="m78 194 93 54v112l-93-54z" fill="var(--paper-shadow)" />
            <path class="block-right" d="m171 248 94-54v112l-94 54z" fill="var(--paper)" />
          </g>

          <g class="block-pixels">
            <path d="m104 194 23-13 23 13-23 13z" />
            <path d="m151 167 20-11 20 11-20 12z" />
            <path d="m198 194 21-12 20 12-20 12z" />
            <path d="m101 238 15 9v20l-15-9z" />
            <path d="m129 254 15 9v20l-15-9z" />
            <path d="m194 266 14-8v19l-14 8z" />
            <path d="m222 250 14-8v19l-14 8z" />
          </g>
        </g>

        <g fill="var(--orange)">
          <rect x="285" y="264" width="14" height="14" />
          <rect x="308" y="241" width="12" height="12" />
          <rect x="329" y="220" width="10" height="10" />
          <rect x="300" y="292" width="9" height="9" opacity=".55" />
          <rect x="326" y="274" width="8" height="8" opacity=".55" />
        </g>
        <g fill="var(--ink)" opacity=".35">
          <rect x="281" y="226" width="7" height="7" />
          <rect x="302" y="211" width="6" height="6" />
          <rect x="319" y="310" width="7" height="7" />
          <rect x="342" y="294" width="6" height="6" />
        </g>

        <g
          class="browser-frame"
          :class="{ 'is-selected': selectedPart === 'web' }"
          role="button"
          tabindex="0"
          aria-label="Highlight the browser window"
          :aria-pressed="selectedPart === 'web'"
          @click="togglePart('web')"
          @keydown.enter.prevent="togglePart('web')"
          @keydown.space.prevent="togglePart('web')"
        >
          <rect class="browser-body" x="354" y="132" width="218" height="232" />
          <rect class="browser-toolbar" x="354" y="132" width="218" height="43" />
          <path class="browser-divider" d="M354 175h218" />
          <g class="browser-controls">
            <rect x="372" y="149" width="10" height="10" />
            <rect x="391" y="149" width="10" height="10" opacity=".28" />
            <rect x="410" y="149" width="10" height="10" opacity=".28" />
          </g>

          <rect class="browser-content" x="379" y="201" width="168" height="126" />
          <rect x="395" y="218" width="74" height="10" class="browser-copy" />
          <rect x="395" y="241" width="132" height="7" class="browser-copy" />
          <rect x="395" y="256" width="111" height="7" class="browser-copy" />
          <rect class="browser-action" x="395" y="280" width="68" height="27" />
          <rect class="browser-outline" x="354" y="132" width="218" height="232" />
        </g>

        <path
          class="graphic-cursor"
          d="m475 269 41 47-20 2-9 19z"
          fill="var(--ink)"
          stroke="var(--paper)"
          stroke-width="3"
          stroke-linejoin="round"
        />

        <g fill="var(--orange)">
          <rect x="530" y="394" width="24" height="24" />
          <rect x="557" y="394" width="12" height="12" />
        </g>
        <path d="M78 394h116" stroke="var(--ink)" stroke-width="2" />
        <rect x="78" y="389" width="8" height="10" fill="var(--ink)" />
      </svg>
    </figure>
  </section>
</template>

<style scoped>
.about-graphic {
  display: grid;
  min-width: 0;
  min-height: 0;
  flex: 1;
  place-items: center;
  border-left: 1px solid #17171430;
  background: var(--paper-shadow);
  padding: clamp(1.25rem, 4vw, 3.5rem);
}

.graphic-frame {
  width: 100%;
  max-width: 38rem;
  margin: 0;
}

.graphic-frame svg {
  display: block;
  width: 100%;
  height: auto;
}

.game-block,
.browser-frame {
  cursor: pointer;
  outline: none;
}

.block-top,
.block-left,
.block-right,
.block-pixels,
.browser-toolbar,
.browser-content,
.browser-copy,
.browser-action,
.graphic-cursor {
  transition:
    fill 180ms ease,
    opacity 180ms ease;
}

.block-pixels {
  fill: var(--ink);
  opacity: 0.12;
}

.game-block:hover .block-top,
.game-block:focus-visible .block-top,
.game-block.is-selected .block-top {
  fill: var(--orange);
}

.game-block:hover .block-left,
.game-block:focus-visible .block-left,
.game-block.is-selected .block-left {
  fill: #ff5a3525;
}

.game-block:hover .block-right,
.game-block:focus-visible .block-right,
.game-block.is-selected .block-right {
  fill: #ff5a3515;
}

.game-block:hover .block-pixels,
.game-block:focus-visible .block-pixels,
.game-block.is-selected .block-pixels {
  fill: var(--orange);
  opacity: 0.72;
}

.block-top,
.block-left,
.block-right {
  transition:
    fill 180ms ease,
    stroke 180ms ease;
}

.game-block:focus-visible .block-top,
.browser-frame:focus-visible .browser-outline {
  stroke: var(--orange);
  stroke-width: 5px;
}

.browser-body {
  fill: var(--paper);
}

.browser-toolbar,
.browser-content {
  fill: var(--paper-shadow);
}

.browser-divider {
  stroke: var(--ink);
  stroke-width: 3;
}

.browser-controls {
  fill: var(--ink);
}

.browser-copy {
  fill: var(--ink);
  opacity: 0.16;
}

.browser-action {
  fill: var(--paper);
  stroke: var(--ink);
  stroke-width: 2;
}

.browser-outline {
  fill: none;
  stroke: var(--ink);
  stroke-width: 3;
  stroke-linejoin: round;
}

.browser-frame:hover .browser-toolbar,
.browser-frame:focus-visible .browser-toolbar,
.browser-frame.is-selected .browser-toolbar,
.browser-frame:hover .browser-action,
.browser-frame:focus-visible .browser-action,
.browser-frame.is-selected .browser-action {
  fill: var(--orange);
}

.browser-frame:hover .browser-content,
.browser-frame:focus-visible .browser-content,
.browser-frame.is-selected .browser-content {
  fill: #ff5a3525;
}

.browser-frame:hover ~ .graphic-cursor,
.browser-frame:focus-visible ~ .graphic-cursor,
.browser-frame.is-selected ~ .graphic-cursor {
  fill: var(--orange);
}

@media (max-width: 760px) {
  .about-graphic {
    padding: 1.25rem;
  }
}

@media (max-width: 540px) {
  .about-graphic {
    min-height: 0;
    border-top: 1px solid #17171430;
    border-left: 0;
    padding: 0.8rem 1rem 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .block-top,
  .block-left,
  .block-right,
  .block-pixels,
  .browser-toolbar,
  .browser-content,
  .browser-copy,
  .browser-action,
  .graphic-cursor {
    transition: none;
  }
}
</style>
