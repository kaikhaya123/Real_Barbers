"use client"

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

const images = [
  '/Images/ChatGPT Image Jan 4, 2026, 11_25_43 AM.png',
  '/Images/mfanafuthi_ngcobo_1767517997360.jpeg',
  '/Images/only.clive78_1767515835595.jpeg',
  '/Images/real_barbershop_za_1767437746758.jpeg',
  '/Images/1767518267535.webp',
  '/Images/1767518373263.webp',
  '/Images/1767518295852.webp',
  '/Images/1767518416426.webp',
]

export default function CurvedGallery() {
  const x = useMotionValue(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const [pos, setPos] = useState(0)

  useEffect(() => {
    const controls = animate(x, [-1200, 0], {
      duration: 30,
      repeat: Infinity,
      ease: 'linear',
    })
    const unsub = x.onChange((v) => setPos(v))
    return () => {
      controls.stop()
      unsub()
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
          className="flex gap-12 px-24 cursor-grab active:cursor-grabbing perspective-1000"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -2000, right: 0 }}
          dragElastic={0.08}
        >
          {[...images, ...images].map((src, i) => {
            // Compute a relative position for each item and derive rotateY/scale without additional hooks
            const itemSize = 332 // approximate width + gap
            let d = (i * itemSize + pos) % 1200
            d = ((d + 1200) % 1200) - 600 // normalize to [-600, 600]
            const rotateY = (d / 600) * -18
            const scale = 1 - (Math.abs(d) / 600) * 0.15 // maps to [0.85, 1]

            return (
              <motion.div
                key={i}
                style={{ transform: `rotateY(${rotateY}deg) scale(${scale})` }}
                className="relative min-w-[320px] h-[420px] rounded-3xl overflow-hidden shadow-2xl bg-neutral-900 preserve-3d"
                onClick={() => setActive(src)}
              >
                <Image src={src} alt="Barbershop haircut result" fill className="object-cover" sizes="320px" />
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
            <Image src={active} alt="Full view haircut" fill className="object-contain rounded-2xl" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
