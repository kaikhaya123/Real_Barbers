'use client'

import Section from '@/components/ui/Section'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import Link from 'next/link'
import { BUSINESS_INFO } from '@/lib/constants'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'Do I need an appointment?',
      answer:
        'No. We welcome both appointments and walk-ins. Book online for guaranteed time slots or join our digital queue when you arrive.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept cash, card, and digital payments including SnapScan and Zapper. Payment is taken after your service.',
    },
    {
      question: 'Can I request a specific barber?',
      answer:
        'Yes. When booking online or joining the queue, you can select your preferred barber. This may affect wait times.',
    },
    {
      question: 'Is parking available?',
      answer:
        'Yes. Street parking is available nearby. Please check local parking regulations and time limits.',
    },
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* Hero */}
      <Section background="white" padding="lg">
        <div className="max-w-6xl mx-auto text-center">
          <Image
            src="/logo/Pro_barbershop_logo.png"
            alt="Pro Barber Shop ZA Logo"
            width={200}
            height={80}
            className="mx-auto h-16 md:h-20 w-auto mb-8"
          />

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-dark-800 mb-6 tracking-wide">
            GET IN TOUCH WITH PRO BARBER SHOP ZA
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Do you have questions or want to book an appointment?
            <br />
            Please contact us.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button className="bg-black hover:bg-black text-black px-8 py-4 text-lg rounded-full">
                BOOK APPOINTMENT
              </Button>
            </Link>

            <Link href="/queue">
              <Button className="bg-accent-600 hover:bg-accent-700 text-white px-8 py-4 text-lg rounded-full">
                JOIN QUEUE
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      {/* Contact Info */}
      <Section background="gray" padding="lg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/Images/30470.jpg"
              alt="Barbershop Interior"
              width={600}
              height={400}
              className="w-full h-[400px] object-cover"
            />
          </div>

          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-dark-800 mb-8">
              PRO BARBER SHOP
            </h2>

            <div className="mb-6">
              <h3 className="font-semibold text-dark-700 mb-1">Phone</h3>
              <a
                href={`tel:${BUSINESS_INFO.phone}`}
                className="text-xl text-gray-600 hover:text-accent-600"
              >
                {BUSINESS_INFO.phone}
              </a>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-dark-700 mb-1">Email</h3>
              <a
                href={`mailto:${BUSINESS_INFO.email}`}
                className="text-xl text-gray-600 hover:text-accent-600"
              >
                {BUSINESS_INFO.email}
              </a>
            </div>

            <div className="mb-8">
              <h3 className="font-semibold text-dark-700 mb-1">Address</h3>
              <p className="text-xl text-gray-600">
                {BUSINESS_INFO.address}
              </p>
            </div>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                BUSINESS_INFO.address
              )}`}
              target="_blank"
              className="text-accent-600 font-semibold hover:text-accent-700"
            >
              Route description →
            </a>
          </div>
        </div>
      </Section>

      {/* Opening Hours */}
      <Section background="white" padding="lg">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-dark-800 mb-8">
            OPENING HOURS
          </h2>

          <div className="bg-gray-50 rounded-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-dark-700 mb-1">Mon - Fri</h3>
              <p className="text-2xl font-bold text-accent-600">
                {BUSINESS_INFO.hours.weekdays}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-dark-700 mb-1">Saturday</h3>
              <p className="text-2xl font-bold text-accent-600">
                {BUSINESS_INFO.hours.saturday}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-dark-700 mb-1">Sunday</h3>
              <p className="text-2xl font-bold text-accent-600">
                {BUSINESS_INFO.hours.sunday}
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ Accordion */}
      <Section background="primary" padding="lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index

              return (
                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-white"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center px-6 py-5 text-left"
                  >
                    <span className="text-lg font-semibold text-dark-800">
                      {faq.question}
                    </span>

                    <span className="text-accent-600">
                      {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                    </span>
                  </button>

                  <div
                    className={`grid transition-all duration-300 ${
                      isOpen
                        ? 'grid-rows-[1fr] opacity-100'
                        : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden px-6 pb-5 text-gray-600">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Section>
    </>
  )
}
