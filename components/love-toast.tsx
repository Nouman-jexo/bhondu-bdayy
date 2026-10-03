export function LoveToast({ message }: { message: string | null }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      {message && (
        <div
          key={message}
          className="toast-in glass rounded-full px-5 py-3 text-center text-sm font-bold text-foreground"
        >
          {message}
        </div>
      )}
    </div>
  )
}
