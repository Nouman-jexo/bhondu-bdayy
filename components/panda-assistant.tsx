'use client'

import { useState } from 'react'
import Image from 'next/image'
import { PANDA_QUOTES } from '@/lib/birthday-data'
import { playTap } from '@/lib/sounds'
import { cn } from '@/lib/utils'

export function PandaAssistant() {
  const [index, setIndex] = useState<number | null>(null)
  const [bump, setBump] = useState(0)

  const next = () => {
    playTap()
    setIndex((i) => (i === null ? 0 : (i + 1) % PANDA_QUOTES.length))
    setBump((b) => b + 1)
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 flex items-end gap-2 pb-[env(safe-area-inset-bottom)]">
      <button
        type="button"
        onClick={next}
        aria-label="Tap the panda for a message"
        className={cn(
          'panda-bob relative size-20 shrink-0 overflow-hidden rounded-2xl border-4 border-card bg-accent shadow-xl shadow-primary/30 transition-transform active:scale-90',
        )}
      >
        <Image
          src="/images/panda.png"
          alt=""
          width={80}
          height={80}
          className="size-full object-cover [image-rendering:pixelated]"
          priority
        />
      </button>

      <div aria-live="polite" className="max-w-[min(15rem,calc(100vw-8rem))]">
        {index === null ? (
          <span className="glass block rounded-2xl rounded-bl-sm px-3 py-2 text-xs font-bold text-primary">
            Tap me, Jaan! 🐼
          </span>
        ) : (
          <p
            key={bump}
            className="bubble-in glass rounded-2xl rounded-bl-sm px-4 py-3 text-sm font-semibold text-foreground"
          >
            {PANDA_QUOTES[index]}
          </p>
        )}
      </div>
    </div>
  )
}
