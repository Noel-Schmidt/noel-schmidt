<script setup lang="ts">
import { ArrowLeft, ArrowRight, ArrowUpRight, Expand, X } from 'lucide-vue-next'
import { computed, onBeforeUnmount, ref } from 'vue'

import { workProjects } from '~/data/projects'

const route = useRoute()
const project = computed(() => workProjects.find((item) => item.slug === route.params.slug))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found' })
}

const activeProject = computed(() => project.value!)
const projectIndex = computed(() =>
  workProjects.findIndex((item) => item.slug === activeProject.value.slug)
)
const previousProject = computed(
  () => workProjects[(projectIndex.value - 1 + workProjects.length) % workProjects.length]!
)
const nextProject = computed(() => workProjects[(projectIndex.value + 1) % workProjects.length]!)
const previewDialog = ref<HTMLDialogElement | null>(null)
const isClosingPreview = ref(false)
let previewCloseTimer: number | undefined

useSeoMeta({
  title: () => `${activeProject.value.title} — Noel Schmidt`,
  description: () => activeProject.value.intro,
})

function openPreview() {
  window.clearTimeout(previewCloseTimer)
  previewCloseTimer = undefined
  isClosingPreview.value = false
  previewDialog.value?.classList.remove('is-closing')
  previewDialog.value?.showModal()
}

function closePreview() {
  const dialog = previewDialog.value
  if (!dialog?.open || isClosingPreview.value) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dialog.close()
    return
  }

  isClosingPreview.value = true
  dialog.classList.add('is-closing')
  previewCloseTimer = window.setTimeout(() => finishPreviewClose(), 220)
}

function finishPreviewClose(event?: AnimationEvent) {
  if (event && (event.target !== previewDialog.value || event.animationName !== 'preview-close')) {
    return
  }
  if (!isClosingPreview.value) return

  previewDialog.value?.close()
  previewDialog.value?.classList.remove('is-closing')
  window.clearTimeout(previewCloseTimer)
  previewCloseTimer = undefined
  isClosingPreview.value = false
}

onBeforeUnmount(() => {
  window.clearTimeout(previewCloseTimer)
  if (previewDialog.value?.open) previewDialog.value.close()
})
</script>

<template>
  <section class="work-detail" :class="{ 'has-visual': activeProject.image }">
    <div class="work-detail-copy">
      <NuxtLink class="detail-back" to="/work">
        <ArrowLeft aria-hidden="true" />
        All work
      </NuxtLink>

      <h1>{{ activeProject.title }}<span>.</span></h1>
      <p class="detail-intro">{{ activeProject.intro }}</p>

      <div v-if="activeProject.tools.length" class="detail-tools">
        <h2>Tools used</h2>
        <ul aria-label="Tools used for this project">
          <li v-for="tool in activeProject.tools" :key="tool">{{ tool }}</li>
        </ul>
      </div>

      <p v-if="activeProject.note" class="project-note">{{ activeProject.note }}</p>

      <section
        v-if="activeProject.milestones?.length"
        class="project-story"
        :aria-label="`${activeProject.title} timeline`"
      >
        <ol>
          <li v-for="milestone in activeProject.milestones" :key="milestone.period">
            <strong>{{ milestone.period }}</strong>
            <p>{{ milestone.text }}</p>
          </li>
        </ol>
      </section>

      <div v-if="activeProject.website || activeProject.source" class="detail-links">
        <a
          v-if="activeProject.website"
          class="primary-action"
          :href="activeProject.website"
          target="_blank"
          rel="noreferrer"
        >
          Visit project <ArrowUpRight aria-hidden="true" />
        </a>
        <a
          v-if="activeProject.source"
          class="text-action"
          :href="activeProject.source"
          target="_blank"
          rel="noreferrer"
        >
          Source code
        </a>
      </div>

      <nav class="project-pager" aria-label="Other projects">
        <NuxtLink
          :to="`/work/${previousProject.slug}`"
          :aria-label="`Previous project: ${previousProject.title}`"
        >
          <ArrowLeft aria-hidden="true" />
          <span
            >Previous<small>{{ previousProject.title }}</small></span
          >
        </NuxtLink>
        <NuxtLink
          class="pager-next"
          :to="`/work/${nextProject.slug}`"
          :aria-label="`Next project: ${nextProject.title}`"
        >
          <span
            >Next<small>{{ nextProject.title }}</small></span
          >
          <ArrowRight aria-hidden="true" />
        </NuxtLink>
      </nav>
    </div>

    <aside v-if="activeProject.image" class="work-detail-visual">
      <button
        class="detail-image-button"
        type="button"
        :aria-label="`Enlarge preview of ${activeProject.title}`"
        @click="openPreview"
      >
        <img :src="activeProject.image" :alt="activeProject.imageAlt" />
        <span class="image-expand"><Expand aria-hidden="true" /> Enlarge</span>
      </button>
    </aside>

    <dialog
      v-if="activeProject.image"
      ref="previewDialog"
      class="image-dialog"
      @click.self="closePreview"
      @cancel.prevent="closePreview"
      @animationend="finishPreviewClose"
    >
      <button
        class="dialog-close"
        type="button"
        aria-label="Close image preview"
        @click="closePreview"
      >
        <X aria-hidden="true" />
      </button>
      <img :src="activeProject.image" :alt="activeProject.imageAlt" />
    </dialog>
  </section>
