import { BARBERS } from '@/lib/constants'
import { Service, Barber } from '@/lib/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Award, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react' 

interface BarberSelectorProps {
  service: Service
  onSelect: (barber: Barber) => void
  onBack: () => void
}

export default function BarberSelector({ service, onSelect, onBack }: BarberSelectorProps) {
  const availableBarbers = BARBERS.filter(b => b.available)
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null)
  const [imgErrorIds, setImgErrorIds] = useState<Record<string, boolean>>({})

  const handleSelect = (barber: Barber) => {
    setSelectedBarberId(barber.id)
    onSelect(barber)
  }

  const selectedBarber = BARBERS.find(b => b.id === selectedBarberId) 

  return (
    <div>
      <div className="mb-6">
        <button onClick={onBack} className="text-accent-600 hover:text-accent-700 mb-3">
          ← Back to services
        </button>
        <h2 className="text-2xl font-bold text-primary-900">
          Choose Your Barber
        </h2>
        <p className="text-gray-600 mt-1">
          Selected service: <span className="font-semibold">{service.name}</span>
        </p>
        {selectedBarber && (
          <div className="mt-3 flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-accent-500">
              <Image
                src={imgErrorIds[selectedBarber.id] ? '/Images/real_barbershop_za_1767437746758.jpeg' : selectedBarber.image}
                alt={selectedBarber.name}
                width={56}
                height={56}
                className="object-cover w-full h-full"
                onError={() => setImgErrorIds(prev => ({ ...prev, [selectedBarber.id]: true }))}
              />
            </div>
            <div>
              <div className="text-base font-semibold text-primary-900">{selectedBarber.name}</div>
              <div className="text-sm text-gray-500">{selectedBarber.title}</div>
            </div>
          </div>
        )} 
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Any Available Barber Option */}
        <Card className="cursor-pointer transition-transform duration-150 transform hover:scale-105 hover:shadow-md hover:border-accent-600" hover>
          <button onClick={() => availableBarbers[0] && handleSelect(availableBarbers[0])} className="w-full text-left">
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="h-12 w-12 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary-900 mb-2">
                  First Available Barber
                </h3>
                <p className="text-gray-600 text-sm">
                  Get the next available slot with any of our professional barbers
                </p>
                <div className="mt-3 inline-flex items-center space-x-2 text-sm text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>Fastest booking option</span>
                </div>
              </div>
            </div>
          </button>
        </Card>

        {/* Individual Barbers */}
        {availableBarbers.map((barber) => (
          <Card
            key={barber.id}
            className={`cursor-pointer transition-transform duration-150 transform hover:scale-105 ${selectedBarberId === barber.id ? 'ring-4 ring-offset-2 ring-accent-500/60 shadow-lg bg-accent-50' : 'hover:border-2 hover:border-accent-600'}`}
            hover
          >
            <button onClick={() => handleSelect(barber)} className="w-full text-left">
              <div className="flex items-start space-x-4">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden relative transition-shadow ${selectedBarberId === barber.id ? 'ring-4 ring-accent-500/80 shadow-xl' : 'ring-0'}`}>
                  {!imgErrorIds[barber.id] ? (
                    <Image
                      src={barber.image}
                      alt={barber.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                      onError={() => setImgErrorIds(prev => ({ ...prev, [barber.id]: true }))}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white text-2xl font-bold">
                      {barber.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  {selectedBarberId === barber.id && (
                    <span className="absolute top-2 right-2 bg-white rounded-full p-1.5 text-accent-600 shadow-sm">
                      <CheckCircle className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-primary-900 mb-1">
                    {barber.name}
                  </h3>
                  <p className="text-accent-600 font-semibold text-sm mb-2">
                    {barber.title} • {barber.experience}
                  </p>
                  <p className="text-gray-600 text-sm mb-3">
                    {barber.bio}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {barber.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="inline-block bg-primary-100 text-primary-700 text-xs px-3 py-1 rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
