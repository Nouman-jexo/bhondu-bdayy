'use client'

import { useEffect, useState } from 'react'
import { Download, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<InstallEvent | null>(null)
  const [isIos, setIsIos] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    setInstalled(standalone)
    setIsIos(/iphone|ipad|ipod/i.test(navigator.userAgent))

    const onPrompt = (e: Event) => {
      e.preventDefault()
      setDeferred(e as InstallEvent)
    }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  if (installed || (!deferred && !isIos)) return null

  return (
    <aside className="glass flex flex-col items-center gap-3 rounded-3xl p-5 text-center">
      <p className="font-display text-xl text-foreground">Apne phone pe hamesha ke liye rakh lo 📲</p>
      {deferred ? (
        <Button
          className="rounded-full px-6 font-bold"
          onClick={async () => {
            await deferred.prompt()
            await deferred.userChoice
            setDeferred(null)
          }}
        >
          <Download className="size-4" />
          Install App
        </Button>
      ) : (
        <p className="flex flex-wrap items-center justify-center gap-1 text-sm text-muted-foreground">
          Safari mein <Share className="inline size-4" aria-label="Share" /> dabao, phir{' '}
          <strong className="text-foreground">{'"Add to Home Screen"'}</strong>
        </p>
      )}
    </aside>
  )
}
