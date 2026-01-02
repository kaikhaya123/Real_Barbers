'use client'

import { useState } from 'react'
import Section from '@/components/ui/Section'
import QueueJoinForm from '@/components/queue/QueueJoinForm'
import QueueStatus from '@/components/queue/QueueStatus'
import { QueueEntry } from '@/lib/types'

export default function QueuePage() {
  const [queueEntry, setQueueEntry] = useState<QueueEntry | null>(null)

  const handleJoinQueue = (formData: any) => {
    // In production, this would call an API
    const newEntry: QueueEntry = {
      id: `Q-${Date.now()}`,
      clientName: formData.name,
      clientPhone: formData.phone,
      joinedAt: new Date().toISOString(),
      estimatedWait: 25, // This would be calculated based on current queue
      position: 3, // This would come from the backend
      status: 'waiting',
      preferredBarberId: formData.preferredBarberId,
    }
    setQueueEntry(newEntry)
  }

  const handleLeaveQueue = () => {
    setQueueEntry(null)
  }

  return (
    <Section background="gray" padding="lg">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary-900 mb-3">
            Walk-In Queue
          </h1>
          <p className="text-gray-600">
            Join our digital queue and track your position in real-time
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {!queueEntry ? (
            <QueueJoinForm onJoin={handleJoinQueue} />
          ) : (
            <QueueStatus entry={queueEntry} onLeave={handleLeaveQueue} />
          )}
        </div>

        {/* Info Section */}
        {!queueEntry && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">How It Works</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Enter your details and join the queue</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>See your live position and estimated wait time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Get notified via SMS when it&apos;s almost your turn</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Arrive at the shop when you&apos;re near the front</span>
              </li>
            </ul>
            <p className="mt-4 text-xs text-blue-700">
              <strong>Note:</strong> You must be at the shop or nearby when your turn comes. 
              If you miss your turn, you'll need to rejoin the queue.
            </p>
          </div>
        )}
      </div>
    </Section>
  )
}
