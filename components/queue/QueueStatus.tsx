'use client'

import { useEffect, useState } from 'react'
import { QueueEntry } from '@/lib/types'
import Button from '@/components/ui/Button'
import { Clock, Users, CheckCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface QueueStatusProps {
  entry: QueueEntry
  onLeave: () => void
}

export default function QueueStatus({ entry, onLeave }: QueueStatusProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getStatusColor = () => {
    if (entry.position === 1) return 'green'
    if (entry.position === 2) return 'yellow'
    return 'blue'
  }

  const getStatusMessage = () => {
    if (entry.position === 1) {
      return "You're next! Please be at the shop."
    }
    if (entry.position === 2) {
      return 'Almost your turn! Head to the shop now.'
    }
    return "Please wait, we'll notify you when it's close to your turn."
  }

  const statusColors = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconBg: 'bg-green-100',
      icon: 'text-green-600',
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconBg: 'bg-yellow-100',
      icon: 'text-yellow-600',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconBg: 'bg-blue-100',
      icon: 'text-blue-600',
    },
  }

  const colors = statusColors[getStatusColor()]

  return (
    <div>
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="h-10 w-10 text-accent-600" />
        </div>
        <h2 className="text-2xl font-bold text-primary-900 mb-1">
          You're in the Queue!
        </h2>
        <p className="text-gray-600">
          Welcome back, {entry.clientName}
        </p>
      </div>

      {/* Queue ID */}
      <div className="bg-primary-50 rounded-lg p-4 mb-6 text-center">
        <p className="text-sm text-gray-600 mb-1">Queue Reference</p>
        <p className="text-2xl font-bold text-primary-900">{entry.id}</p>
      </div>

      {/* Position Display */}
      <div className="mb-6">
        <div className="bg-gradient-to-br from-accent-600 to-accent-700 rounded-xl p-8 text-white text-center shadow-lg">
          <p className="text-lg mb-2">Your Position</p>
          <p className="text-7xl font-bold mb-2">{entry.position}</p>
          <p className="text-accent-100">
            {entry.position === 1 ? 'You are next!' : `${entry.position - 1} ${entry.position === 2 ? 'person' : 'people'} ahead`}
          </p>
        </div>
      </div>

      {/* Estimated Wait */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Clock className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Estimated Wait</p>
          <p className="text-2xl font-bold text-primary-900">{entry.estimatedWait} min</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <Users className="h-8 w-8 text-gray-600 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Queue Length</p>
          <p className="text-2xl font-bold text-primary-900">{entry.position + 2}</p>
        </div>
      </div>

      {/* Status Alert */}
      <div className={`${colors.bg} border ${colors.border} rounded-lg p-4 mb-6`}>
        <div className="flex items-start space-x-3">
          <div className={`${colors.iconBg} rounded-full p-2 flex-shrink-0`}>
            {entry.position <= 2 ? (
              <AlertCircle className={`h-5 w-5 ${colors.icon}`} />
            ) : (
              <CheckCircle className={`h-5 w-5 ${colors.icon}`} />
            )}
          </div>
          <div>
            <p className={`font-semibold ${colors.text} mb-1`}>
              {entry.position === 1 ? '🔔 Your Turn!' : entry.position === 2 ? '⚠️ Almost There!' : '✓ In Queue'}
            </p>
            <p className={`text-sm ${colors.text}`}>
              {getStatusMessage()}
            </p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Joined at:</span>
            <span className="font-semibold">{format(new Date(entry.joinedAt), 'h:mm a')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Current time:</span>
            <span className="font-semibold">{format(currentTime, 'h:mm:ss a')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="font-semibold text-green-600 capitalize">{entry.status}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {entry.position > 2 && (
          <Button variant="outline" size="lg" fullWidth onClick={onLeave}>
            Leave Queue
          </Button>
        )}
        
        <p className="text-xs text-center text-gray-500">
          We'll send you an SMS when it's almost your turn
        </p>
      </div>

      {/* Auto Refresh Notice */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
          Live updates • Refreshing automatically
        </p>
      </div>
    </div>
  )
}
