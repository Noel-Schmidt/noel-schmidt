<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'

import TileMiniGame from '~/components/TileMiniGame.vue'

const contactOpen = useState('contact-letter-open', () => false)
function openContact() {
  contactOpen.value = true
}

useSeoMeta({
  title: 'Noel Schmidt — Full Stack Developer',
  description:
    'I’m Noel Schmidt, a full stack developer in Germany learning by building useful digital experiences.',
})
</script>

<template>
  <section class="page-panel">
    <div class="panel-copy">
      <h1>Hi, I’m<br /><span>Noel.</span></h1>
      <p class="lead">
        Full Stack Developer based in Germany, building web applications with Vue, Nuxt, TypeScript,
        and C#.
      </p>
      <div class="panel-actions">
        <NuxtLink class="primary-action" to="/work"
          >View my work <ArrowRight class="h-4 w-4"
        /></NuxtLink>
        <button class="text-action" type="button" @click="openContact">Get in touch</button>
      </div>
    </div>
    <TileMiniGame />
  </section>
</template>

<style scoped>
.text-action {
  font-family: inherit;
  cursor: pointer;
}
</style>
