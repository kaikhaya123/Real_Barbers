import { BARBERS } from '@/lib/constants'
import { Service, Barber } from '@/lib/types'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Award, CheckCircle } from 'lucide-react'

interface BarberSelectorProps {
  service: Service
  onSelect: (barber: Barber) => void
  onBack: () => void
}

export default function BarberSelector({ service, onSelect, onBack }: BarberSelectorProps) {
  const availableBarbers = BARBERS.filter(b => b.available)

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
          Selected: <span className="font-semibold">{service.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Any Available Barber Option */}
        <Card className="cursor-pointer transition-all hover:border-2 hover:border-accent-600" hover>
          <button onClick={() => onSelect(availableBarbers[0])} className="w-full text-left">
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="h-10 w-10 text-white" />
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
            className="cursor-pointer transition-all hover:border-2 hover:border-accent-600"
            hover
          >
            <button onClick={() => onSelect(barber)} className="w-full text-left">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-2xl font-bold">
                  {barber.name.split(' ').map(n => n[0]).join('')}
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
