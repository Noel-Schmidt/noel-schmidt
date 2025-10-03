<script setup lang="ts">
import { gsap } from 'gsap'
import { ArrowRight } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'

type Project = {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  link?: string
  cta?: string
}

const projects: Project[] = [
  {
    title: 'Snappo Toolbox',
    description:
      'A developer toolbox combining everyday utilities into one interface — from bcrypt and key generators to color palettes and SEO helpers.',
    imageSrc: '/images/snappo.png',
    imageAlt: 'Snappo Toolbox',
    link: 'https://github.com/noel-schmidt/snappo',
    cta: 'View on GitHub',
  },
  {
    title: 'Daturo.io',
    description:
      'Transparent company data for better business decisions. Helping organizations access clear, structured, and reliable insights.',
    imageSrc: '/images/daturo.png',
    imageAlt: 'Daturo.io',
    link: 'https://daturo.io',
    cta: 'View Project',
  },
  {
    title: 'TubeLive',
    description:
      'A youth-led online radio project that hosted live shows and interviews with well-known artists. I was responsible for the complete programming and IT infrastructure.',
    imageSrc: '/images/tubelive.webp',
    imageAlt: 'Tubelive..de',
  },
]

const root = ref<HTMLElement | null>(null)

onMounted(() => {
  const el = root.value
  if (!el) return
  const blocks = el.querySelectorAll<HTMLElement>('.reveal')
  gsap.set(blocks, { y: 60, opacity: 0 })
  blocks.forEach((b) => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          gsap.to(b, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' })
          io.unobserve(b)
        })
      },
      { threshold: 0.2 }
    )
    io.observe(b)
  })
})
</script>

<template>
  <section id="projects" ref="root" class="relative bg-black py-32 text-neutral-100">
    <div class="absolute top-0 right-0 left-0 flex -translate-y-1/2 justify-center">
      <div class="h-px w-48 bg-gradient-to-r from-transparent via-neutral-500 to-transparent"></div>
    </div>

    <div class="mx-auto max-w-screen-2xl px-6">
      <header class="reveal mb-32 text-center">
        <h2 class="text-[12vw] leading-none font-black tracking-tight text-white/10 md:text-[8vw]">
          WORK
        </h2>
        <p class="mx-auto mt-6 max-w-2xl text-base text-neutral-400 md:text-lg">
          A selection of projects I had the chance to contribute to – with focus on clarity,
          performance, and user experience.
        </p>
      </header>

      <div class="space-y-48">
        <div v-for="p in projects" :key="p.title" class="reveal group relative">
          <div
            class="frame relative overflow-hidden rounded-3xl bg-neutral-900/40 ring-1 ring-neutral-800"
          >
            <img
              :src="p.imageSrc"
              :alt="p.imageAlt"
              class="h-[60vh] w-full object-cover transition-transform duration-[1500ms] group-hover:scale-105"
            />
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"
            ></div>
          </div>

          <div
            class="absolute inset-0 flex flex-col items-center justify-end px-6 pb-16 text-center"
          >
            <h3 class="text-4xl font-bold md:text-6xl">{{ p.title }}</h3>
            <p class="mt-4 max-w-xl text-lg text-neutral-200">
              {{ p.description }}
            </p>
            <NuxtLink
              v-if="p.cta"
              :to="p.link"
              target="_blank"
              class="group/link mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2 text-sm font-medium text-black transition hover:bg-neutral-200"
            >
              <span>{{ p.cta }}</span>
              <ArrowRight class="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.frame::before,
.frame::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.frame::before {
  box-shadow: inset 0 0 120px 40px rgba(0, 0, 0, 0.45);
}
.frame::after {
  top: auto;
  height: 48px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
}
</style>
