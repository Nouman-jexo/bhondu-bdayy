'use client'

import { useState } from 'react'

export function SurpriseButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [noCount, setNoCount] = useState(0)

  // The text sequence for the NO button
  const noTexts = [
    "NO",
    "Yawr ni naw",
    "ye ni dabana",
    "arey YES krlo naw :("
  ]

  const handleNo = () => {
    setNoCount((prev) => prev + 1)
  }

  const handleYes = async () => {
    setIsOpen(false)
    
    // Trigger the OneSignal permission prompt natively
    if (typeof window !== 'undefined' && window.OneSignal) {
      await window.OneSignal.Notifications.requestPermission();
    } else {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal) {
        await OneSignal.Notifications.requestPermission();
      });
    }
  }

  // Get the current NO text, stay on the last one if clicked too many times
  const getNoText = () => {
    return noTexts[Math.min(noCount, noTexts.length - 1)]
  }

  return (
    <>
      {/* Top Right Floating Button */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-[#e85d4a] hover:bg-[#d64b38] text-white rounded-full font-bold shadow-lg transition-all animate-bounce text-sm md:text-base font-sans"
        >
          Click Here For Daily Surprises🎁
        </button>
      </div>

      {/* Modal Popup overlay */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center gap-6">
            
            <p className="text-xl md:text-2xl font-semibold text-gray-800 font-sans">
              Ummm, Roz Roz ki tarah Roz Roz surprises chahiye kyaa👉🏻👈🏻? <br />
              <span className="text-sm text-gray-500 font-normal mt-2 block">
                (NO kiya to piti piti hojayegi)
              </span>
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4 w-full h-32 mt-4 relative">
              {/* YES Button - Gets larger! */}
              <button
                onClick={handleYes}
                style={{ transform: `scale(${1 + noCount * 0.15})` }}
                className="px-6 py-2 bg-[#e85d4a] text-white rounded-full font-bold shadow-md transition-all whitespace-nowrap z-10"
              >
                YES ❤️
              </button>
              
              {/* NO Button - Gets smaller! Completely hides if clicked 6 times */}
              {noCount < 6 && (
                <button
                  onClick={handleNo}
                  style={{ transform: `scale(${Math.max(1 - noCount * 0.15, 0)})` }}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-bold shadow-md transition-all whitespace-nowrap absolute"
                >
                  {getNoText()}
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  )
}
