<script setup lang="ts">
import { ChevronDown, Database, GitBranch, GripVertical } from 'lucide-vue-next'
import {
  siAngular,
  siCloudflare,
  siDocker,
  siDotnet,
  siEslint,
  siFigma,
  siFastify,
  siGit,
  siGitlab,
  siGrafana,
  siHetzner,
  siMongodb,
  siNginx,
  siNestjs,
  siNuxt,
  siPnpm,
  siPrettier,
  siPostgresql,
  siRabbitmq,
  siRedis,
  siRider,
  siSentry,
  siTailwindcss,
  siTrello,
  siTurborepo,
  siTypescript,
  siVite,
  siVuedotjs,
  siVitest,
  siWebstorm,
} from 'simple-icons'
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Tool = {
  id: string
  name: string
  icon: { title: string; hex: string; path: string } | null
  x: number
  y: number
  tilt: number
  zIndex: number
  brandColor?: string
  hasBeenDragged?: boolean
}

type DragState = {
  id: string
  pointerId: number
  offsetX: number
  offsetY: number
  startX: number
  startY: number
}

useSeoMeta({
  title: 'Tools — Noel Schmidt',
  description: 'A few of the tools I use to build for the web.',
})

const defaultTools: Tool[] = (
  [
    { id: 'sentry', name: 'Sentry', icon: siSentry, x: 1, y: 1, tilt: -5 },
    { id: 'nuxt', name: 'Nuxt', icon: siNuxt, x: 20, y: 7, tilt: 4 },
    { id: 'angular', name: 'Angular', icon: siAngular, x: 40, y: 0, tilt: -3 },
    { id: 'pnpm', name: 'PNPM', icon: siPnpm, x: 60, y: 5, tilt: 5 },
    { id: 'docker', name: 'Docker', icon: siDocker, x: 80, y: 2, tilt: 4 },
    { id: 'webstorm', name: 'WebStorm', icon: siWebstorm, x: 5, y: 27, tilt: -4 },
    { id: 'rider', name: 'Rider', icon: siRider, x: 25, y: 23, tilt: 3 },
    { id: 'vue', name: 'Vue', icon: siVuedotjs, x: 46, y: 32, tilt: -5 },
    {
      id: 'typescript',
      name: 'TypeScript',
      icon: siTypescript,
      x: 0,
      y: 53,
      tilt: -3,
    },
    { id: 'csharp', name: 'C#', icon: siDotnet, x: 20, y: 47, tilt: 5 },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      icon: siTailwindcss,
      x: 40,
      y: 58,
      tilt: -4,
    },
    { id: 'git', name: 'Git', icon: siGit, x: 67, y: 25, tilt: -4 },
    { id: 'redis', name: 'Redis', icon: siRedis, x: 82, y: 34, tilt: 4 },
    { id: 'figma', name: 'Figma', icon: siFigma, x: 60, y: 49, tilt: -3 },
    { id: 'postgresql', name: 'PostgreSQL', icon: siPostgresql, x: 80, y: 54, tilt: 3 },
    {
      id: 'microsoft-sql',
      name: 'Microsoft SQL',
      icon: null,
      brandColor: '#cc2927',
      x: 20,
      y: 70,
      tilt: -5,
    },
    { id: 'turborepo', name: 'Turborepo', icon: siTurborepo, x: 60, y: 68, tilt: 4 },
    { id: 'cloudflare', name: 'Cloudflare', icon: siCloudflare, x: 8, y: 16, tilt: 4 },
    { id: 'hetzner', name: 'Hetzner', icon: siHetzner, x: 32, y: 15, tilt: -5 },
    { id: 'eslint', name: 'ESLint', icon: siEslint, x: 53, y: 20, tilt: 3 },
    { id: 'prettier', name: 'Prettier', icon: siPrettier, x: 74, y: 16, tilt: -4 },
    { id: 'trello', name: 'Trello', icon: siTrello, x: 10, y: 41, tilt: -3 },
    {
      id: 'azure-devops',
      name: 'Azure DevOps',
      icon: null,
      brandColor: '#0078d4',
      x: 34,
      y: 41,
      tilt: 5,
    },
    { id: 'gitlab', name: 'GitLab', icon: siGitlab, x: 53, y: 44, tilt: -4 },
    { id: 'nginx', name: 'nginx', icon: siNginx, x: 75, y: 41, tilt: 3 },
    { id: 'rabbitmq', name: 'RabbitMQ', icon: siRabbitmq, x: 7, y: 65, tilt: 5 },
    { id: 'grafana', name: 'Grafana', icon: siGrafana, x: 33, y: 67, tilt: -3 },
    { id: 'mongodb', name: 'MongoDB', icon: siMongodb, x: 75, y: 67, tilt: -5 },
    { id: 'vite', name: 'Vite', icon: siVite, x: 12, y: 12, tilt: 4 },
    { id: 'vitest', name: 'Vitest', icon: siVitest, x: 37, y: 12, tilt: -4 },
    { id: 'fastify', name: 'Fastify', icon: siFastify, x: 62, y: 12, tilt: 3 },
    { id: 'nestjs', name: 'NestJS', icon: siNestjs, x: 86, y: 12, tilt: -5 },
  ] satisfies Omit<Tool, 'zIndex'>[]
).map((tool, index) => ({ ...tool, zIndex: index + 1 }))

