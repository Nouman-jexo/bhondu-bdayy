'use client'

import { useEffect, useRef, useState } from 'react'
import { Music, Volume2, VolumeX } from 'lucide-react'

const AUDIO_SRC = '/audio/bgm.mp3'

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC)
    audio.loop = true
    audio.volume = 0.55
    audio.preload = 'auto'
    audioRef.current = audio

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    // Attempt auto-play on first user touch/click/keypress anywhere on document
    const unlockAudio = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            // Started successfully
          })
          .catch(() => {
            // Autoplay prevented by browser until explicit button click
          })
      }
    }

    window.addEventListener('pointerdown', unlockAudio, { once: true })
    window.addEventListener('keydown', unlockAudio, { once: true })

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.pause()
      audio.src = ''
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch((err) => {
        console.warn('Playback failed:', err)
      })
    }
  }

  return (
    <aside aria-label="Background music controls" className="fixed right-3 top-3 z-50">
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'Mute background music (Mera Mann Kehne Laga)' : 'Play background music (Mera Mann Kehne Laga)'}
        title={isPlaying ? 'Mute: Mera Mann Kehne Laga' : 'Play: Mera Mann Kehne Laga'}
        className="glass group flex size-11 items-center justify-center rounded-full border border-primary/30 text-primary shadow-lg transition-transform active:scale-95 sm:size-12"
      >
        {isPlaying ? (
          <span className="relative flex items-center justify-center">
            <Volume2 className="size-5 transition-transform group-hover:scale-110" />
            <span className="absolute -right-1 -top-1 flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
            </span>
          </span>
        ) : (
          <span className="relative flex items-center justify-center">
            <VolumeX className="size-5 text-muted-foreground transition-transform group-hover:scale-110" />
            <Music className="absolute -bottom-1 -right-1 size-2.5 text-primary" />
          </span>
        )}
      </button>
    </aside>
  )
}
