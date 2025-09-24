<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'

const root = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
const mouse = { x: 0, y: 0 }
const particles: { x:number; y:number; vx:number; vy:number; life:number }[] = []
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

function addParticle(x:number, y:number) {
  if (particles.length > MAX) particles.shift()
  const a = Math.random() * Math.PI * 2
  const s = 0.4 + Math.random() * 1.4
  particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 })
}

function loop() {
  raf = requestAnimationFrame(loop)
  if (!ctx) return
  const w = window.innerWidth
  const h = window.innerHeight
  ctx.fillStyle = 'rgba(0,0,0,0.18)'
  ctx.fillRect(0, 0, w, h)

  for (let i = 0; i < 4; i++) addParticle(mouse.x + (Math.random()-0.5)*12, mouse.y + (Math.random()-0.5)*12)

  particles.forEach(p => {
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
      const dx = p.x - q.x
      const dy = p.y - q.y
      const d2 = dx*dx + dy*dy
      if (d2 < 140*140) {
        const a = 0.08 * (1 - d2 / (140*140)) * p.life * q.life
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
    tl.fromTo(el.querySelector('.brand'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 })
        .fromTo(el.querySelector('.subline'), { y: 20, opacity: 0 }, { y: 0, opacity: 0.9, duration: 0.6 }, '-=0.4')
        .fromTo(el.querySelector('.nav'), { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.5')
        .fromTo(el.querySelectorAll('.copy .line'), { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.6 }, '-=0.4')
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
  <section ref="root" class="relative min-h-screen bg-black text-white overflow-hidden">
    <canvas ref="canvasRef" class="absolute inset-0 z-0"></canvas>

    <nav class="nav absolute right-6 top-6 z-50">
      <ul class="flex items-center gap-6 text-[11px] font-semibold uppercase tracking-widest">
        <li><NuxtLink to="#projects" class="opacity-80 hover:opacity-100 transition">Projects</NuxtLink></li>
        <li><NuxtLink to="#about" class="opacity-80 hover:opacity-100 transition">About</NuxtLink></li>
        <li><NuxtLink to="#contact" class="opacity-80 hover:opacity-100 transition">Contact</NuxtLink></li>
        <li>
          <a
              href="https://github.com/noel-schmidt"
              target="_blank"
              class="group inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-black transition hover:shadow-lg"
          >
            <svg class="octo h-4 w-4 transition-transform" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38v-1.3c-2.26.49-2.74-1.09-2.74-1.09-.36-.9-.88-1.13-.88-1.13-.72-.5.05-.49.05-.49.79.06 1.2.82 1.2.82.71 1.21 1.87.86 2.33.66.07-.52.28-.86.5-1.06-1.8-.2-3.69-.9-3.69-3.98 0-.88.31-1.6.82-2.16-.08-.2-.36-1.01.08-2.11 0 0 .68-.22 2.22.82.65-.18 1.35-.27 2.04-.27.69 0 1.4.09 2.05.27 1.53-1.04 2.21-.82 2.21-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.28.82 2.16 0 3.09-1.9 3.78-3.71 3.98.29.25.54.74.54 1.5v2.22c0 .21.15.45.55.38A8 8 0 0 0 8 .2Z"/>
            </svg>
            <span>GitHub</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="pointer-events-none absolute inset-x-0 top-1/3 -translate-y-1/2 z-10 text-center select-none">
      <div class="inline-flex flex-col items-center leading-none">
        <span class="brand block text-[13vw] md:text-[11vw] font-black tracking-tight text-white/25">
          NOEL SCHMIDT
        </span>
        <span class="subline mt-2 block text-[4vw] md:text-[2vw] font-medium uppercase tracking-[0.2em] text-white/50">
          Frontend Developer in Progress
        </span>

        <span class="mt-12 text-white/30">
          "I’m learning by building. Each project helps me grow, sharpen my skills,<br/> and get closer to the developer I want to become."
      </span>
      </div>
    </div>

    <div class="relative z-20 h-screen flex items-center justify-center">
      <div class="copy absolute left-6 top-6 text-[11px] font-semibold uppercase tracking-widest opacity-80">
        <p class="line">Berlin • Local Time</p>
      </div>
      <div class="copy absolute right-6 top-24 text-[11px] font-semibold uppercase tracking-widest max-w-[240px] text-right opacity-80">
        <p class="line">Interfaces with clarity, motion, and performance.</p>
      </div>
      <div class="copy absolute left-6 bottom-6 max-w-[320px]">
        <p class="line text-lg md:text-2xl font-bold leading-tight">Where ideas become interfaces.</p>
      </div>
      <div class="copy absolute right-6 bottom-6 text-[11px] uppercase tracking-widest opacity-80">
        <span class="line">2025</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
a.group:hover .octo { animation: wiggle 0.6s ease-in-out both; }
@keyframes wiggle {
  0% { transform: rotate(0deg) translateY(0); }
  30% { transform: rotate(-8deg) translateY(-1px); }
  60% { transform: rotate(6deg) translateY(0); }
  100% { transform: rotate(0deg) translateY(0); }
}
</style>
