import React from 'react'

function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="size-full h-screen overflow-auto">
      {children}
    </div>
  )
}

export default RootLayout
