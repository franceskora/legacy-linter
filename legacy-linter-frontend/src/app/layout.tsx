// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react' // Import React

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  // The type is React.ReactNode (capital R, capital N)
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}