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

    // 1. Instantly trigger the browser's native notification popup
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        await Notification.requestPermission();
      } catch (err) {
        console.error('Notification permission error:', err);
      }
    }

    // 2. Notify OneSignal SDK v16 of the permission request
    if (typeof window !== 'undefined') {
      window.OneSignalDeferred = window.OneSignalDeferred || [];
      window.OneSignalDeferred.push(async function(OneSignal: any) {
        if (OneSignal.Notifications && OneSignal.Notifications.requestPermission) {
          await OneSignal.Notifications.requestPermission();
        }
      });
    }
  }

  const getNoText = () => {
    return noTexts[Math.min(noCount, noTexts.length - 1)]
  }

  return (
    <>
      {/* Top Left Floating Button */}
      <div className="fixed top-4 left-4 z-[9999]">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-[#e85d4a] hover:bg-[#d64b38] text-white rounded-full font-bold shadow-lg transition-all animate-bounce text-sm md:text-base font-sans"
        >
          Click Here For Daily Surprises🎁
        </button>
      </div>

      {/* Modal Popup overlay */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-[10000] bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl flex flex-col items-center gap-6">
            
            <p className="text-xl md:text-2xl font-semibold text-gray-800 font-sans">
              Ummm, Roz Roz ki tarah Roz Roz surprises chahiye kyaa👉🏻👈🏻? <br />
              <span className="text-sm text-gray-500 font-normal mt-2 block">
                (NO kiya to piti piti hojayegi)
              </span>
            </p>
            
            <div className="flex items-center justify-center gap-4 w-full min-h-[100px] my-2 relative overflow-visible">
              {/* YES Button - Gets 15% larger each click! */}
              <button
                onClick={handleYes}
                style={{ transform: `scale(${1 + noCount * 0.15})` }}
                className="px-6 py-2 bg-[#e85d4a] hover:bg-[#d64b38] text-white rounded-full font-bold shadow-md transition-all duration-200 whitespace-nowrap z-20"
              >
                YES ❤️
              </button>
              
              {/* NO Button - Sits side-by-side and shrinks! */}
              {noCount < 5 && (
                <button
                  onClick={handleNo}
                  style={{ transform: `scale(${Math.max(1 - noCount * 0.18, 0.2)})` }}
                  className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full font-bold shadow-md transition-all duration-200 whitespace-nowrap z-10"
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
