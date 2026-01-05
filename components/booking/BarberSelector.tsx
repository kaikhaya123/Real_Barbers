'use client'

import { BARBERS } from '@/lib/constants'
import { Service, Barber } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface BarberSelectorProps {
  service: Service
  onSelect: (barber: Barber) => void
  onBack: () => void
}

export default function BarberSelector({ service, onSelect, onBack }: BarberSelectorProps) {
  const availableBarbers = BARBERS.filter(b => b.available)
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null)
  const [imgErrorIds, setImgErrorIds] = useState<Record<string, boolean>>({})

  const handleSelect = (barber: Barber) => {
    setSelectedBarber(barber)
    onSelect(barber)
  }

  return (
    <div className="space-y-12">
      
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="text-accent-600 hover:text-accent-700 text-sm mb-4"
        >
          ← Back to services
        </button>

        <h2 className="text-3xl md:text-4xl font-black text-primary-900">
          Choose your barber
        </h2>

        <p className="text-gray-600 mt-2">
          Selected service: <span className="font-semibold">{service.name}</span>
        </p>
      </div>

      {/* Featured Barber */}
      <AnimatePresence>
        {selectedBarber && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative rounded-3xl overflow-hidden bg-black shadow-2xl"
          >
            <div className="relative h-[420px]">
              <Image
                src={
                  imgErrorIds[selectedBarber.id]
                    ? '/Images/1767460172187.webp'
                    : selectedBarber.image
                }
                alt={selectedBarber.name}
                fill
                className="object-cover"
                onError={() =>
                  setImgErrorIds(prev => ({ ...prev, [selectedBarber.id]: true }))
                }
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              <div className="absolute bottom-8 left-8">
                <p className="text-cream-200 text-sm tracking-wide mb-2">
                  SELECTED BARBER
                </p>
                <h3 className="text-4xl font-black text-white">
                  {selectedBarber.name}
                </h3>
                <p className="text-cream-200 mt-1">
                  {selectedBarber.title} · {selectedBarber.experience}
                </p>
              </div>

              <div className="absolute top-6 right-6 bg-white rounded-full p-2 text-accent-600 shadow-lg">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Barber Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {availableBarbers.map(barber => {
          const isSelected = selectedBarber?.id === barber.id

          return (
            <motion.button
              key={barber.id}
              onClick={() => handleSelect(barber)}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className={`relative rounded-2xl overflow-hidden text-left bg-gray-100 shadow-md focus:outline-none ${
                isSelected ? 'ring-4 ring-accent-500' : ''
              }`}
            >
              <div className="relative aspect-[3/4]">
                {!imgErrorIds[barber.id] ? (
                  <Image
                    src={encodeURI(barber.image)}
                    alt={barber.name}
                    fill
                    className="object-cover"
                    onError={() =>
                      setImgErrorIds(prev => ({ ...prev, [barber.id]: true }))
                    }
                  />
                ) : (
                  <div className="w-full h-full bg-primary-700 flex items-center justify-center text-white text-3xl font-black">
                    {barber.name
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <h4 className="text-white font-bold text-lg leading-tight">
                    {barber.name}
                  </h4>
                  <p className="text-white/80 text-sm">
                    {barber.experience}
                  </p>
                </div>

                {isSelected && (
                  <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 text-accent-600 shadow">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
