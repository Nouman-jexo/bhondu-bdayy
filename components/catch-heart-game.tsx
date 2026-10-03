'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { confettiRain, heartBurst } from '@/lib/effects'
import { playBuzz, playChime, playPop } from '@/lib/sounds'

const GOAL = 6
const TIME_LIMIT = 12
const MOVE_EVERY_MS = 800

type Status = 'idle' | 'playing' | 'won' | 'lost'

function randomSpot() {
  return { x: 8 + Math.random() * 76, y: 8 + Math.random() * 72 }
}

export function CatchHeartGame() {
  const [status, setStatus] = useState<Status>('idle')
  const [caught, setCaught] = useState(0)
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [spot, setSpot] = useState({ x: 45, y: 40 })

  useEffect(() => {
    if (status !== 'playing') return
    const tick = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    const move = setInterval(() => setSpot(randomSpot()), MOVE_EVERY_MS)
    return () => {
      clearInterval(tick)
      clearInterval(move)
    }
  }, [status])

  useEffect(() => {
    if (status === 'playing' && timeLeft <= 0) {
      setStatus('lost')
      playBuzz()
    }
  }, [status, timeLeft])

  const start = () => {
    setCaught(0)
    setTimeLeft(TIME_LIMIT)
    setSpot(randomSpot())
    setStatus('playing')
  }

  const catchHeart = (e: React.PointerEvent) => {
    if (status !== 'playing') return
    heartBurst(e.clientX, e.clientY, 8)
    const next = caught + 1
    setCaught(next)
    setSpot(randomSpot())
    if (next >= GOAL) {
      setStatus('won')
      playChime()
      confettiRain(70)
    } else {
      playPop()
    }
  }

  return (
    <section aria-labelledby="catch-title" className="glass flex flex-col gap-4 rounded-3xl p-5">
      <header className="flex flex-col gap-1">
        <h2 id="catch-title" className="font-display text-2xl text-foreground">
          Catch My Heart 💘
        </h2>
        <p className="text-sm text-muted-foreground">
          {`Mera dil bohot bhaag raha hai! ${TIME_LIMIT} seconds mein ${GOAL} baar pakdo aur ek secret Virtual Hug unlock karo.`}
        </p>
      </header>

      <div className="relative h-72 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/40 to-accent/30">
        {status === 'playing' && (
          <>
            <div className="absolute inset-x-3 top-3 flex justify-between text-sm font-bold">
              <span className="rounded-full bg-card/80 px-3 py-1 text-primary">
                {'Pakra: '}
                {caught}/{GOAL}
              </span>
              <span className="rounded-full bg-card/80 px-3 py-1 text-foreground" aria-live="polite">
                {timeLeft}s
              </span>
            </div>
            <button
              type="button"
              aria-label="Catch the heart"
              onPointerDown={catchHeart}
              className="absolute flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-all duration-300 ease-out active:scale-75"
              style={{ left: `${spot.x}%`, top: `${spot.y + 10}%` }}
            >
              <Heart className="heart-beat size-12 fill-primary text-primary drop-shadow-[0_0_14px_var(--primary)]" />
            </button>
          </>
        )}

        {status !== 'playing' && (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
            {status === 'won' ? (
              <div className="hug-reveal flex flex-col items-center gap-2">
                <span className="text-6xl" aria-hidden="true">
                  🤗
                </span>
                <p className="font-display text-2xl text-primary">Virtual Birthday Hug Unlocked!</p>
                <p className="text-pretty text-sm font-medium text-foreground">
                  {'Ek bohot bari, bohot tight wali jhappi sirf apke liye, Meri Jaan! Isko save kar lo, jab bhi miss karo use kar lena 💞'}
                </p>
              </div>
            ) : status === 'lost' ? (
              <>
                <span className="text-5xl" aria-hidden="true">
                  🙈
                </span>
                <p className="text-pretty font-semibold text-foreground">
                  {`Oho! Sirf ${caught} baar pakra. Dil itni asani se nahi milta, dobara try karo!`}
                </p>
              </>
            ) : (
              <>
                <Heart className="heart-beat size-16 fill-primary text-primary" />
                <p className="font-semibold text-foreground">Ready ho? Mera dil pakarne ka time!</p>
              </>
            )}
            <Button onClick={start} size="lg" className="mt-1 rounded-full px-8 font-bold">
              {status === 'idle' ? 'Start Game' : status === 'won' ? 'Phir se khelo' : 'Try Again'}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
