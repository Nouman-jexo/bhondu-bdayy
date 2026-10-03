const HEARTS = Array.from({ length: 18 }, (_, i) => ({
  left: (i * 37) % 100,
  size: 12 + ((i * 7) % 20),
  duration: 9 + ((i * 5) % 9),
  delay: -((i * 1.7) % 14),
  opacity: 0.25 + ((i * 3) % 5) / 10,
  glyph: ['♥', '❤', '♡'][i % 3],
}))

export function FloatingHearts() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-24 top-10 size-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute -right-20 top-1/3 size-80 rounded-full bg-accent/40 blur-3xl" />
      <div className="absolute bottom-0 left-1/4 size-72 rounded-full bg-chart-2/30 blur-3xl" />
      {HEARTS.map((heart, i) => (
        <span
          key={i}
          className="floating-heart text-primary"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}s`,
            animationDelay: `${heart.delay}s`,
            opacity: heart.opacity,
          }}
        >
          {heart.glyph}
        </span>
      ))}
    </div>
  )
}
