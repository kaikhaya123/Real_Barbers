import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { BUSINESS_INFO } from '@/lib/constants'

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-cream-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-heading font-bold mb-4">
              Real Barbershop <span className="text-lg">™️</span>
            </h3>
            <p className="text-gray-300 mb-4">
              Premium grooming services in the heart of Durban. 
              Experience professional cuts, traditional shaves, and expert styling.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/book" className="text-cream-200 hover:text-cream-100 transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/queue" className="text-cream-200 hover:text-cream-100 transition-colors">
                  Walk-In Queue
                </Link>
              </li>
              <li>
                <Link href="/barbers" className="text-gray-300 hover:text-accent-400 transition-colors">
                  Our Barbers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-accent-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 text-accent-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 text-sm">{BUSINESS_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-accent-400 flex-shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phone}`} className="text-gray-300 hover:text-accent-400 text-sm">
                  {BUSINESS_INFO.phone}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-accent-400 flex-shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="text-gray-300 hover:text-accent-400 text-sm">
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Clock className="h-5 w-5 text-accent-400 mt-0.5 flex-shrink-0" />
                <div className="text-gray-300 text-sm">
                  <div>Mon-Fri: {BUSINESS_INFO.hours.weekdays}</div>
                  <div>Sat: {BUSINESS_INFO.hours.saturday}</div>
                  <div>Sun: {BUSINESS_INFO.hours.sunday}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-primary-700">
          <p className="text-center text-gray-400 text-sm">
            © {new Date().getFullYear()} Real Barbershop ™️. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
