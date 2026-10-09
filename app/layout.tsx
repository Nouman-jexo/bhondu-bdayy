import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Pacifico, Quicksand } from 'next/font/google'
import Script from 'next/script'
import { SurpriseButton } from '@/components/surprise-button'
import './globals.css'

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
})
const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
})

export const metadata: Metadata = {
  title: 'Happy Birthday Aleena! 💖',
  description: 'A tiny digital world dedicated only to you, my favorite human!',
  applicationName: 'For Aleena',
  manifest: '/manifest.webmanifest', // Added missing manifest link
  appleWebApp: {
    capable: true,
    title: 'For Aleena',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#e85d4a',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${quicksand.variable} ${pacifico.variable} light bg-background`}>
      <body className="overflow-x-hidden font-sans antialiased">
        <SurpriseButton />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}

       {/* Service Worker Registration - Fixes Load Event Race Condition */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              function registerSW() {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                  .then(function(reg) {
                    console.log('SW Registered successfully:', reg.scope);
                    reg.update();
                  })
                  .catch(function(err) {
                    console.error('SW Registration failed:', err);
                  });
              }

              if (document.readyState === 'complete' || document.readyState === 'interactive') {
                registerSW();
              } else {
                window.addEventListener('load', registerSW);
              }
            }
          `}
        </Script>
        {/* OneSignal Push Notifications */}
        <Script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          strategy="afterInteractive"
        />
        <Script id="onesignal-init" strategy="afterInteractive">
          {`
            window.OneSignalDeferred = window.OneSignalDeferred || [];
            OneSignalDeferred.push(async function(OneSignal) {
              await OneSignal.init({
                appId: "705d6671-3343-4e8f-a4f5-b1a7214de2f0",
                safari_web_id: "",
                notifyButton: {
                  enable: false,
                },
              });
            });
          `}
        </Script>
      </body>
    </html>
  )
}
