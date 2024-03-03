import Link from 'next/link'
import React from 'react'

export default function Links() {
  const links = [
    { name: 'Home', url: '/' },
    { name: 'Contact', url: '/contact' },
    { name: 'Login', url: '/login' },
    { name: 'Register', url: '/register' },
    { name: 'Forget Password', url: '/forget-password' },
  ]
  return (
    <div>
      {
        links.map((link) => {
          return (
            <Link href={link.url} key={link.name}>
              {link.name}
            </Link>
          )
        })
      }
    </div>
  )
}
