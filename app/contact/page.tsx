import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import Link from 'next/link'
import { BUSINESS_INFO } from '@/lib/constants'

export default function ContactPage() {
  return (
    <>
      {/* Hero Section with Logo and Title */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto text-center">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/logo/Real_barbersho_logo.png"
              alt="Real Barbershop Logo"
              width={200}
              height={80}
              className="mx-auto h-16 md:h-20 w-auto"
            />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-800 mb-6 tracking-wide">
            GET IN TOUCH WITH REAL BARBERS
          </h1>
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Do you have any questions or would you like to book an appointment?<br />
            Please contact us.
          </p>

          {/* Contact Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/book">
              <Button className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-4 text-lg font-medium rounded-full">
                BOOK APPOINTMENT
              </Button>
            </Link>
            <Link href="/queue">
              <Button className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 text-lg font-medium rounded-full">
                JOIN QUEUE
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Contact Information Section */}
      <Section background="gray" padding="lg">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Barbershop Image */}
            <div className="order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/Images/barbershop-interior.jpg"
                  alt="Real Barbershop Interior"
                  width={600}
                  height={400}
                  className="w-full h-[400px] object-cover"
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-dark-800 mb-8">
                  REAL BARBERSHOP
                </h2>

                {/* Phone Number */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-dark-700 mb-2">Phone Number</h3>
                  <a 
                    href={`tel:${BUSINESS_INFO.phone}`}
                    className="text-xl text-gray-600 hover:text-accent-600 transition-colors"
                  >
                    {BUSINESS_INFO.phone}
                  </a>
                </div>

                {/* Email */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-dark-700 mb-2">Email</h3>
                  <a 
                    href={`mailto:${BUSINESS_INFO.email}`}
                    className="text-xl text-gray-600 hover:text-accent-600 transition-colors"
                  >
                    {BUSINESS_INFO.email}
                  </a>
                </div>

                {/* Address */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-dark-700 mb-2">Address</h3>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    {BUSINESS_INFO.address}
                  </p>
                </div>

                {/* Location Link */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-2xl font-bold text-dark-800 mb-4">REAL BARBERS LOCATION</h3>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BUSINESS_INFO.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-lg font-semibold text-accent-600 hover:text-accent-700 transition-colors"
                  >
                    Route description →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Opening Hours & Additional Info */}
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-800 mb-6">
              OPENING HOURS
            </h2>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-lg font-semibold text-dark-700 mb-2">Monday - Friday</h3>
                  <p className="text-2xl font-bold text-accent-600">{BUSINESS_INFO.hours.weekdays}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark-700 mb-2">Saturday</h3>
                  <p className="text-2xl font-bold text-accent-600">{BUSINESS_INFO.hours.saturday}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-dark-700 mb-2">Sunday</h3>
                  <p className="text-2xl font-bold text-accent-600">{BUSINESS_INFO.hours.sunday}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-800 mb-12 text-center">
              FREQUENTLY ASKED QUESTIONS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-dark-800 mb-4">
                  Do I need an appointment?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  No! We welcome both appointments and walk-ins. Book online for guaranteed time slots, 
                  or join our digital walk-in queue when you arrive.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-dark-800 mb-4">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  We accept cash, card, and digital payments including SnapScan and Zapper. 
                  Payment is taken after your service.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-dark-800 mb-4">
                  Can I request a specific barber?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes! When booking online or joining the queue, you can select your preferred barber. 
                  This may affect wait times.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-dark-800 mb-4">
                  Is parking available?
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Yes, there is street parking available nearby. 
                  Please check local parking regulations and time limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  )
}
