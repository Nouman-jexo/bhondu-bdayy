'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// List of provided photos of both gf and user
const FLOATING_PHOTOS = [
  { src: '/images/gf-1.jpeg', alt: 'Aleena outdoors', size: 120, top: '6%', left: '4%', dur: '18s', delay: '0s', rotate: '-6deg' },
  { src: '/images/user-1.jpeg', alt: 'Selfie', size: 110, top: '5%', right: '6%', dur: '22s', delay: '-4s', rotate: '8deg' },
  { src: '/images/gf-2.jpeg', alt: 'Aleena smiling', size: 130, top: '34%', left: '2%', dur: '20s', delay: '-8s', rotate: '5deg' },
  { src: '/images/user-2.jpeg', alt: 'Warm smile', size: 115, top: '36%', right: '3%', dur: '24s', delay: '-12s', rotate: '-7deg' },
  { src: '/images/gf-3.jpeg', alt: 'Aleena selfie', size: 110, top: '64%', left: '6%', dur: '19s', delay: '-3s', rotate: '-4deg' },
  { src: '/images/user-3.jpeg', alt: 'Gentle smile', size: 125, top: '66%', right: '7%', dur: '21s', delay: '-15s', rotate: '6deg' },
  { src: '/images/gf-4.jpeg', alt: 'Aleena laughing', size: 105, top: '20%', left: '18%', dur: '26s', delay: '-6s', rotate: '9deg' },
  { src: '/images/user-4.jpeg', alt: 'Sitting relaxed', size: 115, top: '50%', left: '22%', dur: '23s', delay: '-10s', rotate: '-8deg' },
  { src: '/images/gf-5.jpeg', alt: 'Aleena portrait', size: 120, top: '80%', left: '28%', dur: '25s', delay: '-2s', rotate: '4deg' },
  { src: '/images/user-5.jpeg', alt: 'Close portrait', size: 115, top: '20%', right: '16%', dur: '27s', delay: '-7s', rotate: '-5deg' },
]

export function LoveDeclaration() {
  const [inView, setInView] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    // Trigger only when user scrolls to this section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setInView(true)
          }
        })
      },
      {
        threshold: [0.5, 0.75, 1.0],
      },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      aria-label="I Love You, Meri Jaan"
      className="relative my-4 flex min-h-[95dvh] w-full items-center justify-center overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-primary/5 via-card/80 to-primary/15 px-4 py-16 shadow-2xl"
    >
      {/* Background floating photos with soft fading, gentle blur and slow floating motion */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {FLOATING_PHOTOS.map((photo, i) => (
          <div
            key={i}
            className="photo-drift absolute transition-opacity duration-1000"
            style={{
              top: photo.top,
              left: photo.left,
              right: photo.right,
              width: `clamp(75px, 22vw, ${photo.size}px)`,
              height: `clamp(75px, 22vw, ${photo.size}px)`,
              animationDuration: photo.dur,
              animationDelay: photo.delay,
              transform: `rotate(${photo.rotate})`,
              opacity: inView ? 0.32 : 0.12,
            }}
          >
            <div className="relative size-full overflow-hidden rounded-2xl border border-primary/30 shadow-[0_10px_25px_rgba(219,39,119,0.25)] ring-2 ring-white/20">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="150px"
                className="object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent mix-blend-overlay" />
            </div>
          </div>
        ))}

        {/* Ambient radial glow in center to keep text legible */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,245,248,0.78)_0%,rgba(255,245,248,0.35)_55%,transparent_85%)] dark:bg-[radial-gradient(circle_at_center,rgba(40,16,28,0.85)_0%,rgba(40,16,28,0.45)_55%,transparent_85%)]" />
      </div>

      {/* Main Calligraphy & Italic Text - Reveals left-to-right when scrolled completely */}
      <div className="relative z-10 flex max-w-full flex-col items-center justify-center text-center">
        <div
          className={`reveal-left-to-right px-2 ${
            inView ? 'revealed' : ''
          }`}
        >
          <p
            className="select-none font-display text-[clamp(2.1rem,11.5vw,4.5rem)] italic leading-tight tracking-wide text-primary drop-shadow-[0_4px_22px_rgba(219,39,119,0.45)]"
            style={{ fontStyle: 'italic' }}
          >
            {'I Love You, Meri Jaan!'}
          </p>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2 text-primary">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary/60" />
            <span className="heart-beat inline-block text-xl">💖</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-primary/60" />
          </div>
        </div>

        {inView && (
          <p className="animate-fade-in mt-6 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Forever & Always
          </p>
        )}
      </div>
    </section>
  )
}
