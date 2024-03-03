import React from 'react'

import Links from './links/Links'
// 因为这是一个组件，并不是一个页面，所以不需要page.tsx
export default function Navbar() {
  return (
    <div>
      <div>Navbar</div>
      <div>
        <Links />
      </div>
    </div>
  )
}
