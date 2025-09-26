<template>
  <hero-section />

  <about-section />

  <projects-section />

  <case-study-section />

  <contact-section />
</template>
<script setup lang="ts">
import { useSeoMeta } from '#imports'
import AboutSection from '~/components/index/aboutSection.vue'
import CaseStudySection from '~/components/index/caseStudySection.vue'
import ContactSection from '~/components/index/contactSection.vue'
import HeroSection from '~/components/index/heroSection.vue'
import ProjectsSection from '~/components/index/projectsSection.vue'

useSeoMeta({
  title: 'NOEL SCHMIDT',
})
</script>
