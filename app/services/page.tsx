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
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
                  <div className="sm:flex-1">
                    <h3 className="text-xl md:text-2xl font-semibold text-primary-900">{service.name}</h3>
                    <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
                    <div className="mt-4 text-sm text-gray-700"><span className="font-medium">Duration:</span> {service.duration} mins</div>
                  </div>

                  <div className="flex-shrink-0 flex items-center">
                    <div className="bg-accent-600 text-white rounded-full px-5 py-3 text-lg md:text-xl font-extrabold text-center shadow-md">
                      {currencyFormatter.format(service.price)}
                    </div>
                  </div>
                </div>
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
          </Card>
        ))}
      </div>

      <p className="mt-8 text-sm text-gray-500 text-center">Prices are subject to change. If you need help choosing a service, call us at <a className="text-accent-600 font-medium" href={`tel:${process.env.NEXT_PUBLIC_PHONE || ''}`}>{process.env.NEXT_PUBLIC_PHONE || ''}</a>.</p>
    </Section>
  )
}