const tools = ref(defaultTools.map((tool) => ({ ...tool })))
const canvas = ref<HTMLElement | null>(null)
const categoryFilter = ref<HTMLElement | null>(null)
const drag = ref<DragState | null>(null)
const announcement = ref('')
const isCategoryMenuOpen = ref(false)
const selectedCategories = ref<string[]>([])
let hasCustomPositions = false

const categories = [
  { name: 'Frontend', tools: ['nuxt', 'angular', 'vue', 'typescript', 'tailwind', 'vite'] },
  { name: 'Backend', tools: ['csharp', 'fastify', 'nestjs', 'rabbitmq'] },
  { name: 'Data', tools: ['redis', 'postgresql', 'microsoft-sql', 'mongodb'] },
  {
    name: 'DevOps',
    tools: [
      'git',
      'docker',
      'cloudflare',
      'hetzner',
      'pnpm',
      'azure-devops',
      'gitlab',
      'nginx',
      'turborepo',
    ],
  },
  { name: 'Quality & Monitoring', tools: ['sentry', 'eslint', 'prettier', 'vitest', 'grafana'] },
  { name: 'Design & Planning', tools: ['figma', 'trello'] },
  { name: 'IDEs', tools: ['webstorm', 'rider'] },
]

onMounted(() => {
  arrangeToolCards()
  window.addEventListener('resize', handleCanvasResize)
  document.addEventListener('pointerdown', closeCategoryMenuOnOutsideClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleCanvasResize)
  document.removeEventListener('pointerdown', closeCategoryMenuOnOutsideClick)
})

function closeCategoryMenuOnOutsideClick(event: PointerEvent) {
  if (!categoryFilter.value?.contains(event.target as Node)) isCategoryMenuOpen.value = false
}

function toggleCategory(category: string) {
  selectedCategories.value = selectedCategories.value.includes(category)
    ? selectedCategories.value.filter((item) => item !== category)
    : [...selectedCategories.value, category]
}

function isToolDimmed(toolId: string) {
  if (!selectedCategories.value.length) return false
  const matchingCategory = categories.find((category) => category.tools.includes(toolId))
  return !matchingCategory || !selectedCategories.value.includes(matchingCategory.name)
}

function handleCanvasResize() {
  if (hasCustomPositions) clampToolPositions()
  else arrangeToolCards()
}

function arrangeToolCards() {
  if (!canvas.value) return
  const bounds = canvas.value.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return
  const firstCard = canvas.value.querySelector<HTMLElement>('.tool-card')
  const cardWidth = firstCard?.offsetWidth ?? 120
  const cardHeight = firstCard?.offsetHeight ?? 150
  const columns = Math.ceil(Math.sqrt(tools.value.length * (bounds.width / bounds.height)))
  const rows = Math.ceil(tools.value.length / columns)
  const maxX = 100 - (cardWidth / bounds.width) * 100
  const maxY = 100 - (cardHeight / bounds.height) * 100

  tools.value = tools.value.map((tool, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)
    const columnCount = Math.min(columns, tools.value.length - row * columns)
    const x = columnCount < 2 ? maxX / 2 : (column / (columnCount - 1)) * maxX
    const y = rows < 2 ? maxY / 2 : (row / (rows - 1)) * maxY
    const xJitter = (((index * 13) % 7) - 3) * 1.1
    const yJitter = (((index * 7) % 5) - 2) * 1.2

    return {
      ...tool,
      x: Math.max(0, Math.min(maxX, x + xJitter)),
      y: Math.max(0, Math.min(maxY, y + yJitter)),
    }
  })
}

