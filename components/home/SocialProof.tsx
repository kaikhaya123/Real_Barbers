import { Star, Quote } from 'lucide-react'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

export default function SocialProof() {
  const testimonials = [
    {
      name: 'Mandla K.',
      rating: 5,
      text: 'Best barbershop in Durban! Thabo always delivers a perfect fade. The online booking is super convenient.',
      location: 'Durban Central',
    },
    {
      name: 'Jason M.',
      rating: 5,
      text: 'Finally, a shop that respects my time. I book online, show up, and get straight to my cut. No more waiting around.',
      location: 'Berea',
    },
    {
      name: 'Sibusiso N.',
      rating: 5,
      text: 'Professional service every time. The walk-in queue system is brilliant. I can see exactly when to arrive.',
      location: 'Morningside',
    },
  ]

  return (
    <Section background="primary">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-900 mb-4">
          Trusted by Durban
        </h2>
        <p className="text-lg text-dark-600 max-w-2xl mx-auto">
          Real reviews from real clients
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <Card key={index}>
            <div className="flex items-center mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>

            <Quote className="h-8 w-8 text-accent-200 mb-3" />

            <p className="text-gray-700 mb-4 italic">
              "{testimonial.text}"
            </p>

            <div className="pt-4 border-t border-gray-200">
              <p className="font-semibold text-primary-900">{testimonial.name}</p>
              <p className="text-sm text-gray-600">{testimonial.location}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats Bar */}
      <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-accent-600 mb-2">98%</div>
            <div className="text-sm text-gray-600">Client Satisfaction</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-600 mb-2">1000+</div>
            <div className="text-sm text-gray-600">Monthly Clients</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-600 mb-2">4.9★</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent-600 mb-2">12+</div>
            <div className="text-sm text-gray-600">Years Trusted</div>
          </div>
        </div>
      </div>
    </Section>
  )
}
