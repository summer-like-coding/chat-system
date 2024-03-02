import { AntdRegistry } from '@ant-design/nextjs-registry'
import React from 'react'

function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html>
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}

export default RootLayout
