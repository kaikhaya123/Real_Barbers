import { Clock, DollarSign } from 'lucide-react'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { SERVICES } from '@/lib/constants'

export default function Services() {
  return (
    <Section background="white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-900 mb-4">
          Our Services
        </h2>
        <p className="text-lg text-dark-600 max-w-2xl mx-auto">
          Professional grooming services tailored to your style
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {SERVICES.map((service) => (
          <Card key={service.id} hover>
            <h3 className="text-xl font-bold text-primary-900 mb-2">
              {service.name}
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              {service.description}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center space-x-1 text-lg font-bold text-accent-600">
                <span>R{service.price}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button asLink href="/book" variant="primary" size="lg">
          Book Your Service Now
        </Button>
      </div>
    </Section>
  )
}
