export function LoveToast({ message }: { message: string | null }) {
  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-3 z-40 flex justify-center px-14"
    >
      <div
        key={message}
        className="toast-in glass max-w-xs rounded-full border border-primary/30 px-4 py-1.5 text-center text-xs font-bold text-foreground shadow-xl sm:text-sm"
      >
        {message}
      </div>
    </div>
  )
}
