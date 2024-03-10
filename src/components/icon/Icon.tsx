import Image from 'next/image'
import React from 'react'

export default function Icon() {
  return (
    <Image
      alt="icon"
      height={150}
      src="/icon.jpg"
      style={{ borderRadius: '50%', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', height: '150px', marginTop: '20px', width: '150px' }}
      width={150}
    />
  )
}
