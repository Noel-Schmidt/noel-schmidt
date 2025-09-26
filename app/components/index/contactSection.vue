<script setup lang="ts">
import { Mail, Github, Linkedin } from 'lucide-vue-next'
</script>

<template>
  <section id="contact" class="relative bg-black py-32 text-neutral-100">
    <div class="absolute top-0 right-0 left-0 flex -translate-y-1/2 justify-center">
      <div class="h-px w-48 bg-gradient-to-r from-transparent via-neutral-500 to-transparent"></div>
    </div>

    <div class="mx-auto max-w-screen-xl px-6">
      <header class="mb-24 text-center">
        <h2 class="text-[12vw] leading-none font-black tracking-tight text-white/10 md:text-[8vw]">
          CONTACT
        </h2>
        <p class="mt-6 text-base text-neutral-400 md:text-lg">
          Let’s connect — reach out or follow the work.
        </p>
      </header>

      <div class="grid gap-8 md:grid-cols-3">
        <a
          href="mailto:me@noel-schmidt.de"
          class="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10 backdrop-blur-sm transition hover:border-neutral-600 hover:bg-neutral-800/40"
        >
          <Mail class="h-8 w-8 text-neutral-300 transition group-hover:text-white" />
          <span class="text-sm font-medium text-neutral-300 group-hover:text-white">
            me@noel-schmidt.de
          </span>
        </a>

        <a
          href="https://github.com/noel-schmidt"
          target="_blank"
          class="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10 backdrop-blur-sm transition hover:border-neutral-600 hover:bg-neutral-800/40"
        >
          <Github class="h-8 w-8 text-neutral-300 transition group-hover:text-white" />
          <span class="text-sm font-medium text-neutral-300 group-hover:text-white">
            github.com/noel-schmidt
          </span>
        </a>

        <a
          href="https://linkedin.com/in/noel-schmidt"
          target="_blank"
          class="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-10 backdrop-blur-sm transition hover:border-neutral-600 hover:bg-neutral-800/40"
        >
          <Linkedin class="h-8 w-8 text-neutral-300 transition group-hover:text-white" />
          <span class="text-sm font-medium text-neutral-300 group-hover:text-white">
            linkedin.com/in/noel-schmidt
          </span>
        </a>
      </div>
    </div>
  </section>
</template>
