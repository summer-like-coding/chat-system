'use client'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { SessionProvider } from 'next-auth/react'
import React from 'react'

import './globals.css'

function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AntdRegistry>{children}</AntdRegistry>
        </SessionProvider>
      </body>
    </html>
  )
}

export default RootLayout
