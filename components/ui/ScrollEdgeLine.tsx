"use client"

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

interface ScrollEdgeLineProps {
  fromId: string
  toId: string
  strokeWidth?: number
  strokeColor?: string
  scrollSpan?: number
  className?: string
}

export default function ScrollEdgeLine({ 
  fromId, 
  toId, 
  strokeWidth = 2, 
  strokeColor = '#000', 
  scrollSpan = 1,
  className = ""
}: ScrollEdgeLineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [fromElement, setFromElement] = useState<HTMLElement | null>(null)
  const [toElement, setToElement] = useState<HTMLElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Clean IDs (remove # if present)
  const cleanFromId = fromId.startsWith('#') ? fromId.slice(1) : fromId
  const cleanToId = toId.startsWith('#') ? toId.slice(1) : toId

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const fromEl = document.getElementById(cleanFromId)
    const toEl = document.getElementById(cleanToId)
    
    setFromElement(fromEl)
    setToElement(toEl)
  }, [cleanFromId, cleanToId, isMounted])

  // Don't render until mounted and elements are found
  if (!isMounted || !fromElement || !toElement) {
    return <div className={`absolute inset-0 pointer-events-none ${className}`} />
  }

  return <ScrollEdgeLineContent 
    containerRef={containerRef}
    strokeWidth={strokeWidth}
    strokeColor={strokeColor}
    scrollSpan={scrollSpan}
    className={className}
  />
}

interface ScrollEdgeLineContentProps {
  containerRef: React.RefObject<HTMLDivElement>
  strokeWidth: number
  strokeColor: string
  scrollSpan: number
  className: string
}

function ScrollEdgeLineContent({
  containerRef,
  strokeWidth,
  strokeColor,
  scrollSpan,
  className
}: ScrollEdgeLineContentProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  // Transform scroll progress based on scrollSpan
  const adjustedProgress = useTransform(
    scrollYProgress,
    [0, scrollSpan],
    [0, 1]
  )

  // Border animation values
  const pathLength = useTransform(adjustedProgress, [0, 1], [0, 1])
  const strokeDashoffset = useTransform(pathLength, [0, 1], [1, 0])

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
    >
      <svg 
        className="w-full h-full" 
        style={{ 
          strokeWidth, 
          stroke: strokeColor,
          fill: 'none'
        }}
      >
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          pathLength={pathLength}
          strokeDasharray="1"
          strokeDashoffset={strokeDashoffset}
          style={{
            strokeWidth,
            stroke: strokeColor,
            fill: 'none'
          }}
        />
      </svg>
    </div>
  )
}