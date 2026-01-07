'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { BARBERS as SITE_BARBERS } from '../../lib/constants'

const PREVIEW = SITE_BARBERS

export default function BarbersSection() {
  const [imgError, setImgError] = useState<Record<string, boolean>>({})

  return (
    <section className="py-16 lg:py-20">
      <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
        <Link href="/barbers" className="hover:underline">
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-dark-900 mb-12">
            MEET YOUR BARBER
          </h2>
        </Link>

        <div className="flex justify-center">
          {PREVIEW.map((b) => (
            <Link
              key={b.id}
              href={`/barbers#${String(b.id).toLowerCase()}`}
              className="group relative w-full sm:w-[300px] md:w-[360px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="relative w-full aspect-[4/5] bg-gray-100">
                {!imgError[b.id] ? (
                  <Image
                    src="/Images/Fuze Ngcobo.jpeg"
                    alt={`${b.name} barber`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    onError={() => setImgError(prev => ({ ...prev, [b.id]: true }))}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent-500 to-accent-700 flex flex-col items-center justify-center text-white">
                    <div className="text-5xl font-black mb-4">
                      {b.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </div>
                    <div className="text-sm font-semibold text-center px-4">{b.name}</div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute left-4 bottom-4">
                  <h3 className="text-2xl font-extrabold text-cream-50 drop-shadow-lg">{b.name}</h3>
                  <p className="text-cream-100 text-sm mt-1">{b.title}</p>
                </div>
                <div className="absolute right-4 bottom-4">
                  <div className="h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-dark-900 shadow">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}