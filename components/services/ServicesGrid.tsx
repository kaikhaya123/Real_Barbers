'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Service } from '@/lib/types'
import Card from '@/components/ui/Card'

interface Props {
  services: Service[]
}

export default function ServicesGrid({ services }: Props) {
  const categories = useMemo(() => {
    const set = new Set<string>()
    services.forEach(s => set.add(s.category || 'Uncategorized'))
    return ['All', ...Array.from(set)]
  }, [services])

  const [active, setActive] = useState('All')

  const filtered = useMemo(() => {
    if (active === 'All') return services
    return services.filter(s => (s.category || 'Uncategorized') === active)
  }, [active, services])

  return (
    <div>
      <div className="flex items-center justify-center gap-3 flex-wrap mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wide transition-colors ${
              active === cat ? 'bg-black text-white shadow-lg' : 'bg-transparent text-primary-900 hover:bg-gray-50'
            }`}
            aria-pressed={active === cat}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(service => (
          <Card key={service.id} hover>
            <div className="flex flex-col sm:flex-row h-full">
              <div className="relative w-full sm:w-56 lg:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden rounded-lg md:rounded-xl">
                {service.image ? (
                  <Image src={service.image} alt={`${service.name} haircut`} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-black">{service.name.split(' ').slice(0,2).map(s=>s[0]).join('')}</div>
                )}

                <div className="absolute top-3 right-3 bg-white/90 text-primary-900 rounded-full py-1 px-3 font-extrabold text-sm shadow">{service.price != null ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(service.price) : '—'}</div>
              </div>

              <div className="flex-1 flex flex-col justify-between ml-0 sm:ml-6 mt-4 sm:mt-0">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-primary-900">{service.name}</h3>
                  <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
                  <div className="mt-4 text-sm text-gray-700"><span className="font-medium">Duration:</span> {service.duration} mins</div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">Need extras? Add them when you book.</div>

                  <Link href={`/book?service=${service.id}`} className="inline-flex items-center px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-full text-sm font-medium shadow-sm">
                    Book
                    <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
