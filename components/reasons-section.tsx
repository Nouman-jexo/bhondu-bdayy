'use client'

import { useState } from 'react'
import { REASONS } from '@/lib/birthday-data'
import { playTap } from '@/lib/sounds'
import { cn } from '@/lib/utils'

function ReasonCard({ reason, index }: { reason: (typeof REASONS)[number]; index: number }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <button
      type="button"
      onClick={() => {
        playTap()
        setFlipped((f) => !f)
      }}
      aria-pressed={flipped}
      aria-label={flipped ? `${reason.title}: ${reason.text}` : `Reason ${index + 1}: ${reason.title}. Tap to reveal`}
      className="flip-card h-48 w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      <div className={cn('flip-inner', flipped && 'is-flipped')}>
        <div className="flip-face glass flex flex-col items-center justify-center gap-2 rounded-3xl p-5 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Reason #{index + 1}</span>
          <span className="text-4xl" aria-hidden="true">
            {reason.emoji}
          </span>
          <span className="font-display text-xl text-foreground">{reason.title}</span>
          <span className="text-xs text-muted-foreground">Tap karo 💌</span>
        </div>
        <div className="flip-face flip-back flex items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-chart-1 p-5 text-center shadow-lg shadow-primary/30">
          <p className="text-pretty text-sm font-semibold leading-relaxed text-primary-foreground">{reason.text}</p>
        </div>
      </div>
    </button>
  )
}

export function ReasonsSection() {
  return (
    <section aria-labelledby="reasons-title" className="flex flex-col gap-4">
      <header className="flex flex-col gap-1 text-center">
        <h2 id="reasons-title" className="font-display text-3xl text-foreground">
          Reasons Why You Are Special To Me 💌
        </h2>
        <p className="text-sm text-muted-foreground">Har card palto aur dekho ap mere liye kya ho...</p>
      </header>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {REASONS.map((reason, i) => (
          <ReasonCard key={reason.title} reason={reason} index={i} />
        ))}
      </div>
    </section>
  )
}
