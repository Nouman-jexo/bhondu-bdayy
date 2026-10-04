'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { PANDA_QUOTES } from '@/lib/birthday-data'
import { playTap } from '@/lib/sounds'

const ROTATE_MS = 5000

export function PandaAssistant() {
  const [index, setIndex] = useState(0)
  const [bump, setBump] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => {
      setIndex((i) => (i + 1) % PANDA_QUOTES.length)
      setBump((b) => b + 1)
    }, ROTATE_MS)
    return () => clearTimeout(id)
  }, [bump])

  const next = () => {
    playTap()
    setIndex((i) => (i + 1) % PANDA_QUOTES.length)
    setBump((b) => b + 1)
  }

  return (
    <div className="pointer-events-none fixed bottom-3 left-3 right-3 z-40 flex items-end gap-2 pb-[env(safe-area-inset-bottom)] sm:bottom-4 sm:left-4 sm:right-auto">
      <button
        type="button"
        onClick={next}
        aria-label="Tap the panda for the next message"
        className="panda-bob pointer-events-auto relative size-14 shrink-0 overflow-hidden rounded-2xl border-[3px] border-card bg-accent shadow-xl shadow-primary/30 transition-transform active:scale-90 sm:size-20 sm:border-4"
      >
        <Image
          src="/images/panda.png"
          alt=""
          width={80}
          height={80}
          className="size-full object-cover [image-rendering:pixelated]"
          priority
          style={{ visibility: 'hidden' }}
        />
      </button>

      <div aria-live="polite" className="min-w-0 max-w-60 flex-1 sm:flex-none">
        <button
          type="button"
          key={bump}
          onClick={next}
          className="bubble-in glass pointer-events-auto block w-full rounded-2xl rounded-bl-sm px-3 py-2 text-left text-xs font-semibold leading-snug text-foreground sm:px-4 sm:py-3 sm:text-sm"
        >
          {PANDA_QUOTES[index]}
        </button>
      </div>
    </div>
  )
}
