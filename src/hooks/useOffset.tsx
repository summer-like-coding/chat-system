/**
 * @description: 获取当前元素的偏移量
 */

import React from 'react'

export default function useOffset() {
  const [offset, setOffset] = React.useState({ x: 0, y: 0 })
  function getOffset(el:React.MouseEvent<HTMLElement, MouseEvent>) {
    console.log(el, 'el');
    
    if (el) {
      setOffset({
        x: el.clientX,
        y: el.clientY
      })
    }
  }
  return [offset, getOffset]
}