</template>

<style scoped>
.work-detail {
  display: grid;
  min-width: 0;
  min-height: 0;
  flex: 1;
  grid-template-columns: minmax(0, 1fr);
  overflow: auto;
}

.work-detail.has-visual {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
}

.work-detail:not(.has-visual) .work-detail-copy {
  width: min(100%, 58rem);
  justify-self: center;
}

.work-detail-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(1.4rem, 4vw, 4rem);
}

.detail-back {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  gap: 0.45rem;
  color: var(--muted-ink);
  font-size: 0.78rem;
  font-weight: 750;
  text-decoration: none;
  transition:
    color 160ms ease,
    gap 160ms ease;
}

.detail-back:hover {
  gap: 0.7rem;
  color: var(--orange);
}

.detail-back svg,
.project-pager svg {
  width: 17px;
  height: 17px;
}

h1 {
  max-width: 100%;
  margin: 0;
  overflow-wrap: anywhere;
  font-size: clamp(2.8rem, 5.4vw, 5.6rem);
  font-weight: 900;
  letter-spacing: -0.08em;
  line-height: 0.91;
}

h1 span {
  color: var(--orange);
}

.detail-intro {
  max-width: 29rem;
  margin: 1rem 0 0;
  color: var(--muted-ink);
  font-size: clamp(0.88rem, 1.1vw, 1.02rem);
  line-height: 1.6;
}

.project-note {
  margin: 0.6rem 0 0;
  color: var(--muted-ink);
  font-size: 0.72rem;
  font-weight: 750;
}

.project-story {
  width: 100%;
  max-width: 31rem;
  margin-top: 1rem;
  border-top: 1px solid #17171435;
  padding-top: 0.75rem;
}

.project-story ol {
  position: relative;
  display: grid;
  gap: 0.2rem;
  margin: 0;
  padding: 0 0 0 1.25rem;
  list-style: none;
}

.project-story ol::before {
  position: absolute;
  top: 0.35rem;
  bottom: 0.45rem;
  left: 0.23rem;
  width: 1px;
  background: #17171450;
  content: '';
}

.project-story li {
  position: relative;
  display: grid;
  grid-template-columns: minmax(8.5rem, 0.72fr) minmax(0, 1.5fr);
  gap: 0.9rem;
  align-items: start;
  padding: 0.2rem 0 0.55rem;
}

.project-story li::before {
  position: absolute;
  top: 0.28rem;
  left: -1.23rem;
  width: 0.5rem;
  height: 0.5rem;
  border: 1px solid var(--ink);
  background: var(--orange);
  content: '';
  transform: rotate(45deg);
}

