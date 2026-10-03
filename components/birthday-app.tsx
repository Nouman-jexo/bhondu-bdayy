'use client'

import { useCallback, useState } from 'react'
import { BalloonGame } from '@/components/balloon-game'
import { CatchHeartGame } from '@/components/catch-heart-game'
import { FloatingHearts } from '@/components/floating-hearts'
import { Hero } from '@/components/hero'
import { InstallPrompt } from '@/components/install-prompt'
import { LockScreen } from '@/components/lock-screen'
import { LoveLetter } from '@/components/love-letter'
import { LoveToast } from '@/components/love-toast'
import { PandaAssistant } from '@/components/panda-assistant'
import { ReasonsSection } from '@/components/reasons-section'

export function BirthdayApp() {
  const [unlocked, setUnlocked] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const handleUnlock = useCallback(() => {
    setUnlocked(true)
    setToast('Access Granted! Welcome my Princess 🎉')
    setTimeout(() => setToast(null), 3200)
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <>
      <FloatingHearts />
      <LoveToast message={toast} />
      {unlocked ? (
        <>
          <main className="page-in mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 pb-36">
            <Hero />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <BalloonGame />
              <CatchHeartGame />
            </div>
            <ReasonsSection />
            <LoveLetter />
            <InstallPrompt />
            <footer className="pt-4 text-center font-display text-xl text-primary">
              Hamesha apka, sirf apka 💖
            </footer>
          </main>
          <PandaAssistant />
        </>
      ) : (
        <LockScreen onUnlock={handleUnlock} />
      )}
    </>
  )
}
