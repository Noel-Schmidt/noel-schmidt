<script setup lang="ts">
import { computed, ref } from 'vue'

const technologies = [
  {
    name: 'Vue',
    area: 'Interface',
    role: 'The screens people use: forms, navigation, live feedback, and the details that make a tool feel clear.',
  },
  {
    name: 'Nuxt',
    area: 'Application',
    role: 'The structure around the interface: pages, routing, server rendering, and the glue between features.',
  },
  {
    name: 'TypeScript',
    area: 'Code',
    role: 'The shared contracts that keep data and components predictable as an application grows.',
  },
  {
    name: 'C#',
    area: 'Backend',
    role: 'Server-side features, APIs, and application logic that power what happens behind the interface.',
  },
  {
    name: 'Tailwind CSS',
    area: 'Styling',
    role: 'A consistent visual system built close to the components, from spacing to responsive layouts.',
  },
]

const activeName = ref('Vue')
const activeTechnology = computed(
  () => technologies.find((technology) => technology.name === activeName.value) ?? technologies[0]!
)
const activeIndex = computed(
  () => technologies.findIndex((technology) => technology.name === activeName.value) + 1
)
</script>

<template>
  <section class="about-explorer" aria-label="Technology roles">
    <div class="explorer-body">
      <div class="technology-picker" role="group" aria-label="Technology roles">
        <button
          v-for="technology in technologies"
          :key="technology.name"
          type="button"
          :aria-pressed="activeName === technology.name"
          :class="{ 'is-active': activeName === technology.name }"
          @click="activeName = technology.name"
        >
          <span class="tool-mark" aria-hidden="true">{{
            technology.name === 'C#' ? '#' : technology.name.slice(0, 1)
          }}</span>
          <span>{{ technology.name }}</span>
          <span class="tool-arrow" aria-hidden="true">&#8599;</span>
        </button>
      </div>

      <Transition name="role-change" mode="out-in">
        <article :key="activeTechnology.name" class="technology-detail" aria-live="polite">
          <div class="detail-topline"
            ><span>{{ activeTechnology.area }}</span
            ><span>0{{ activeIndex }} / 0{{ technologies.length }}</span></div
          >
          <h3>{{ activeTechnology.name }}</h3>
          <p>{{ activeTechnology.role }}</p>
          <div class="detail-rule" aria-hidden="true"><span /></div>
        </article>
      </Transition>
    </div>
  </section>
</template>

<style scoped>
.about-explorer {
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  border-left: 1px solid #17171430;
  background: var(--paper-shadow);
  padding: clamp(1.25rem, 4vw, 3.5rem);
}

.explorer-body {
  display: grid;
  min-height: 0;
  grid-template-columns: minmax(8.5rem, 0.8fr) minmax(0, 1.2fr);
  border: 1px solid #17171445;
  background: var(--paper);
}

.technology-picker {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #17171430;
  padding: 0.55rem;
}

.technology-picker button {
  display: grid;
  min-height: 42px;
  grid-template-columns: 1.55rem 1fr auto;
  align-items: center;
  gap: 0.45rem;
  border: 1px solid #17171450;
  background: transparent;
  padding: 0 0.55rem;
  color: var(--ink);
  cursor: pointer;
  text-align: left;
  font: inherit;
  font-size: 0.72rem;
  transition:
    background-color 150ms ease,
    border-color 150ms ease,
    transform 150ms ease;
}

.technology-picker button:hover {
  transform: translateX(3px);
}
.technology-picker button.is-active {
  border-color: var(--ink);
  background: #ff5a3525;
}
.tool-mark {
  color: var(--orange);
  font-size: 0.9rem;
  font-weight: 850;
  text-align: center;
}
.tool-arrow {
  color: var(--muted-ink);
  opacity: 0;
  transition: opacity 150ms ease;
}
.technology-picker button.is-active .tool-arrow,
.technology-picker button:hover .tool-arrow {
  opacity: 1;
}
.technology-picker button:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: -2px;
}

.technology-detail {
  display: flex;
  min-width: 0;
  flex-direction: column;
  justify-content: center;
  padding: clamp(1rem, 2.3vw, 2rem);
}

.detail-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  color: var(--muted-ink);
  font-size: 0.62rem;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.technology-detail h3 {
  margin: 0.7rem 0 0.35rem;
  font-size: clamp(1.5rem, 3.3vw, 2.7rem);
  font-weight: 850;
  letter-spacing: -0.07em;
}

.technology-detail p {
  max-width: 25rem;
  margin: 0;
  color: var(--muted-ink);
  font-size: clamp(0.72rem, 1.1vw, 0.88rem);
  line-height: 1.55;
}

.detail-rule {
  height: 3px;
  margin-top: 1.2rem;
  background: #17171418;
}
.detail-rule span {
  display: block;
  width: 38%;
  height: 100%;
  background: var(--orange);
}
.role-change-enter-active,
.role-change-leave-active {
  transition:
    opacity 120ms ease,
    transform 120ms ease;
}
.role-change-enter-from {
  opacity: 0;
  transform: translateY(5px);
}
.role-change-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

@media (max-width: 760px) {
  .about-explorer {
    padding: 1.25rem;
  }
  .explorer-body {
    min-height: 15rem;
  }
}

@media (max-width: 540px) {
  .about-explorer {
    gap: 0.45rem;
    border-top: 1px solid #17171430;
    border-left: 0;
    padding: 0.55rem 0.8rem;
  }
  .explorer-body {
    min-height: 0;
    grid-template-columns: minmax(6rem, 0.85fr) minmax(0, 1.15fr);
  }
  .technology-picker {
    padding: 0.2rem;
  }
  .technology-picker button {
    min-height: 29px;
    grid-template-columns: 1rem 1fr auto;
    gap: 0.25rem;
    padding-inline: 0.3rem;
    font-size: 0.58rem;
  }
  .tool-mark {
    font-size: 0.72rem;
  }
  .technology-detail {
    padding: 0.5rem;
  }
  .detail-topline {
    font-size: 0.48rem;
  }
  .technology-detail h3 {
    margin: 0.4rem 0 0.2rem;
    font-size: 1.15rem;
  }
  .technology-detail p {
    font-size: 0.57rem;
    line-height: 1.3;
  }
  .detail-rule {
    height: 2px;
    margin-top: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .technology-picker button,
  .tool-arrow,
  .role-change-enter-active,
  .role-change-leave-active {
    transition: none;
  }
}
</style>