.project-story strong {
  padding-top: 0.08rem;
  color: var(--orange);
  font-size: 0.68rem;
  line-height: 1.4;
}

.project-story li p {
  margin: 0;
  color: var(--muted-ink);
  font-size: 0.68rem;
  line-height: 1.45;
}

.detail-tools {
  width: 100%;
  max-width: 31rem;
  margin-top: clamp(1.15rem, 3vh, 2rem);
  border-top: 1px solid #17171435;
  padding-top: 0.75rem;
}

.detail-tools h2 {
  margin: 0 0 0.65rem;
  font-size: 0.75rem;
  font-weight: 850;
}

.detail-tools ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.detail-tools li {
  border: 1px solid #1717144a;
  background: #fffdf8;
  padding: 0.4rem 0.6rem;
  box-shadow: 2px 2px 0 #17171420;
  font-size: 0.68rem;
  font-weight: 750;
  transition:
    transform 150ms ease,
    background-color 150ms ease;
}

.detail-tools li:hover {
  transform: translateY(-2px) rotate(-1deg);
  background: #ff5a351c;
}

.detail-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-top: 1rem;
}

.detail-links :deep(.primary-action),
.detail-links :deep(.text-action) {
  min-height: 42px;
  font-size: 0.76rem;
}

.detail-links :deep(svg) {
  width: 16px;
  height: 16px;
}

.project-pager {
  display: flex;
  width: 100%;
  max-width: 31rem;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: clamp(1rem, 3vh, 2rem);
}

.project-pager a {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  gap: 0.5rem;
  color: var(--ink);
  font-size: 0.66rem;
  font-weight: 800;
  text-decoration: none;
}

.project-pager .pager-next {
  text-align: right;
}

.project-pager small {
  display: block;
  margin-top: 0.15rem;
  color: var(--muted-ink);
  font-size: 0.66rem;
  font-weight: 600;
}

.project-pager a:hover {
  color: var(--orange);
}

.work-detail-visual {
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #17171430;
  background: var(--paper-shadow);
  padding: clamp(1.25rem, 4vw, 3.5rem);
}

.detail-image-button {
  position: relative;
  display: block;
  width: min(100%, 52rem);
  overflow: hidden;
  border: 1px solid var(--ink);
  background: var(--paper);
  padding: 0.65rem;
  box-shadow: 8px 8px 0 #17171425;
  cursor: zoom-in;
  transform: rotate(-1.5deg);
  transition:
    transform 200ms ease,
    box-shadow 200ms ease;
}

.detail-image-button:hover {
  box-shadow: 11px 11px 0 #17171425;
  transform: rotate(0deg) translateY(-2px);
}

.detail-image-button img {
  display: block;
  width: 100%;
  max-height: min(62vh, 660px);
  aspect-ratio: 1.48;
  background: var(--paper-shadow);
  border: 1px solid #17171425;
  object-fit: contain;
  object-position: center;
}

.image-expand {
  position: absolute;
  right: 1.1rem;
  bottom: 1.1rem;
  display: inline-flex;
  min-height: 36px;
  align-items: center;
  gap: 0.35rem;
  border: 1px solid var(--ink);
  background: var(--paper);
  padding: 0 0.6rem;
  font-size: 0.68rem;
  font-weight: 800;
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}

.image-expand svg {
  width: 15px;
  height: 15px;
}

.detail-image-button:hover .image-expand,
.detail-image-button:focus-visible .image-expand {
  opacity: 1;
  transform: translateY(0);
}

.image-dialog {
  position: fixed;
  inset: 50% auto auto 50%;
  width: min(92vw, 1440px);
  max-width: none;
  max-height: 92dvh;
  box-sizing: border-box;
  overflow: auto;
  margin: 0;
  border: 1px solid var(--ink);
  background: var(--paper);
  padding: 3.5rem clamp(0.6rem, 2vw, 1.25rem) clamp(0.6rem, 2vw, 1.25rem);
  color: var(--ink);
  box-shadow: 8px 8px 0 #17171455;
  transform: translate(-50%, -50%);
}

