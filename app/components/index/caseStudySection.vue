<script setup lang="ts">
import { ArrowRight, ShieldCheck, Palette, Mail, PaletteIcon, Search, Wrench } from 'lucide-vue-next'
</script>

<template>
  <section class="bg-black text-neutral-100 py-28 relative">
    <div class="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
      <div class="h-px w-48 bg-gradient-to-r from-transparent via-neutral-500 to-transparent"></div>
    </div>

    <div class="mx-auto max-w-screen-xl px-6">
      <header class="mb-16 text-center">
        <h2 class="text-5xl md:text-6xl font-bold tracking-tight">Snappo Toolbox</h2>
        <p class="mt-4 max-w-2xl mx-auto text-neutral-400 text-lg">
          Developer & designer utilities in one fast interface.
        </p>
      </header>

      <div class="grid lg:grid-cols-12 gap-12 items-start">
        <div class="lg:col-span-6">
          <div class="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/30 group">
            <img
                src="/images/case-study.png"
                alt="Snappo cover"
                class="w-full h-[400px] object-cover transition-transform duration-[1500ms] group-hover:scale-105"
            />
          </div>
        </div>

        <div class="lg:col-span-6 space-y-8">
          <div>
            <h3 class="text-xl font-semibold mb-3">Overview</h3>
            <p class="text-neutral-300 leading-relaxed">
              Snappo centralizes everyday tasks: bcrypt hashing, palette building, color picking,
              SMTP probing, SEO checks, and other micro-tools. Clean UI, quick feedback, consistent patterns.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Highlights</h3>
            <ul class="grid sm:grid-cols-2 gap-3 text-sm">
              <li class="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2">
                <ShieldCheck class="h-4 w-4" /> Bcrypt generator
              </li>
              <li class="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2">
                <Palette class="h-4 w-4" /> Palette generator
              </li>
              <li class="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2">
                <PaletteIcon class="h-4 w-4" /> Color picker
              </li>
              <li class="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2">
                <Mail class="h-4 w-4" /> SMTP tester
              </li>
              <li class="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2">
                <Search class="h-4 w-4" /> SEO tools
              </li>
              <li class="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/40 px-3 py-2">
                <Wrench class="h-4 w-4" /> UUID · Slugify · Lorem
              </li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3">Tech Stack</h3>
            <ul class="flex flex-wrap gap-2 text-sm">
              <li class="rounded-lg border border-neutral-800 bg-black/40 px-3 py-1">Nuxt 4</li>
              <li class="rounded-lg border border-neutral-800 bg-black/40 px-3 py-1">Vue 3</li>
              <li class="rounded-lg border border-neutral-800 bg-black/40 px-3 py-1">Tailwind</li>
              <li class="rounded-lg border border-neutral-800 bg-black/40 px-3 py-1">shadcn/ui</li>
              <li class="rounded-lg border border-neutral-800 bg-black/40 px-3 py-1">Turborepo + pnpm</li>
              <li class="rounded-lg border border-neutral-800 bg-black/40 px-3 py-1">Fastify</li>
              <li class="rounded-lg border border-neutral-800 bg-black/40 px-3 py-1">Vite</li>
              <li class="rounded-lg border border-neutral-800 bg-black/40 px-3 py-1">Vitest</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
