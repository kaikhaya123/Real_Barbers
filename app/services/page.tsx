import Link from 'next/link'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import { SERVICES } from '@/lib/constants'

export default function ServicesPage() {
  return (
    <Section background="white" padding="lg">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-black text-primary-900">Our Services & Prices</h1>
        <p className="text-gray-600 mt-3">Choose from our selection of professional haircuts and grooming services. All prices are listed in ZAR.</p>
      </div>

      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map(service => (
          <Card key={service.id} hover>
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-primary-900">{service.name}</h3>
                <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  <div><span className="font-medium">Duration:</span> {service.duration} mins</div>
                  <div className="mt-1"><span className="font-medium">Price:</span> <span className="text-xl font-bold">R{service.price}</span></div>
                </div>

                <Link
                  href={`/book?service=${service.id}`}
                  className="inline-flex items-center px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-md text-sm font-medium"
                >
                  Book
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  )
}
