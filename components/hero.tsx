'use client'

import { useRef, useState } from 'react'
import { sparkle } from '@/lib/effects'
import { cn } from '@/lib/utils'

function Letter({ char, index }: { char: string; index: number }) {
  const [bouncing, setBouncing] = useState(false)
  return (
    <span
      onPointerEnter={() => setBouncing(true)}
      onPointerDown={() => setBouncing(true)}
      onAnimationEnd={(e) => e.animationName === 'letter-bounce' && setBouncing(false)}
      className={cn('gradient-letter inline-block cursor-pointer select-none', bouncing && 'letter-bounce')}
      style={{ animationDelay: bouncing ? '0s' : `${index * -0.15}s` }}
    >
      {char}
    </span>
  )
}

function Word({ text, start }: { text: string; start: number }) {
  return (
    <span className="whitespace-nowrap">
      {text.split('').map((char, i) => (
        <Letter key={i} char={char} index={start + i} />
      ))}
    </span>
  )
}

export function Hero() {
  const lastSparkle = useRef(0)

  const handleMove = (e: React.PointerEvent) => {
    const now = performance.now()
    if (now - lastSparkle.current < 45) return
    lastSparkle.current = now
    sparkle(e.clientX, e.clientY)
  }

  return (
    <section
      onPointerMove={handleMove}
      aria-labelledby="hero-title"
      className="flex touch-pan-y flex-col items-center gap-4 overflow-hidden pb-6 pt-10 text-center sm:pt-14"
    >
      <p className="rounded-full border border-primary/30 bg-card/60 px-4 py-1 text-xs font-bold uppercase tracking-widest text-primary backdrop-blur">
        15 . 10 . Aaj apka din hai
      </p>
      <h1
        id="hero-title"
        className="w-full max-w-full font-display text-[clamp(2.25rem,13vw,4.5rem)] leading-tight"
      >
        <span className="sr-only">Happy Birthday Aleena!</span>
        <span aria-hidden="true" className="flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-1">
          <Word text="Happy" start={0} />
          <Word text="Birthday" start={6} />
          <span className="flex items-center gap-[0.2em]">
            <Word text="Aleena!" start={14} />
            <span className="wiggle inline-block text-[0.7em]">🎉💖</span>
          </span>
        </span>
      </h1>
      <p className="max-w-sm text-pretty text-base font-medium text-muted-foreground sm:text-lg">
        A tiny digital world dedicated only to you, my favorite human!
      </p>
      <p className="text-xs text-muted-foreground/80">{'(Letters ko touch karo aur ungli ghumao ✨)'}</p>
    </section>
  )
}