function clampToolPositions() {
  if (!canvas.value) return
  const bounds = canvas.value.getBoundingClientRect()
  if (!bounds.width || !bounds.height) return
  tools.value = tools.value.map((tool) => {
    const card = canvas.value?.querySelector<HTMLElement>(`[data-tool-id="${tool.id}"]`)
    const maxX = 100 - ((card?.offsetWidth ?? 120) / bounds.width) * 100
    const maxY = 100 - ((card?.offsetHeight ?? 150) / bounds.height) * 100
    return {
      ...tool,
      x: Math.max(0, Math.min(maxX, tool.x)),
      y: Math.max(0, Math.min(maxY, tool.y)),
    }
  })
}

function startDrag(event: PointerEvent, tool: Tool) {
  if (event.button !== 0 || !canvas.value) return
  const card = event.currentTarget as HTMLElement

  event.preventDefault()
  const cardRect = card.getBoundingClientRect()
  hasCustomPositions = true
  tool.zIndex = Math.max(...tools.value.map((item) => item.zIndex)) + 1
  tool.hasBeenDragged = true
  drag.value = {
    id: tool.id,
    pointerId: event.pointerId,
    offsetX: event.clientX - cardRect.left,
    offsetY: event.clientY - cardRect.top,
    startX: tool.x,
    startY: tool.y,
  }
  card.setPointerCapture(event.pointerId)
}

function moveDrag(event: PointerEvent) {
  if (!drag.value || event.pointerId !== drag.value.pointerId || !canvas.value) return
  const bounds = canvas.value.getBoundingClientRect()
  const card = tools.value.find((tool) => tool.id === drag.value?.id)
  if (!card || !bounds.width || !bounds.height) return
  const width =
    canvas.value.querySelector<HTMLElement>(`[data-tool-id="${card.id}"]`)?.offsetWidth ?? 120
  const height =
    canvas.value.querySelector<HTMLElement>(`[data-tool-id="${card.id}"]`)?.offsetHeight ?? 150
  card.x = Math.max(
    0,
    Math.min(
      100 - (width / bounds.width) * 100,
      ((event.clientX - bounds.left - drag.value.offsetX) / bounds.width) * 100
    )
  )
  card.y = Math.max(
    0,
    Math.min(
      100 - (height / bounds.height) * 100,
      ((event.clientY - bounds.top - drag.value.offsetY) / bounds.height) * 100
    )
  )
}

function finishDrag() {
  if (!drag.value) return
  const tool = tools.value.find((item) => item.id === drag.value?.id)
  if (tool) {
    if (tool.x !== drag.value.startX || tool.y !== drag.value.startY) {
      announcement.value = `${tool.name} moved.`
    }
  }
  drag.value = null
}

function moveWithKeyboard(event: KeyboardEvent, tool: Tool, deltaX: number, deltaY: number) {
  if (!canvas.value) return
  event.preventDefault()
  hasCustomPositions = true
  const bounds = canvas.value.getBoundingClientRect()
  const card = canvas.value.querySelector<HTMLElement>(`[data-tool-id="${tool.id}"]`)
  const maxX = 100 - ((card?.offsetWidth ?? 120) / bounds.width) * 100
  const maxY = 100 - ((card?.offsetHeight ?? 150) / bounds.height) * 100
  tool.x = Math.max(0, Math.min(maxX, tool.x + deltaX))
  tool.y = Math.max(0, Math.min(maxY, tool.y + deltaY))
  tool.zIndex = Math.max(...tools.value.map((item) => item.zIndex)) + 1
  tool.hasBeenDragged = true
  announcement.value = `${tool.name} moved.`
}
</script>

