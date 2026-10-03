'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Delete, Heart, LockKeyhole, LockKeyholeOpen } from 'lucide-react'
import { SECRET_PIN, WRONG_PIN_MESSAGES } from '@/lib/birthday-data'
import { confettiRain, heartBurst } from '@/lib/effects'
import { playBuzz, playChime, playTap } from '@/lib/sounds'
import { cn } from '@/lib/utils'

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'clear', '0', 'back'] as const

export function LockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [shaking, setShaking] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const lastErrorRef = useRef(-1)
  const lockRef = useRef<HTMLDivElement>(null)

  const checkPin = useCallback(
    (value: string) => {
      if (value === SECRET_PIN) {
        setUnlocked(true)
        setError(null)
        playChime()
        const rect = lockRef.current?.getBoundingClientRect()
        if (rect) heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 34)
        confettiRain()
        setTimeout(onUnlock, 1100)
        return
      }
      let index = Math.floor(Math.random() * WRONG_PIN_MESSAGES.length)
      if (index === lastErrorRef.current) index = (index + 1) % WRONG_PIN_MESSAGES.length
      lastErrorRef.current = index
      setError(WRONG_PIN_MESSAGES[index])
      setShaking(true)
      playBuzz()
      setTimeout(() => {
        setShaking(false)
        setPin('')
      }, 600)
    },
    [onUnlock],
  )

  const press = useCallback(
    (key: string) => {
      if (unlocked || shaking) return
      playTap()
      if (key === 'clear') return setPin('')
      if (key === 'back') return setPin((p) => p.slice(0, -1))
      setPin((p) => {
        if (p.length >= SECRET_PIN.length) return p
        const next = p + key
        if (next.length === SECRET_PIN.length) setTimeout(() => checkPin(next), 150)
        return next
      })
    },
    [checkPin, shaking, unlocked],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key)
      else if (e.key === 'Backspace') press('back')
      else if (e.key === 'Escape') press('clear')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [press])

  return (
    <main
      className={cn(
        'mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center gap-[clamp(0.5rem,2.2dvh,1.5rem)] overflow-x-hidden px-4 py-[clamp(0.75rem,3dvh,2.5rem)] transition-all duration-700',
        unlocked && 'scale-105 opacity-0',
      )}
    >
      <div ref={lockRef} className="relative flex shrink-0 items-center justify-center">
        <div className="absolute size-[clamp(4rem,14dvh,9rem)] animate-pulse rounded-full bg-primary/30 blur-2xl" />
        <div className="heart-beat relative flex size-[clamp(3.5rem,12dvh,7rem)] items-center justify-center">
          <Heart className="absolute size-full fill-primary text-primary drop-shadow-[0_0_20px_var(--primary)]" />
          {unlocked ? (
            <LockKeyholeOpen className="relative mt-1 size-[35%] text-primary-foreground" />
          ) : (
            <LockKeyhole className="relative mt-1 size-[35%] text-primary-foreground" />
          )}
        </div>
      </div>

      <div className="w-full text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-primary sm:text-sm">Suno Jaan!</p>
        <h1 className="mt-1 text-balance font-display text-[clamp(1.25rem,6.5vw,1.875rem)] leading-snug text-foreground">
          Unlock my heart with the special date! ❤️
        </h1>
        <p className="mt-1.5 text-pretty text-xs text-muted-foreground sm:text-sm">
          {'Woh din yaad hai? Date daalo (DDMMYYYY) aur andar aajao...'}
        </p>
      </div>

      <div
        className={cn('flex w-full max-w-xs justify-center gap-1 sm:gap-2', shaking && 'shake')}
        role="img"
        aria-label={`${pin.length} of ${SECRET_PIN.length} digits entered`}
      >
        {Array.from({ length: SECRET_PIN.length }, (_, i) => {
          const filled = i < pin.length
          return (
            <span
              key={i}
              className={cn(
                'flex aspect-square min-w-0 max-w-10 flex-1 items-center justify-center rounded-lg border-2 text-base transition-all duration-200 sm:rounded-xl sm:text-lg',
                filled
                  ? 'scale-105 border-primary bg-primary/15 text-primary shadow-[0_0_14px_var(--primary)]'
                  : 'border-primary/30 bg-card/50',
                i === pin.length && !unlocked && 'border-primary/70',
                (i === 1 || i === 3) && 'mr-1 sm:mr-2',
              )}
            >
              {filled ? '♥' : ''}
            </span>
          )
        })}
      </div>

      <p
        aria-live="assertive"
        className="min-h-8 w-full max-w-xs text-pretty text-center text-xs font-semibold leading-snug text-destructive sm:min-h-10 sm:text-sm"
      >
        {error}
      </p>

      <div className="glass grid w-full max-w-72 shrink-0 grid-cols-3 gap-2 rounded-3xl p-3 sm:gap-3 sm:p-4">
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => press(key)}
            aria-label={key === 'back' ? 'Delete digit' : key === 'clear' ? 'Clear all' : `Digit ${key}`}
            className={cn(
              'flex h-[clamp(2.5rem,7.5dvh,3.5rem)] items-center justify-center rounded-2xl text-lg sm:text-xl font-bold transition-all active:scale-90 focus-visible:outline-2 focus-visible:outline-primary',
              key === 'clear' || key === 'back'
                ? 'text-sm text-muted-foreground hover:bg-primary/10'
                : 'bg-card/70 text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground',
            )}
          >
            {key === 'back' ? <Delete className="size-5" /> : key === 'clear' ? 'Clear' : key}
          </button>
        ))}
      </div>
    </main>
  )
}
