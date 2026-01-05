'use client'

import { useState, useMemo } from 'react'
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
            <div className="flex items-center justify-between gap-4 p-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  {(service.category || 'Uncategorized').toUpperCase()}
                </div>

                {/* clicking the service name now navigates to the booking section with the service preselected */}
                <h3 className="text-xl md:text-2xl font-semibold text-primary-900">
                  <Link
                    href={`/book?service=${service.id}#appointment`}
                    className="hover:underline"
                  >
                    {service.name}
                  </Link>
                </h3>

                {service.description && <p className="text-sm text-gray-600 mt-1">{service.description}</p>}
                {service.duration != null && <div className="mt-1 text-sm text-gray-600">Duration: {service.duration} mins</div>}
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500">PRICE</div>
                <div className="text-2xl font-extrabold text-primary-900">
                  {service.price != null ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(service.price) : '—'}
                </div>

                <Link href={`/book?service=${service.id}#appointment`} className="mt-3 inline-flex items-center px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-full text-sm font-medium shadow-sm">
                  Book
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