<template>
  <section class="tools-page" aria-labelledby="tools-title">
    <header class="tools-heading">
      <h1 id="tools-title">Tools I <span>use.</span></h1>
      <div ref="categoryFilter" class="category-filter">
        <button
          type="button"
          class="category-trigger"
          aria-controls="tool-category-menu"
          :aria-expanded="isCategoryMenuOpen"
          @click="isCategoryMenuOpen = !isCategoryMenuOpen"
        >
          <span>Categories</span>
          <span
            v-if="selectedCategories.length"
            class="category-active-dot"
            aria-label="Filter active"
          ></span>
          <ChevronDown :class="{ 'is-open': isCategoryMenuOpen }" aria-hidden="true" />
        </button>
        <div
          v-if="isCategoryMenuOpen"
          id="tool-category-menu"
          class="category-menu"
          role="group"
          aria-label="Filter tool cards by category"
        >
          <label v-for="category in categories" :key="category.name" class="category-option">
            <input
              type="checkbox"
              :checked="selectedCategories.includes(category.name)"
              @change="toggleCategory(category.name)"
            />
            <span>{{ category.name }}</span>
          </label>
          <button
            v-if="selectedCategories.length"
            type="button"
            class="category-reset"
            @click="selectedCategories = []"
          >
            Clear selection
          </button>
        </div>
      </div>
    </header>

    <div ref="canvas" class="tools-canvas" role="list" aria-label="Tool cards, arranged freely">
      <article
        v-for="(tool, index) in tools"
        :key="tool.id"
        class="tool-card"
        :class="{
          'is-dragging': drag?.id === tool.id,
          'has-been-dragged': tool.hasBeenDragged,
          'is-dimmed': isToolDimmed(tool.id),
        }"
        role="listitem"
        aria-roledescription="draggable card"
        tabindex="0"
        :aria-label="`${tool.name} card. Drag anywhere on the card to move it, or use the arrow keys.`"
        :style="{
          left: `${tool.x}%`,
          top: `${tool.y}%`,
          '--tilt': `${tool.tilt}deg`,
          '--arrival': `${index * 45}ms`,
          '--brand': tool.brandColor ?? (tool.icon ? `#${tool.icon.hex}` : '#cc2927'),
          zIndex: tool.zIndex,
        }"
        :data-tool-id="tool.id"
        @pointerdown="startDrag($event, tool)"
        @pointermove="moveDrag"
        @pointerup="finishDrag"
        @pointercancel="finishDrag"
        @lostpointercapture="finishDrag"
        @keydown.left.prevent="moveWithKeyboard($event, tool, -4, 0)"
        @keydown.right.prevent="moveWithKeyboard($event, tool, 4, 0)"
        @keydown.up.prevent="moveWithKeyboard($event, tool, 0, -5)"
        @keydown.down.prevent="moveWithKeyboard($event, tool, 0, 5)"
      >
        <div class="tool-card-topline" aria-hidden="true">
          <GripVertical class="drag-indicator" />
        </div>
        <svg v-if="tool.icon" class="tool-logo" viewBox="0 0 24 24" aria-hidden="true">
          <path :d="tool.icon.path" />
        </svg>
        <GitBranch
          v-else-if="tool.id === 'azure-devops'"
          class="tool-logo generic-tool-logo"
          aria-hidden="true"
        />
        <Database v-else class="tool-logo generic-tool-logo" aria-hidden="true" />
        <h2>{{ tool.name }}</h2>
        <span class="card-stamp">{{ tool.icon?.title ?? tool.name }}</span>
      </article>
    </div>
    <p class="sr-only" aria-live="polite">{{ announcement }}</p>
  </section>
</template>

<style scoped>
.tools-page {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  padding: 0.3rem clamp(1rem, 3.2vw, 3rem) 0.8rem;
}

.tools-heading {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
}

.tools-heading h1 {
  margin: 0;
  font-size: clamp(2.4rem, 5vw, 4.2rem);
  font-weight: 900;
  letter-spacing: -0.075em;
  line-height: 0.92;
}

.tools-heading h1 span {
  color: var(--orange);
}

.category-filter {
  position: relative;
  margin-bottom: 0.1rem;
}

.category-trigger {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  gap: 0.55rem;
  border: 1px solid var(--ink);
  background: var(--paper);
  padding: 0.45rem 0.7rem;
  color: var(--ink);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 750;
  cursor: pointer;
  box-shadow: 2px 2px 0 #17171430;
}

.category-trigger > svg {
  width: 16px;
  transition: transform 180ms ease;
}

.category-trigger > svg.is-open {
  transform: rotate(180deg);
}

.category-active-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--orange);
}

.category-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 5;
  display: grid;
  width: max-content;
  min-width: 220px;
  gap: 0.15rem;
  border: 1px solid var(--ink);
  background: var(--paper);
  padding: 0.45rem;
  box-shadow: 4px 5px 0 #17171430;
}

.category-option {
  display: flex;
  min-height: 40px;
  align-items: center;
  gap: 0.65rem;
  padding: 0.4rem 0.5rem;
  color: var(--ink);
  font-size: 0.8rem;
  font-weight: 650;
  cursor: pointer;
}

.category-option:hover {
  background: #1717140a;
}

.category-option input {
  width: 16px;
  height: 16px;
  accent-color: var(--orange);
}

.category-reset {
  min-height: 40px;
  border: 0;
  border-top: 1px solid #17171422;
  background: transparent;
  color: var(--ink);
  text-align: left;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 750;
  cursor: pointer;
}

