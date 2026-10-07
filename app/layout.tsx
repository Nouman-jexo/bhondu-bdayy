import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Pacifico, Quicksand } from 'next/font/google'
import { ServiceWorkerRegister } from '@/components/service-worker-register'
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
        <ServiceWorkerRegister />
        {process.env.NODE_ENV === 'production' && <Analytics />}

        {/* Register Service Worker Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('/sw.js', { scope: '/' });
              }
            `,
          }}
        />

        {/* OneSignal Push Notifications */}
        <script
          src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
          defer
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
            `,
          }}
        />
      </body>
    </html>
  )
}
