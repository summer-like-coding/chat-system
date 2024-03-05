import '@/app/globals.css'
import React from 'react'

function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="flex size-full h-screen w-full items-center justify-center">
      {children}
    </div>
  )
}

export default RootLayout
