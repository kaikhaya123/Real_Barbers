import Link from 'next/link'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { SERVICES } from '@/lib/constants'

const currencyFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'currency',
  currency: 'ZAR',
  maximumFractionDigits: 0,
})

export default function ServicesPage() {
  return (
    <Section background="white" padding="lg">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-black text-primary-900">Our Services & Prices</h1>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">Choose from our selection of professional haircuts and grooming services.</p>
        <div className="mt-6 h-1 w-28 bg-accent-600 rounded mx-auto" />
      </div>

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map(service => (
          <Card key={service.id} hover>
            <div className="flex flex-col sm:flex-row h-full">
              <div className="relative w-full sm:w-56 lg:w-64 h-48 sm:h-auto flex-shrink-0 overflow-hidden rounded-lg md:rounded-xl">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={`${service.name} haircut`}
                    fill
                    className="object-cover"
                    onError={() => { /* fallback handled by browser */ }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white font-black">{service.name.split(' ').slice(0,2).map(s=>s[0]).join('')}</div>
                )}

                {/* Price overlay on image */}
                <div className="absolute top-3 right-3 bg-white/90 text-primary-900 rounded-full py-1 px-3 font-extrabold text-sm shadow">{service.price != null ? currencyFormatter.format(service.price) : '—'}</div>
              </div>

              <div className="flex-1 flex flex-col justify-between ml-0 sm:ml-6 mt-4 sm:mt-0">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-primary-900">{service.name}</h3>
                  <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
                  <div className="mt-4 text-sm text-gray-700"><span className="font-medium">Duration:</span> {service.duration} mins</div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-500">Need extras? Add them when you book.</div>

                  <Link
                    href={`/book?service=${service.id}`}
                    className="inline-flex items-center px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-full text-sm font-medium shadow-sm"
                  >
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

      <p className="mt-8 text-sm text-gray-500 text-center">Prices are subject to change. If you need help choosing a service, call us at <a className="text-accent-600 font-medium" href={`tel:${process.env.NEXT_PUBLIC_PHONE || ''}`}>{process.env.NEXT_PUBLIC_PHONE || ''}</a>.</p>
    </Section>
  )
}
