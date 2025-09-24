<template>
  <section id="about" class="bg-black text-neutral-100 py-32 relative">
    <div class="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
      <div class="h-px w-48 bg-gradient-to-r from-transparent via-neutral-500 to-transparent"></div>
    </div>

    <div class="mx-auto max-w-screen-2xl px-6">
      <header class="mb-24 text-center">
        <h2 class="text-[12vw] md:text-[8vw] font-black tracking-tight text-white/10 leading-none">
          ABOUT
        </h2>
        <p class="mt-6 text-neutral-400 text-base md:text-lg">
          Designing. Coding. Learning
        </p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        <article class="lg:col-span-8 max-w-3xl mx-auto lg:mx-0 space-y-6">
          <p class="text-lg leading-relaxed text-neutral-200">
            I’m 20 and diving into frontend development by building real projects. I care about interfaces that
            stay simple under pressure, feel natural in motion, and run fast.
          </p>
          <p class="text-lg leading-relaxed text-neutral-200">
            I focus on principles over trends: clean typography, consistent spacing, and components that work well
            together. With every iteration I try to cut noise and make interactions sharper.
          </p>
          <p class="text-lg leading-relaxed text-neutral-200">
            My daily tools: Nuxt, Vue, Tailwind, TypeScript. I use GSAP when motion helps explain ideas. Vite, Vitest,
            and Turborepo keep my projects quick and reliable.
          </p>
          <p class="text-lg leading-relaxed text-neutral-200">
            My goal is straightforward: create things that are useful and keep learning by doing.
          </p>
        </article>

        <aside class="lg:col-span-4">
          <div class="lg:sticky lg:top-24">
            <h3 class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Snapshot
            </h3>

            <div class="mt-5 border-l border-neutral-800 pl-6 space-y-5">
              <div class="flex items-baseline justify-between gap-6">
                <span class="text-neutral-500 text-sm">Based in</span>
                <span class="text-sm font-medium text-neutral-100">Germany</span>
              </div>
              <div class="h-px bg-neutral-800"></div>

              <div class="flex items-baseline justify-between gap-6">
                <span class="text-neutral-500 text-sm">Focus</span>
                <span class="text-sm font-medium text-neutral-100">Frontend · UX</span>
              </div>
              <div class="h-px bg-neutral-800"></div>

              <div class="flex items-baseline justify-between gap-6">
                <span class="text-neutral-500 text-sm">Toolbox</span>
                <span class="text-sm font-medium text-neutral-100">Nuxt · Vue · Tailwind · GSAP</span>
              </div>
              <div class="h-px bg-neutral-800"></div>

              <div class="flex items-baseline justify-between gap-6">
                <span class="text-neutral-500 text-sm">Build/Test</span>
                <span class="text-sm font-medium text-neutral-100">Turborepo · Vite · Vitest</span>
              </div>
            </div>

            <div class="mt-8 flex flex-wrap gap-3">
              <NuxtLink
                  to="#projects"
                  class="rounded-full bg-white px-5 py-2 text-xs font-medium text-black hover:bg-neutral-200 transition"
              >
                See projects
              </NuxtLink>
              <NuxtLink
                  to="#contact"
                  class="rounded-full border border-neutral-700 px-5 py-2 text-xs font-medium text-neutral-200 hover:border-neutral-300 transition"
              >
                Get in touch
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>
</template>
