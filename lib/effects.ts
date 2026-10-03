const HEART_EMOJIS = ['💖', '💕', '💗', '✨', '💘', '🌸']
const CONFETTI_COLORS = ['#ec4899', '#f9a8d4', '#f472b6', '#e8a598', '#fde2e4', '#c026d3']

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function heartBurst(x: number, y: number, count = 22) {
  if (typeof window === 'undefined' || prefersReducedMotion()) return
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5
    const distance = 60 + Math.random() * 110
    el.textContent = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)]
    el.className = 'burst-particle'
    el.setAttribute('aria-hidden', 'true')
    el.style.left = `${x}px`
    el.style.top = `${y}px`
    el.style.fontSize = `${14 + Math.random() * 16}px`
    el.style.setProperty('--dx', `${Math.cos(angle) * distance}px`)
    el.style.setProperty('--dy', `${Math.sin(angle) * distance}px`)
    el.addEventListener('animationend', () => el.remove())
    document.body.appendChild(el)
  }
}

export function sparkle(x: number, y: number) {
  if (typeof window === 'undefined' || prefersReducedMotion()) return
  const el = document.createElement('span')
  el.textContent = Math.random() > 0.5 ? '✨' : '💗'
  el.className = 'sparkle-particle'
  el.setAttribute('aria-hidden', 'true')
  el.style.left = `${x}px`
  el.style.top = `${y}px`
  el.addEventListener('animationend', () => el.remove())
  document.body.appendChild(el)
}

export function confettiRain(count = 90) {
  if (typeof window === 'undefined' || prefersReducedMotion()) return
  for (let i = 0; i < count; i++) {
    const el = document.createElement('span')
    el.className = 'confetti-piece'
    el.setAttribute('aria-hidden', 'true')
    el.style.left = `${Math.random() * 100}vw`
    el.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length]
    el.style.animationDuration = `${2.2 + Math.random() * 1.8}s`
    el.style.animationDelay = `${Math.random() * 0.6}s`
    el.style.setProperty('--drift', `${(Math.random() - 0.5) * 160}px`)
    el.style.setProperty('--spin', `${360 + Math.random() * 720}deg`)
    el.addEventListener('animationend', () => el.remove())
    document.body.appendChild(el)
  }
}
