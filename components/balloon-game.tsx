'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import { BALLOON_COMPLIMENTS } from '@/lib/birthday-data'
import { heartBurst } from '@/lib/effects'
import { playPop } from '@/lib/sounds'

type Balloon = { id: number; left: number; duration: number; heart: boolean; color: string; size: number }

const COLORS = ['#f472b6', '#ec4899', '#f9a8d4', '#e8a598', '#db2777', '#fbcfe8']
const MAX_BALLOONS = 7

export function BalloonGame() {
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [latestCompliment, setLatestCompliment] = useState<string | null>(null)
  const [complimentKey, setComplimentKey] = useState(0)
  const [count, setCount] = useState(0)
  const idRef = useRef(0)
  const complimentTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const spawn = () => {
      setBalloons((list) => {
        if (list.length >= MAX_BALLOONS) return list
        const id = idRef.current++
        return [
          ...list,
          {
            id,
            left: 6 + Math.random() * 74,
            duration: 5 + Math.random() * 3,
            heart: Math.random() > 0.5,
            color: COLORS[id % COLORS.length],
            size: 52 + Math.random() * 18,
          },
        ]
      })
    }
    spawn()
    const timer = setInterval(spawn, 850)
    return () => {
      clearInterval(timer)
      if (complimentTimeoutRef.current) clearTimeout(complimentTimeoutRef.current)
    }
  }, [])

  const removeBalloon = (id: number) => setBalloons((list) => list.filter((b) => b.id !== id))

  const pop = (balloon: Balloon, e: React.PointerEvent) => {
    removeBalloon(balloon.id)
    playPop()
    heartBurst(e.clientX, e.clientY, 10)
    setCount((c) => c + 1)

    const randomCompliment = BALLOON_COMPLIMENTS[Math.floor(Math.random() * BALLOON_COMPLIMENTS.length)]
    setLatestCompliment(randomCompliment)
    setComplimentKey((k) => k + 1)

    if (complimentTimeoutRef.current) clearTimeout(complimentTimeoutRef.current)
    complimentTimeoutRef.current = setTimeout(() => {
      setLatestCompliment(null)
    }, 2800)
  }

  return (
    <section aria-labelledby="balloon-title" className="glass flex flex-col gap-4 rounded-3xl p-4 sm:p-5">
      <header className="flex flex-col gap-1">
        <h2 id="balloon-title" className="font-display text-xl text-foreground sm:text-2xl">
          Pop the Love Balloons 🎈
        </h2>
        <p className="text-xs text-muted-foreground sm:text-sm">
          Har balloon mein ek chota sa compliment chupa hai. Jaldi jaldi pop karo!
        </p>
      </header>

      {/* Prominent compliment banner that NEVER crops out */}
      <div className="flex min-h-12 w-full items-center justify-center">
        {latestCompliment ? (
          <div
            key={complimentKey}
            className="toast-in flex w-full max-w-sm items-center justify-center gap-1.5 rounded-2xl border border-primary/40 bg-card/95 px-3 py-2 text-center shadow-lg backdrop-blur-md"
          >
            <span className="text-sm">✨</span>
            <span className="font-display text-sm font-bold text-primary sm:text-base">
              {latestCompliment}
            </span>
            <span className="text-sm">💖</span>
          </div>
        ) : (
          <p className="text-center text-xs italic text-muted-foreground">
            Kisi bhi balloon ko tap karo compliment dekhne ke liye!
          </p>
        )}
      </div>

      <div className="relative h-72 touch-manipulation overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-card/40 to-primary/10">
        {balloons.map((b) => (
          <button
            key={b.id}
            type="button"
            aria-label="Pop balloon"
            onPointerDown={(e) => pop(b, e)}
            onAnimationEnd={() => removeBalloon(b.id)}
            className="balloon absolute -bottom-28 flex flex-col items-center"
            style={{ left: `${b.left}%`, animationDuration: `${b.duration}s` }}
          >
            {b.heart ? (
              <Heart
                style={{ width: b.size, height: b.size, color: b.color, fill: b.color }}
                className="drop-shadow-[0_6px_10px_rgba(219,39,119,0.35)]"
              />
            ) : (
              <span
                className="block rounded-[50%_50%_48%_48%/55%_55%_45%_45%] shadow-[inset_-8px_-10px_0_rgba(0,0,0,0.08)]"
                style={{
                  width: b.size * 0.85,
                  height: b.size,
                  background: `radial-gradient(circle at 30% 28%, rgba(255,255,255,0.75), ${b.color} 45%)`,
                }}
              />
            )}
            <span className="h-10 w-px bg-foreground/30" />
          </button>
        ))}
      </div>

      <p className="text-center text-sm font-bold text-foreground" aria-live="polite">
        Balloons Popped for Aleena: <span className="text-lg text-primary">{count}</span>
      </p>
    </section>
  )
}
