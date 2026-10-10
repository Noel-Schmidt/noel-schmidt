<script setup lang="ts">
import { ArrowUpRight, Linkedin, Mail, X } from 'lucide-vue-next'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'

const isOpen = defineModel<boolean>('open', { required: true })
const closeButton = ref<HTMLButtonElement | null>(null)
const contactDialog = ref<HTMLElement | null>(null)
let previousFocus: HTMLElement | null = null

function closeContact() {
  isOpen.value = false
}

function handleDialogKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    closeContact()
    return
  }

  if (event.key !== 'Tab' || !contactDialog.value) return
  const focusable = Array.from(contactDialog.value.querySelectorAll<HTMLElement>('button, a[href]'))
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last?.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first?.focus()
  }
}

watch(
  isOpen,
  async (open) => {
    if (typeof window === 'undefined') return

    if (open) {
      previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
      window.addEventListener('keydown', handleDialogKeydown)
      await nextTick()
      closeButton.value?.focus()
    } else {
      window.removeEventListener('keydown', handleDialogKeydown)
      previousFocus?.focus()
      previousFocus = null
    }
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') window.removeEventListener('keydown', handleDialogKeydown)
})
</script>
<template>
  <Teleport to="body">
    <Transition name="letter-overlay">
      <div v-if="isOpen" class="letter-backdrop" @click.self="closeContact" @contextmenu.prevent>
        <section
          ref="contactDialog"
          class="contact-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-letter-title"
          @click.stop
        >
          <button
            ref="closeButton"
            type="button"
            class="letter-close"
            aria-label="Close contact letter"
            @click="closeContact"
          >
            <X aria-hidden="true" />
          </button>

          <div class="letter-stage">
            <div class="envelope-back" aria-hidden="true" />
            <article class="letter-paper">
              <div class="letter-kicker"
                ><Mail aria-hidden="true" /><span>CONTACT OPTIONS</span></div
              >
              <h2 id="contact-letter-title">Get in touch.</h2>
              <p>Pick the channel that works for you.</p>
              <div class="letter-options">
                <a href="mailto:me@noel-schmidt.de" class="letter-option letter-email">
                  <Mail aria-hidden="true" />
                  <span><strong>Email</strong><small>me@noel-schmidt.de</small></span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
                <a
                  href="https://linkedin.com/in/noel-schmidt"
                  target="_blank"
                  rel="noreferrer"
                  class="letter-option"
                >
                  <Linkedin aria-hidden="true" />
                  <span><strong>LinkedIn</strong><small>Connect with me</small></span>
                  <ArrowUpRight aria-hidden="true" />
                </a>
              </div>
            </article>
            <div class="envelope-front" aria-hidden="true" />
            <div class="envelope-flap" aria-hidden="true" />
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>
<style scoped>
.letter-backdrop {
  position: fixed;
  z-index: 50;
  inset: 0;
  display: grid;
  place-items: center;
  overflow: auto;
  background: #17171480;
  padding: 1rem;
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
  user-select: none;
}

.contact-dialog {
  position: relative;
  width: min(34rem, 100%);
  padding: 2.5rem 0.5rem 0;
}

.letter-close {
  position: absolute;
  z-index: 6;
  top: 0;
  right: 0.5rem;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 2px solid var(--ink);
  background: var(--paper);
  color: var(--ink);
  cursor: pointer;
  box-shadow: 3px 3px 0 var(--orange);
  transition:
    transform 150ms ease,
    background-color 150ms ease,
    box-shadow 150ms ease;
}

.letter-close:hover {
  transform: translate(-2px, -2px) rotate(-5deg);
  background: var(--orange);
  box-shadow: 5px 5px 0 var(--ink);
}
.letter-close svg {
  width: 18px;
  height: 18px;
}

.letter-stage {
  position: relative;
  height: min(27rem, calc(100dvh - 5rem));
  min-height: 24rem;
  perspective: 900px;
}

.envelope-back,
.envelope-front,
.envelope-flap {
  position: absolute;
  left: 50%;
  width: min(100%, 26rem);
  transform: translateX(-50%);
}

.envelope-back {
  bottom: 0;
  height: 11rem;
  border: 2px solid var(--ink);
  background: var(--paper-shadow);
  box-shadow: 8px 8px 0 #17171435;
}