.tools-canvas {
  position: relative;
  z-index: 0;
  isolation: isolate;
  min-height: 0;
  width: 100%;
  flex: 1;
  overflow: hidden;
  touch-action: pan-y;
}

.tool-card {
  position: absolute;
  z-index: 1;
  display: flex;
  width: clamp(112px, 11.2vw, 146px);
  aspect-ratio: 0.78;
  flex-direction: column;
  border: 1px solid var(--ink);
  background: linear-gradient(135deg, #fffdf8 0%, #f6f1e5 100%);
  padding: 0.55rem 0.65rem 0.6rem;
  box-shadow: 4px 5px 0 #17171430;
  transform: rotate(var(--tilt));
  transform-origin: center;
  transition:
    left 360ms cubic-bezier(0.2, 0.8, 0.2, 1),
    top 360ms cubic-bezier(0.2, 0.8, 0.2, 1),
    opacity 220ms ease,
    filter 220ms ease,
    transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1),
    box-shadow 180ms ease;
  animation: card-arrive 470ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  animation-delay: var(--arrival);
  cursor: grab;
  touch-action: none;
}

.tool-card::before {
  position: absolute;
  inset: 0.3rem;
  border: 1px solid color-mix(in srgb, var(--brand), transparent 72%);
  content: '';
  pointer-events: none;
}

.tool-card:hover:not(.is-dragging) {
  z-index: 2;
  transform: translateY(-5px) rotate(0deg);
  box-shadow: 7px 9px 0 #17171436;
}

.tool-card.is-dragging {
  z-index: 3;
  transform: rotate(0deg) scale(1.08);
  box-shadow: 10px 12px 0 #17171445;
  transition:
    transform 100ms ease,
    box-shadow 120ms ease;
  animation: none;
  cursor: grabbing;
}

.tool-card.is-dimmed {
  opacity: 0.28;
  filter: grayscale(0.8);
}

.tool-card.is-dimmed:hover:not(.is-dragging) {
  opacity: 0.38;
}

.tool-card:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 4px;
}

.tool-card-topline {
  display: flex;
  min-height: 24px;
  align-items: center;
  color: #77746a;
}

.drag-indicator {
  width: 18px;
  height: 18px;
}

.tool-card.has-been-dragged {
  animation: none;
}

.tool-logo {
  width: 42%;
  max-height: 55px;
  flex: 1;
  align-self: center;
  margin: 0.25rem auto 0.4rem;
  overflow: visible;
  fill: var(--brand);
}

.generic-tool-logo {
  fill: none;
  color: var(--brand);
  stroke: currentColor;
  stroke-width: 1.6;
}

.tool-card h2 {
  margin: 0 0 0.35rem;
  color: var(--ink);
  text-align: center;
  font-size: clamp(0.8rem, 1.05vw, 0.96rem);
  font-weight: 800;
  letter-spacing: -0.035em;
}

.card-stamp {
  overflow: hidden;
  border-top: 1px solid #17171422;
  padding-top: 0.32rem;
  color: #77746a;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.52rem;
  font-weight: 700;
  letter-spacing: 0.065em;
  text-transform: uppercase;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  clip-path: inset(50%);
}

@keyframes card-arrive {
  from {
    opacity: 0;
    transform: translateY(16px) rotate(calc(var(--tilt) * 1.7)) scale(0.92);
  }
  to {
    opacity: 1;
    transform: rotate(var(--tilt));
  }
}

@media (max-width: 760px) {
  .tools-page {
    padding: 1.2rem 1rem 0.5rem;
  }

  .tool-card {
    width: clamp(100px, 17vw, 128px);
    padding: 0.42rem 0.48rem 0.5rem;
  }

  .tool-logo {
    max-height: 46px;
  }
}

@media (max-width: 600px) {
  .tools-page {
    padding: 0.15rem 0.75rem 0.25rem;
  }

  .tools-heading h1 {
    font-size: clamp(2.25rem, 9vw, 3.1rem);
  }

  .category-trigger {
    min-height: 38px;
    gap: 0.35rem;
    padding: 0.35rem 0.5rem;
    font-size: 0.7rem;
  }

  .category-menu {
    min-width: min(220px, calc(100vw - 2.5rem));
  }

  .tool-card {
    width: clamp(88px, 24vw, 112px);
    padding: 0.32rem 0.38rem 0.4rem;
  }

  .tool-card h2 {
    font-size: 0.75rem;
  }

  .tool-logo {
    max-height: 38px;
  }

  .card-stamp {
    font-size: 0.42rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tool-card {
    animation: none;
    transition: none;
  }
}
</style>
