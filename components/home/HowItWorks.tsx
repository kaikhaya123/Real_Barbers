import { Calendar, Users, CheckCircle } from 'lucide-react'
import Section from '@/components/ui/Section'
import Card from '@/components/ui/Card'

export default function HowItWorks() {
  const methods = [
    {
      icon: Calendar,
      title: 'Book an Appointment',
      description: 'Choose your service, select your preferred barber, and pick a time that works for you. Get instant confirmation.',
      steps: ['Select service', 'Choose barber & time', 'Confirm booking'],
      color: 'accent',
    },
    {
      icon: Users,
      title: 'Join Walk-In Queue',
      description: 'No appointment? No problem. Join our digital queue and track your position in real-time from anywhere.',
      steps: ['Join the queue', 'See your position', 'Get notified'],
      color: 'primary',
    },
  ]

  return (
    <Section background="gray">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-dark-900 mb-4">
          Two Ways to Get Your Cut
        </h2>
        <p className="text-lg text-dark-600 max-w-2xl mx-auto">
          We respect your time. Choose the option that works best for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {methods.map((method) => (
          <Card key={method.title} hover>
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${
              method.color === 'accent' ? 'bg-accent-100' : 'bg-primary-100'
            } mb-6`}>
              <method.icon className={`h-8 w-8 ${
                method.color === 'accent' ? 'text-accent-600' : 'text-primary-600'
              }`} />
            </div>

            <h3 className="text-2xl font-heading font-bold text-primary-900 mb-3">
              {method.title}
            </h3>

            <p className="text-gray-600 mb-6">
              {method.description}
            </p>

            <div className="space-y-3">
              {method.steps.map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">{step}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-600 max-w-3xl mx-auto">
          <strong>Still prefer calling?</strong> That&apos;s fine too. We accept phone bookings during business hours. 
          Our digital system helps us serve you better while keeping things flexible.
        </p>
      </div>
    </Section>
  )
}
