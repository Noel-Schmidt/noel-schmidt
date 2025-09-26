<template>
  <footer class="relative overflow-hidden bg-black text-neutral-100">
    <div class="relative px-6 py-32 text-center">
      <span
        class="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 font-serif text-[20rem] leading-none text-white/5 select-none"
      >
        “
      </span>

      <blockquote class="relative mx-auto max-w-3xl space-y-4">
        <p class="text-2xl leading-snug font-semibold md:text-3xl">
          Great things are built<br />
          step by step<br />
          — I’m here to take those steps.
        </p>
        <p class="text-lg text-neutral-400 md:text-xl"> Focus. iteration. delivery. </p>
      </blockquote>
    </div>

    <div class="relative overflow-hidden border-t border-neutral-800">
      <div
        class="animate-marquee flex text-[8vw] font-black tracking-tight whitespace-nowrap text-white/5 uppercase"
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
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
</style>
