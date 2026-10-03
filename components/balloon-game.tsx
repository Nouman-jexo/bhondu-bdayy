'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import { BALLOON_COMPLIMENTS } from '@/lib/birthday-data'
import { heartBurst } from '@/lib/effects'
import { playPop } from '@/lib/sounds'

type Balloon = { id: number; left: number; duration: number; heart: boolean; color: string; size: number }
type Popup = { id: number; x: number; y: number; text: string }

const COLORS = ['#f472b6', '#ec4899', '#f9a8d4', '#e8a598', '#db2777', '#fbcfe8']
const MAX_BALLOONS = 7

export function BalloonGame() {
  const [balloons, setBalloons] = useState<Balloon[]>([])
  const [popups, setPopups] = useState<Popup[]>([])
  const [count, setCount] = useState(0)
  const idRef = useRef(0)
  const areaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spawn = () => {
      setBalloons((list) => {
        if (list.length >= MAX_BALLOONS) return list
        const id = idRef.current++
        return [
          ...list,
          {
            id,
            left: 5 + Math.random() * 75,
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
    return () => clearInterval(timer)
  }, [])

  const removeBalloon = (id: number) => setBalloons((list) => list.filter((b) => b.id !== id))

  const pop = (balloon: Balloon, e: React.PointerEvent) => {
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    removeBalloon(balloon.id)
    playPop()
    heartBurst(e.clientX, e.clientY, 10)
    setCount((c) => c + 1)
    const popup: Popup = {
      id: balloon.id,
      x: Math.min(Math.max(e.clientX - rect.left, 70), rect.width - 70),
      y: e.clientY - rect.top,
      text: BALLOON_COMPLIMENTS[Math.floor(Math.random() * BALLOON_COMPLIMENTS.length)],
    }
    setPopups((list) => [...list, popup])
    setTimeout(() => setPopups((list) => list.filter((p) => p.id !== popup.id)), 1600)
  }

  return (
    <section aria-labelledby="balloon-title" className="glass flex flex-col gap-4 rounded-3xl p-5">
      <header className="flex flex-col gap-1">
        <h2 id="balloon-title" className="font-display text-2xl text-foreground">
          Pop the Love Balloons 🎈
        </h2>
        <p className="text-sm text-muted-foreground">
          Har balloon mein ek chota sa compliment chupa hai. Jaldi jaldi pop karo!
        </p>
      </header>

      <div
        ref={areaRef}
        className="relative h-80 touch-manipulation overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-b from-card/40 to-primary/10"
      >
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

        {popups.map((p) => (
          <span
            key={p.id}
            className="compliment-pop pointer-events-none absolute -translate-x-1/2 whitespace-nowrap rounded-full bg-card px-3 py-1.5 text-sm font-bold text-primary shadow-lg"
            style={{ left: p.x, top: p.y }}
          >
            {p.text}
          </span>
        ))}
      </div>

      <p className="text-center text-sm font-bold text-foreground" aria-live="polite">
        Balloons Popped for Aleena: <span className="text-lg text-primary">{count}</span>
      </p>
    </section>
  )
}
