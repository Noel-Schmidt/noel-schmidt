<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { ref } from 'vue'

import PageDetails from '~/components/PageDetails.vue'
import { workProjects } from '~/data/projects'

useSeoMeta({
  title: 'Work — Noel Schmidt',
  description: 'A selection of projects built by Noel Schmidt.',
})

const activeProject = ref(workProjects[0]!)
</script>

<template>
  <section
    class="page-panel work-index-panel"
    :class="{ 'work-list-no-preview': !activeProject.image }"
  >
    <div class="panel-copy">
      <h1>Selected<br /><span>work.</span></h1>
      <ul class="project-list">
        <li v-for="project in workProjects" :key="project.slug">
          <NuxtLink
            class="project-row"
            :to="`/work/${project.slug}`"
            @pointerenter="activeProject = project"
            @focus="activeProject = project"
          >
            <span>
              <strong>{{ project.title }}</strong>
              <small>{{ project.detail }}</small>
            </span>
            <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </NuxtLink>
        </li>
      </ul>
    </div>
    <PageDetails
      v-if="activeProject.image"
      variant="work"
      :image-url="activeProject.image"
      :image-alt="activeProject.imageAlt"
      :title="activeProject.title"
      :detail="activeProject.detail"
      :href="`/work/${activeProject.slug}`"
    />
  </section>
</template>

<style scoped>
.page-panel.work-list-no-preview {
  grid-template-columns: minmax(0, 1fr);
}

@media (max-width: 540px) {
  .page-panel.work-list-no-preview {
    grid-template-rows: minmax(14rem, 1fr);
  }
}
</style>
