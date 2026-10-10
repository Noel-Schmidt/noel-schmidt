<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { ref } from 'vue'

import PageDetails from '~/components/PageDetails.vue'

useSeoMeta({
  title: 'Work — Noel Schmidt',
  description: 'A selection of projects built by Noel Schmidt.',
})

const projects = [
  {
    title: 'Snappo Toolbox',
    detail: 'Developer utilities in one interface',
    href: 'https://github.com/noel-schmidt/snappo',
    image: '/images/snappo.png',
  },
  {
    title: 'Daturo.io',
    detail: 'Transparent company data',
    image: '/images/daturo.png',
  },
  {
    title: 'TubeLive',
    detail: 'Online radio · Programming and IT infrastructure',
    image: '/images/tubelive.webp',
  },
]

const activeProject = ref(projects[0])
</script>

<template>
  <section class="page-panel">
    <div class="panel-copy">
      <h1>Selected<br /><span>work.</span></h1>
      <ul class="project-list">
        <li v-for="project in projects" :key="project.title">
          <a
            v-if="project.href"
            class="project-row"
            :href="project.href"
            target="_blank"
            rel="noreferrer"
            @pointerenter="activeProject = project"
            @focus="activeProject = project"
          >
            <span
              ><strong>{{ project.title }}</strong
              ><small>{{ project.detail }}</small></span
            >
            <ArrowUpRight class="h-4 w-4" />
          </a>
          <div v-else class="project-row" @pointerenter="activeProject = project">
            <span
              ><strong>{{ project.title }}</strong
              ><small>{{ project.detail }}</small></span
            >
          </div>
        </li>
      </ul>
    </div>
    <PageDetails
      variant="work"
      :image-url="activeProject.image"
      :image-alt="`${activeProject.title} preview`"
      :title="activeProject.title"
      :detail="activeProject.detail"
      :href="activeProject.href"
    />
  </section>
</template>
