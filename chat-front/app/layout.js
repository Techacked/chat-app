'use client'

import './globals.css'
import ClientWrapper from '../components/ClientWrapper'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-dark-bg text-dark-text">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}