.letter-paper {
  position: absolute;
  z-index: 5;
  isolation: isolate;
  bottom: 7.25rem;
  left: 0;
  right: 0;
  width: min(calc(100% - 2rem), 23rem);
  margin-inline: auto;
  padding: clamp(1.1rem, 4vw, 1.7rem);
  opacity: 0;
  transform: translateY(75%);
}

.letter-paper::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  border: 2px solid var(--ink);
  background: var(--paper);
  box-shadow: 4px 4px 0 #1717141f;
  content: '';
  transform: rotate(-1deg);
}

.letter-kicker {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  color: var(--muted-ink);
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.letter-kicker svg {
  width: 16px;
  height: 16px;
  color: var(--orange);
}
.letter-paper h2 {
  margin: 0.8rem 0 0.2rem;
  font-size: clamp(1.65rem, 6vw, 2.35rem);
  font-weight: 900;
  letter-spacing: -0.07em;
}
.letter-paper > p {
  margin: 0 0 1rem;
  color: var(--muted-ink);
  font-size: 0.78rem;
}

.letter-options {
  display: grid;
  gap: 0.55rem;
}
.letter-option {
  display: grid;
  min-height: 54px;
  grid-template-columns: 24px minmax(0, 1fr) 18px;
  align-items: center;
  gap: 0.65rem;
  border: 2px solid var(--ink);
  background: var(--paper-shadow);
  padding: 0.45rem 0.7rem;
  color: var(--ink);
  text-decoration: none;
  box-shadow: 3px 3px 0 #17171435;
  transition:
    transform 150ms ease,
    background-color 150ms ease,
    box-shadow 150ms ease;
}

.letter-option:hover {
  transform: translate(-2px, -2px);
  background: var(--orange);
  box-shadow: 5px 5px 0 #17171435;
}
.letter-option > svg:first-child {
  width: 19px;
  height: 19px;
  color: var(--orange);
}
.letter-option:hover > svg:first-child {
  color: var(--ink);
}
.letter-option > svg:last-child {
  width: 17px;
  height: 17px;
}
.letter-option strong,
.letter-option small {
  display: block;
}
.letter-option strong {
  font-size: 0.78rem;
}
.letter-option small {
  overflow: hidden;
  margin-top: 0.1rem;
  color: var(--muted-ink);
  font-size: 0.62rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.envelope-front {
  z-index: 3;
  bottom: 0;
  height: 8.5rem;
  border: 2px solid var(--ink);
  background: var(--orange);
  clip-path: polygon(0 0, 50% 70%, 100% 0, 100% 100%, 0 100%);
}

.envelope-flap {
  z-index: 4;
  top: calc(100% - 11rem);
  height: 8rem;
  background: #f27a4f;
  clip-path: polygon(0 0, 100% 0, 50% 80%);
  transform-origin: 50% 0;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  animation: flap-open 550ms 120ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
}

.letter-paper {
  animation: letter-rise 720ms 160ms cubic-bezier(0.18, 0.8, 0.22, 1) forwards;
}
.letter-overlay-enter-active,
.letter-overlay-leave-active {
  transition: opacity 220ms ease;
}
.letter-overlay-enter-from,
.letter-overlay-leave-to {
  opacity: 0;
}

@keyframes letter-rise {
  0% {
    opacity: 0;
    transform: translateY(75%);
  }
  68% {
    opacity: 1;
    transform: translateY(-5%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes flap-open {
  0% {
    transform: translateX(-50%) rotateX(0);
  }
  100% {
    transform: translateX(-50%) rotateX(180deg);
  }
}
.letter-backdrop a:focus-visible,
.letter-backdrop button:focus-visible {
  outline: 3px solid var(--orange);
  outline-offset: 3px;
}

@media (max-width: 540px) {
  .letter-stage {
    height: min(25rem, calc(100dvh - 5rem));
    min-height: 22rem;
  }
  .letter-paper {
    bottom: 6.6rem;
  }
  .envelope-back {
    height: 9.5rem;
  }
  .envelope-front {
    height: 7.5rem;
  }
  .envelope-flap {
    top: calc(100% - 9.5rem);
    height: 7rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .letter-paper {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .envelope-flap {
    animation: none;
    transform: translateX(-50%) rotateX(180deg);
  }
  .letter-option,
  .letter-close {
    transition: none;
  }
}
</style>
