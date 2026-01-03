import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ScrollEdgeLine from '@/components/ui/ScrollEdgeLine'
import { BARBERS } from '@/lib/constants'
import { Award, CheckCircle, Calendar } from 'lucide-react'

export default function BarbersPage() {
  return (
    <div className="relative">
      {/* Sticky ScrollEdgeLine Container */}
      <div className="sticky top-0 z-10">
        <ScrollEdgeLine 
          fromId="section-1"
          toId="section-3"
          strokeWidth={3}
          strokeColor="#D4A574"
          scrollSpan={0.8}
          className="w-full h-screen"
        />
      </div>

      {/* Main Content Sections */}
      <div className="relative">
        {/* Section 1 - Hero Section */}
        <Section id="section-1" background="primary" padding="lg">
          <div className="max-w-5xl mx-auto text-center">
            <div className="mb-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-white mb-6 leading-tight">
                Meet Our
                <span className="block text-accent-400">Master Barbers</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                Experienced professionals dedicated to making you look and feel your best. 
                Each barber brings unique skills and artistry to every cut.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asLink 
                  href="/book" 
                  variant="primary" 
                  size="lg"
                  className="bg-accent-600 hover:bg-accent-700 text-white"
                >
                  Book Your Barber
                </Button>
                <Button 
                  asLink 
                  href="/queue" 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-900"
                >
                  Join Walk-In Queue
                </Button>
              </div>
            </div>
          </div>
        </Section>

        {/* Section 2 - Barbers Grid */}
        <Section id="section-2" background="white" padding="lg">
          <div className="max-w-5xl mx-auto">
            <div className="space-y-8">
              {BARBERS.map((barber, index) => (
                <Card key={barber.id} hover>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Image */}
                    <div className="md:col-span-1">
                      <div className="aspect-square bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg flex items-center justify-center text-white">
                        <div className="text-center">
                          <div className="text-6xl font-bold mb-2">
                            {barber.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="text-sm opacity-80">{barber.title}</div>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-2">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h2 className="text-2xl font-bold text-primary-900 mb-1">
                            {barber.name}
                          </h2>
                          <p className="text-accent-600 font-semibold">
                            {barber.title}
                          </p>
                        </div>
                        {barber.available && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Available
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600 mb-4">
                        <Award className="h-5 w-5 text-accent-600" />
                        <span className="font-semibold">{barber.experience} of experience</span>
                      </div>

                      <p className="text-gray-700 mb-4">
                        {barber.bio}
                      </p>

                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Specialties:</h3>
                        <div className="flex flex-wrap gap-2">
                          {barber.specialties.map((specialty, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-accent-50 text-accent-700 border border-accent-200"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button
                          asLink
                          href="/book"
                          variant="primary"
                          size="md"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          Book with {barber.name.split(' ')[0]}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Section>

        {/* Section 3 - CTA Section */}
        <Section id="section-3" background="cream" padding="lg">
          <div className="max-w-5xl mx-auto">
            <div className="bg-primary-900 rounded-xl p-8 text-center text-white">
              <h2 className="text-2xl font-heading font-bold mb-3">
                Not Sure Who to Choose?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                All our barbers are highly skilled professionals. 
                Select &quot;First Available&quot; when booking for the fastest service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asLink href="/book" variant="primary" size="lg">
                  Book an Appointment
                </Button>
                <Button
                  asLink
                  href="/queue"
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-primary-900"
                >
                  Join Walk-In Queue
                </Button>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  )
}
