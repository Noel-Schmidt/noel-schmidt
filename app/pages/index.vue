<template>
  <hero-section />

  <about-section />

  <projects-section />


  <case-study-section />

  <contact-section />
</template>
<script setup lang="ts">
import HeroSection from "~/components/index/heroSection.vue";
import ProjectsSection from "~/components/index/projectsSection.vue";
import AboutSection from "~/components/index/aboutSection.vue";
import CaseStudySection from "~/components/index/caseStudySection.vue";
import ContactSection from "~/components/index/contactSection.vue";
import {useSeoMeta} from "#imports";

useSeoMeta({
  title: "NOEL SCHMIDT"
})
</script>