<template>
  <footer class="bg-black text-neutral-100 relative overflow-hidden">
    <div class="relative py-32 px-6 text-center">
      <span
          class="absolute top-8 left-1/2 -translate-x-1/2 text-[20rem] leading-none font-serif text-white/5 select-none pointer-events-none"
      >
        “
      </span>

      <blockquote class="relative max-w-3xl mx-auto space-y-4">
        <p class="text-2xl md:text-3xl font-semibold leading-snug">
          Great things are built<br />
          step by step<br />
          — I’m here to take those steps.
        </p>
        <p class="text-lg md:text-xl text-neutral-400">
          Focus. iteration. delivery.
        </p>
      </blockquote>
    </div>

    <div class="relative border-t border-neutral-800 overflow-hidden">
      <div
          class="flex whitespace-nowrap animate-marquee text-[8vw] font-black uppercase tracking-tight text-white/5"
      >
        <span class="px-12">&copy; Noel Schmidt</span>
        <span class="px-12">&copy; Noel Schmidt</span>
        <span class="px-12">&copy; Noel Schmidt</span>
        <span class="px-12">&copy; Noel Schmidt</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@keyframes marquee {
  0%   { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
</style>
