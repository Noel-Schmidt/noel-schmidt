<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'

defineProps<{
  variant: 'work' | 'contact'
  imageUrl?: string
  imageAlt?: string
  title?: string
  detail?: string
  href?: string
}>()
</script>

<template>
  <aside class="page-details" :class="`details-${variant}`">
    <figure v-if="variant === 'work'" class="project-preview work-preview">
      <img :key="imageUrl" :src="imageUrl" :alt="imageAlt || ''" />
      <figcaption class="preview-caption">
        <span
          ><strong>{{ title }}</strong
          ><small>{{ detail }}</small></span
        >
        <NuxtLink
          v-if="href"
          class="preview-arrow-link"
          :to="href"
          :aria-label="`View ${title} project details`"
        >
          <ArrowUpRight class="preview-arrow" />
        </NuxtLink>
      </figcaption>
    </figure>

    <nav v-else class="contact-details" aria-label="Find Noel online">
      <a href="https://github.com/noel-schmidt" target="_blank" rel="noreferrer">
        <span><strong>GitHub</strong><small>github.com/noel-schmidt</small></span>
        <ArrowUpRight class="preview-arrow" />
      </a>
      <a href="https://linkedin.com/in/noel-schmidt" target="_blank" rel="noreferrer">
        <span><strong>LinkedIn</strong><small>Professional profile</small></span>
        <ArrowUpRight class="preview-arrow" />
      </a>
    </nav>
  </aside>
</template>

<style scoped>
.page-details {
  display: grid;
  min-width: 0;
  min-height: 0;
  align-items: center;
  border-left: 1px solid #17171430;
  background: var(--paper-shadow);
  padding: clamp(1.25rem, 4vw, 3.5rem);
}

.project-preview {
  display: block;
  width: 100%;
  overflow: hidden;
  border: 1px solid #17171445;
  background: var(--paper);
  color: var(--ink);
  text-decoration: none;
}

.work-preview {
  padding: 0.65rem 0.65rem 0;
  box-shadow: 7px 7px 0 #17171416;
  transform: rotate(-2deg);
  transition:
    transform 240ms ease,
    box-shadow 240ms ease;
}

.work-preview:hover {
  box-shadow: 10px 10px 0 #17171418;
  transform: rotate(0deg) translateY(-2px);
}

.project-preview > img {
  display: block;
  width: 100%;
  aspect-ratio: 1.48;
  object-fit: cover;
  object-position: top center;
  transition: transform 260ms ease;
}

.project-preview:hover > img {
  transform: scale(1.025);
}

.preview-caption,
.contact-details a {
  display: flex;
  min-height: 64px;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid #17171430;
  padding: 0.8rem 1rem;
}

.preview-caption strong,
.preview-caption small,
.contact-details strong,
.contact-details small {
  display: block;
}

.preview-caption strong,
.contact-details strong {
  font-size: 0.9rem;
}

.preview-caption small,
.contact-details small {
  margin-top: 0.25rem;
  color: var(--muted-ink);
  font-size: 0.72rem;
}

.preview-arrow {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  transition: transform 180ms ease;
}

.project-preview:hover .preview-arrow,
.contact-details a:hover .preview-arrow {
  transform: translate(2px, -2px);
}

.contact-details {
  border-top: 1px solid #17171445;
}

.contact-details a {
  min-height: 82px;
  border: 0;
  border-bottom: 1px solid #17171445;
  color: var(--ink);
  text-decoration: none;
  transition:
    color 180ms ease,
    padding 180ms ease;
}

.contact-details a:hover {
  padding-inline: 1.2rem;
  color: var(--orange);
}

.preview-arrow-link {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid var(--ink);
  background: var(--paper-shadow);
  color: var(--ink);
  box-shadow: 2px 2px 0 #17171430;
  transition:
    transform 150ms ease,
    background-color 150ms ease,
    box-shadow 150ms ease;
}

.preview-arrow-link:hover {
  transform: translate(-1px, -1px);
  background: var(--orange);
  color: var(--ink);
  box-shadow: 3px 3px 0 #17171445;
}

@media (max-width: 760px) {
  .page-details {
    padding: 1.25rem;
  }
}

@media (max-width: 540px) {
  .page-details {
    border-top: 1px solid #17171430;
    border-left: 0;
    padding: 0.8rem 1rem;
  }

  .preview-caption,
  .contact-details a {
    min-height: 52px;
    padding: 0.55rem 0.75rem;
  }

  .work-preview {
    padding: 0.4rem 0.4rem 0;
  }

  .work-preview > img {
    aspect-ratio: 2.3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-preview > img,
  .work-preview,
  .preview-arrow,
  .contact-details a {
    transition: none;
  }
}
</style>
