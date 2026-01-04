"use client"

import { motion, useMotionValue, animate } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const images = [
  '/Video/3506105285296674848 - Trim.mp4',
  '/Images/mfanafuthi_ngcobo_1767517997360.jpeg',
  '/Images/only.clive78_1767515835595.jpeg',
  '/Images/real_barbershop_za_1767437746758.jpeg',
  '/Images/1767445492133.jpeg',
  '/Images/1767518373263.webp',
  '/Images/1767518295852.webp',
  '/Images/1767518416426.webp',
]

export default function CurvedGallery() {
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const [pos, setPos] = useState(0)
  const [itemSize, setItemSize] = useState(332)

  useEffect(() => {
    const controls = animate(x, [-1200, 0], {
      duration: 30,
      repeat: Infinity,
      ease: 'linear',
    })
    const unsub = x.onChange((v) => setPos(v))

    function updateSize() {
      const w = window.innerWidth
      if (w < 640) setItemSize(220)
      else if (w < 1024) setItemSize(300)
      else setItemSize(332)
    }

    updateSize()
    window.addEventListener('resize', updateSize)

    return () => {
      controls.stop()
      unsub()
      window.removeEventListener('resize', updateSize)
    }
  }, [x])

  return (
    <section className="relative py-32 overflow-hidden bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 max-w-xl">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-wider leading-tight uppercase">WORK DONE BY OUR BARBERS</h2>
        </div>
      </div>

      {/* Curved Gallery */}
      <div className="relative">
        {/* Edge fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

        <motion.div
          ref={containerRef}
          className="flex gap-6 sm:gap-8 md:gap-12 px-6 sm:px-12 md:px-24 cursor-grab active:cursor-grabbing perspective-1000"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -2000, right: 0 }}
          dragElastic={0.08}
        >
          {[...images, ...images].map((src, i) => {
            // Compute a relative position for each item and derive rotateY/scale
            const totalWidth = images.length * itemSize
            let d = (i * itemSize + pos) % totalWidth
            d = ((d + totalWidth) % totalWidth) - totalWidth / 2 // normalize to [-totalWidth/2, totalWidth/2]
            const rotateY = (d / (totalWidth / 2)) * -18
            const scale = 1 - (Math.abs(d) / (totalWidth / 2)) * 0.15 // maps to [0.85, 1]

            const isVideo = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().includes('/video/')

            return (
              <motion.div
                key={i}
                style={{ transform: `rotateY(${rotateY}deg) scale(${scale})` }}
                className="relative min-w-[220px] sm:min-w-[280px] md:min-w-[320px] h-[260px] sm:h-[360px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 preserve-3d"
                onClick={() => setActive(src)}
              >
                {isVideo ? (
                  <video src={src} muted autoPlay loop playsInline className="w-full h-full object-cover" />
                ) : (
                  <Image
                    src={src}
                    alt="Barbershop haircut result"
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 320px, 352px"
                  />
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Lightbox */}
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setActive(null)}
        >
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="relative w-[90vw] max-w-3xl h-[80vh]">
            {active && (active.toLowerCase().endsWith('.mp4') || active.toLowerCase().includes('/video/')) ? (
              <video src={active} controls autoPlay className="w-full h-full object-contain mx-auto rounded-2xl" />
            ) : (
              <Image src={active} alt="Full view haircut" fill className="object-contain rounded-2xl" />
            )}
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
