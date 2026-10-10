<script setup lang="ts">
import { computed } from 'vue'

import AboutStackExplorer from '~/components/AboutStackExplorer.vue'

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
  description: 'A little about Noel, his interests, and the tools he uses to build for the web.',
})
</script>

<template>
  <section class="page-panel">
    <div class="panel-copy">
      <h1>About<br /><span>me.</span></h1>
      <p class="lead">
        I’m {{ age }}, based in Germany, and building real projects across the stack. I care about
        clear interfaces, useful details, and understanding how each part works together.
      </p>
    </div>
    <AboutStackExplorer />
  </section>
</template>
