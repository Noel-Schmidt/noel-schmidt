<script setup lang="ts">
import { gsap } from 'gsap'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const root = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
const mouse = { x: 0, y: 0 }
const particles: { x: number; y: number; vx: number; vy: number; life: number }[] = []
const MAX = 140

function resize() {
  if (!canvasRef.value) return
  const c = canvasRef.value
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  c.width = Math.floor(window.innerWidth * dpr)
  c.height = Math.floor(window.innerHeight * dpr)
  c.style.width = '100%'
  c.style.height = '100%'
  ctx = c.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function addParticle(x: number, y: number) {
  if (particles.length > MAX) particles.shift()
  const a = Math.random() * Math.PI * 2
  const s = 0.4 + Math.random() * 1.4
  particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 })
}

function loop() {
  raf = requestAnimationFrame(loop)
  if (!ctx) return
  const w = window.innerWidth,
    h = window.innerHeight
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 4; i++)
    addParticle(mouse.x + (Math.random() - 0.5) * 12, mouse.y + (Math.random() - 0.5) * 12)

  particles.forEach((p) => {
    p.x += p.vx
    p.y += p.vy
    p.vx *= 0.99
    p.vy *= 0.99
    p.life *= 0.985
  })

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i]
    if (p.life < 0.02) continue
    ctx.beginPath()
    ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${0.35 * p.life})`
    ctx.fill()
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j]
      const dx = p.x - q.x,
        dy = p.y - q.y
      const d2 = dx * dx + dy * dy
      if (d2 < 140 * 140) {
        const a = 0.08 * (1 - d2 / (140 * 140)) * p.life * q.life
        ctx.strokeStyle = `rgba(255,255,255,${a})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x, p.y)
        ctx.lineTo(q.x, q.y)
        ctx.stroke()
      }
    }
  }
}

function move(e: MouseEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

onMounted(() => {
  mouse.x = window.innerWidth / 2
  mouse.y = window.innerHeight / 2
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', move)

  const el = root.value
  if (el) {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo(
      el.querySelectorAll('.word'),
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.2 }
    )
      .fromTo(
        el.querySelector('.tagline'),
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.3'
      )
      .fromTo(
        el.querySelector('.growth'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.2'
      )
      .fromTo(
        el.querySelector('.nav'),
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.4'
      )
  }
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', move)
  }
})
</script>

<template>
  <section ref="root" class="relative min-h-screen overflow-hidden bg-black text-white">
    <canvas ref="canvasRef" class="fixed inset-0 z-0"></canvas>

    <nav class="nav absolute top-3 right-3 z-50 sm:top-6 sm:right-6">
      <ul
        class="flex max-w-[92vw] flex-wrap items-center gap-3 text-[10px] font-semibold tracking-widest uppercase sm:gap-5 sm:text-[11px]"
      >
        <li
          ><NuxtLink class="opacity-90 transition hover:opacity-100" to="#projects"
            >Projects</NuxtLink
          ></li
        >
        <li
          ><NuxtLink class="opacity-90 transition hover:opacity-100" to="#about"
            >About</NuxtLink
          ></li
        >
        <li
          ><NuxtLink class="opacity-90 transition hover:opacity-100" to="#contact"
            >Contact</NuxtLink
          ></li
        >
        <li>
          <a
            href="https://github.com/noel-schmidt"
            target="_blank"
            class="group inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[10px] text-black transition hover:shadow-lg sm:px-4 sm:text-[11px]"
            aria-label="GitHub"
          >
            <svg class="octo h-4 w-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29
                6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2
                .37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
                0-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
                0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18
                1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44
                1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65
                3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013
                8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
            <span class="hidden sm:inline">GitHub</span>
          </a>
        </li>
      </ul>
    </nav>

    <div
      class="absolute top-4 left-4 z-20 text-[10px] font-semibold tracking-widest uppercase opacity-80 sm:top-6 sm:left-6 sm:text-[11px]"
    >
      Germany • Local Time
    </div>

    <div
      class="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 text-center select-none"
    >
      <span
        class="word block text-[14vw] font-black tracking-tight text-white/25 transition-transform duration-500 hover:scale-105 hover:skew-x-3 hover:text-white/40 md:text-[10vw]"
      >
        NOEL
      </span>
      <span
        class="word block text-[14vw] font-black tracking-tight text-white/25 transition-transform duration-500 hover:scale-105 hover:skew-x-3 hover:text-white/40 md:text-[10vw]"
      >
        SCHMIDT
      </span>

      <span
        class="tagline mt-4 block text-[4.5vw] font-medium tracking-[0.2em] text-white/60 uppercase md:text-[2vw]"
      >
        Developer in Progress
      </span>
      <p class="growth mt-6 max-w-xl text-sm leading-relaxed text-neutral-300 md:text-lg">
        I’m learning by building. Each project helps me grow, sharpen my skills,<br />
        and get closer to the developer I want to become.
      </p>
    </div>

    <div class="relative z-20 h-screen">
      <div class="absolute bottom-6 left-4 max-w-[70vw] sm:left-6 sm:max-w-[320px]">
        <p class="text-base leading-tight font-bold sm:text-lg md:text-2xl"
          >Where ideas become interfaces.</p
        >
      </div>
      <div
        class="absolute right-4 bottom-6 text-[10px] tracking-widest uppercase opacity-80 sm:right-6 sm:text-[11px]"
      >
        2025
      </div>
    </div>
  </section>
</template>

<style scoped>
a.group:hover .octo {
  animation: wiggle 0.6s ease-in-out both;
}
@keyframes wiggle {
  0% {
    transform: rotate(0deg) translateY(0);
  }
  30% {
    transform: rotate(-8deg) translateY(-1px);
  }
  60% {
    transform: rotate(6deg) translateY(0);
  }
  100% {
    transform: rotate(0deg) translateY(0);
  }
}
</style>