.image-dialog::backdrop {
  background: #171714bd;
  animation: backdrop-open 180ms ease-out both;
}

.image-dialog[open] {
  animation: preview-open 240ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
}

.image-dialog.is-closing {
  animation: preview-close 180ms cubic-bezier(0.4, 0, 1, 1) both;
}

.image-dialog.is-closing::backdrop {
  animation: backdrop-close 180ms ease-in both;
}

@keyframes preview-open {
  from {
    opacity: 0;
    transform: translate(-50%, -47%) scale(0.94) rotate(-1deg);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(0);
  }
}

@keyframes preview-close {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1) rotate(0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -53%) scale(0.95) rotate(1deg);
  }
}

@keyframes backdrop-open {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes backdrop-close {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

.image-dialog img {
  display: block;
  width: auto;
  max-width: 100%;
  height: auto;
  max-height: calc(92dvh - 5rem);
  margin-inline: auto;
  object-fit: contain;
}

.dialog-close {
  position: absolute;
  z-index: 1;
  top: 0.55rem;
  right: 0.55rem;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid var(--ink);
  background: var(--paper);
  cursor: pointer;
  box-shadow: 2px 2px 0 var(--ink);
}

.dialog-close svg {
  width: 18px;
  height: 18px;
}

.work-detail :deep(a:focus-visible),
.detail-image-button:focus-visible,
.dialog-close:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 3px;
}

@media (max-width: 760px) {
  .work-detail {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.9fr);
  }

  .work-detail:not(.has-visual) {
    grid-template-columns: minmax(0, 1fr);
  }

  .work-detail-copy {
    padding: 1.4rem;
  }

  h1 {
    font-size: clamp(2.5rem, 6.2vw, 4rem);
  }

  .work-detail-visual {
    padding: 1.25rem;
  }
}

@media (max-width: 540px) {
  .work-detail {
    display: flex;
    flex-direction: column;
  }

  .work-detail-copy {
    min-height: 23rem;
    padding: 1rem 1.2rem 1.2rem;
  }

  h1 {
    font-size: clamp(2.8rem, 11vw, 4rem);
  }

  .detail-intro {
    margin-top: 0.7rem;
    font-size: 0.84rem;
  }

  .detail-tools {
    margin-top: 0.85rem;
    padding-top: 0.55rem;
  }

  .project-story {
    margin-top: 0.75rem;
    padding-top: 0.55rem;
  }

  .project-story ol {
    gap: 0.15rem;
  }

  .project-story li {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.18rem;
    padding-bottom: 0.5rem;
  }

  .detail-tools ul {
    gap: 0.35rem;
  }

  .detail-tools li {
    padding: 0.34rem 0.48rem;
    font-size: 0.64rem;
  }

  .detail-links {
    margin-top: 0.7rem;
  }

  .project-pager {
    margin-top: 0.5rem;
    padding-top: 0.6rem;
  }

  .work-detail-visual {
    min-height: 15rem;
    border-top: 1px solid #17171430;
    border-left: 0;
    padding: 1rem 1.2rem;
  }

  .detail-image-button {
    padding: 0.4rem;
  }

  .detail-image-button img {
    max-height: none;
    aspect-ratio: 1.5;
  }

  .image-expand {
    right: 0.8rem;
    bottom: 0.8rem;
    opacity: 1;
    transform: none;
  }
}

@media (max-height: 650px) and (min-width: 541px) {
  .work-detail-copy {
    padding-block: 1rem;
  }

  .detail-intro {
    margin-top: 0.65rem;
  }

  .detail-tools {
    margin-top: 0.8rem;
  }

  .project-pager {
    padding-top: 0.65rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .image-dialog[open],
  .image-dialog::backdrop {
    animation: none;
  }

  .detail-back,
  .detail-tools li,
  .detail-image-button,
  .image-expand {
    transition: none;
  }
}
</style>
