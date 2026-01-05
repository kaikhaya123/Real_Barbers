'use client'

import Image from 'next/image'
import { useRef, useState, useEffect } from 'react'

const BARBERS = [
  { name: 'MFANAFUTHI', img: '/Images/1767460998971.jpeg', href: '/barbers/mfanafuthi' },
  { name: 'SBONGA', img: '/Images/1767460172187.webp', href: '/barbers/abdel' },
  { name: 'OZ', img: '/Images/1767330787427.jpeg', href: '/barbers/oz' },
]

export default function BarbersSection() {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => {
      setCanScrollLeft(el.scrollLeft > 8)
      setCanScrollRight(el.scrollWidth - el.clientWidth - el.scrollLeft > 8)
    }
    onScroll()
    el.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)
    return () => {
      el.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollerRef.current
    if (!el) return
    const offset = Math.round(el.clientWidth * 0.7) * (direction === 'left' ? -1 : 1)
    el.scrollBy({ left: offset, behavior: 'smooth' })
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="flex items-start justify-between">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-dark-900">
            MEET OUR REAL BARBERS
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll barbers left"
              className={`h-9 w-9 rounded-full flex items-center justify-center transition ${
                canScrollLeft ? 'bg-black text-white' : 'bg-black/30 text-white/60 pointer-events-none'
              }`}
            >
              <svg className="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => scroll('right')}
              aria-label="Scroll barbers right"
              className={`h-9 w-9 rounded-full flex items-center justify-center transition ${
                canScrollRight ? 'bg-black text-white' : 'bg-black/30 text-white/60 pointer-events-none'
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-8 flex gap-6 overflow-x-auto pb-6 scroll-smooth no-scrollbar"
          aria-label="List of barbers"
        >
          {BARBERS.map((b) => (
            <a
              key={b.name}
              href={b.href}
              className="group relative min-w-[220px] sm:min-w-[260px] md:min-w-[300px] lg:min-w-[320px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="relative w-full aspect-[4/5] bg-gray-100">
                <Image
                  src={b.img}
                  alt={`${b.name} barber`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 80vw, 30vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute left-4 bottom-4">
                  <h3 className="text-2xl font-extrabold text-cream-50 drop-shadow-lg">{b.name}</h3>
                </div>
                <div className="absolute right-4 bottom-4">
                  <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-dark-900 shadow">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}