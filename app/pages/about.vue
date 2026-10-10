<script setup lang="ts">
import { computed } from 'vue'

import AboutJourneyGraphic from '~/components/AboutJourneyGraphic.vue'

const age = computed(() => {
  const today = new Date()
  const birthDate = new Date(2005, 4, 20)
  let years = today.getFullYear() - birthDate.getFullYear()
  const birthdayNotReached =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())

  if (birthdayNotReached) years -= 1
  return years
})

useSeoMeta({
  title: 'About Noel Schmidt — Full Stack Developer',
  description:
    'I started learning to code through Minecraft about ten years ago. Today, I build for the web and ride my gravel bike.',
})
</script>

<template>
  <section class="page-panel about-panel">
    <div class="panel-copy">
      <h1>About<br /><span>me.</span></h1>
      <p class="lead">
        I’m {{ age }} and based in Germany. I started learning to code about ten years ago, just for
        fun with Minecraft. Later, I found my way into web development, where my heart still is. I
        love seeing people use what I build in their everyday lives. When I’m not programming, I’m
        out riding my gravel bike.
      </p>
    </div>
    <AboutJourneyGraphic />
  </section>
</template>

<style scoped>
.about-panel {
  overflow-y: auto;
}

@media (max-width: 540px) {
  .about-panel {
    align-content: start;
    grid-template-rows: auto auto;
  }

  .about-panel > .panel-copy {
    min-height: auto;
  }
}
</style>
