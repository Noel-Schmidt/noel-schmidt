<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'

import NotFoundRouteGame from '~/components/NotFoundRouteGame.vue'

setResponseStatus(404, 'Page Not Found')

useSeoMeta({
  title: '404: Page not found | Noel Schmidt',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <section class="page-panel not-found-page">
    <div class="panel-copy not-found-copy">
      <h1 class="error-code" aria-label="404, page not found">4<span>0</span>4</h1>
      <h2>This page slipped off the grid.</h2>
      <p class="lead">
        The address doesn’t lead to a page here. Find the hidden route home, or take the direct
        path.
      </p>
      <div class="panel-actions">
        <NuxtLink class="primary-action" to="/">
          <ArrowLeft aria-hidden="true" /> Back to the intro
        </NuxtLink>
        <NuxtLink class="text-action" to="/work">See my work</NuxtLink>
      </div>
    </div>
    <NotFoundRouteGame />
  </section>
</template>

<style scoped>
.not-found-page {
  overflow-y: auto;
}

.not-found-copy .error-code {
  margin: 0 0 0.9rem;
  font-size: clamp(6rem, 12vw, 9rem);
  letter-spacing: -0.1em;
  line-height: 0.78;
}

.not-found-copy h2 {
  max-width: 24rem;
  margin: 0;
  font-size: clamp(1.2rem, 2vw, 1.65rem);
  font-weight: 850;
  letter-spacing: -0.055em;
  line-height: 1.05;
}

.not-found-copy .lead {
  margin-top: 0.8rem;
}

.not-found-copy .panel-actions :deep(svg) {
  width: 1rem;
  height: 1rem;
}

@media (max-width: 760px) {
  .not-found-page {
    align-content: start;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto auto;
  }

  .not-found-copy {
    min-height: auto;
  }

  .not-found-copy .error-code {
    font-size: clamp(5rem, 12vw, 7rem);
  }
}

@media (max-width: 540px) {
  .not-found-copy .error-code {
    margin-bottom: 0.55rem;
    font-size: 5rem;
  }

  .not-found-copy .lead {
    margin-top: 0.55rem;
  }

  .not-found-copy .panel-actions {
    margin-top: 0.65rem;
  }
}
</style>
