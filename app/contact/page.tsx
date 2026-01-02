import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react'
import { BUSINESS_INFO } from '@/lib/constants'

export default function ContactPage() {
  return (
    <>
      <Section background="gray" padding="lg">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're here to help. Visit us, call us, or send a message.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <Card>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-accent-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary-900 mb-2">
                      Visit Our Shop
                    </h3>
                    <p className="text-gray-700 mb-3">
                      {BUSINESS_INFO.address}
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_INFO.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-600 hover:text-accent-700 font-semibold text-sm"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-accent-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary-900 mb-2">
                      Call Us
                    </h3>
                    <p className="text-gray-700 mb-3">
                      <a href={`tel:${BUSINESS_INFO.phone}`} className="hover:text-accent-600">
                        {BUSINESS_INFO.phone}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      For bookings, inquiries, and support
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-accent-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary-900 mb-2">
                      WhatsApp
                    </h3>
                    <p className="text-gray-700 mb-3">
                      <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}`} className="hover:text-accent-600">
                        {BUSINESS_INFO.whatsapp}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      Quick messages and booking confirmations
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-6 w-6 text-accent-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary-900 mb-2">
                      Email
                    </h3>
                    <p className="text-gray-700 mb-3">
                      <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-accent-600">
                        {BUSINESS_INFO.email}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      For general inquiries and feedback
                    </p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-6 w-6 text-accent-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary-900 mb-3">
                      Opening Hours
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monday - Friday</span>
                        <span className="font-semibold text-primary-900">
                          {BUSINESS_INFO.hours.weekdays}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saturday</span>
                        <span className="font-semibold text-primary-900">
                          {BUSINESS_INFO.hours.saturday}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sunday</span>
                        <span className="font-semibold text-primary-900">
                          {BUSINESS_INFO.hours.sunday}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Map */}
            <div>
              <Card className="h-full p-0 overflow-hidden">
                <div className="aspect-square lg:h-full">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3459.6!2d${BUSINESS_INFO.coordinates.lng}!3d${BUSINESS_INFO.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sza!4v1234567890`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Real Barbershop Location"
                  />
                </div>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-accent-600 to-accent-700 rounded-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Ready to Look Sharp?
            </h2>
            <p className="text-accent-100 mb-8 max-w-2xl mx-auto">
              Book your appointment online or join our walk-in queue. 
              We're ready to serve you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asLink
                href="/book"
                variant="secondary"
                size="lg"
              >
                Book Appointment
              </Button>
              <Button
                asLink
                href="/queue"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-accent-600"
              >
                Join Walk-In Queue
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-12">
            <h2 className="text-2xl font-heading font-bold text-primary-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <h3 className="font-bold text-primary-900 mb-2">
                  Do I need an appointment?
                </h3>
                <p className="text-gray-700 text-sm">
                  No! We welcome both appointments and walk-ins. Book online for guaranteed time slots, 
                  or join our digital walk-in queue when you arrive.
                </p>
              </Card>

              <Card>
                <h3 className="font-bold text-primary-900 mb-2">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-700 text-sm">
                  We accept cash, card, and digital payments including SnapScan and Zapper. 
                  Payment is taken after your service.
                </p>
              </Card>

              <Card>
                <h3 className="font-bold text-primary-900 mb-2">
                  Can I request a specific barber?
                </h3>
                <p className="text-gray-700 text-sm">
                  Yes! When booking online or joining the queue, you can select your preferred barber. 
                  This may affect wait times.
                </p>
              </Card>

              <Card>
                <h3 className="font-bold text-primary-900 mb-2">
                  Is parking available?
                </h3>
                <p className="text-gray-700 text-sm">
                  Yes, there is street parking available on Mbhele Street and nearby areas. 
                  Please check local parking regulations.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
