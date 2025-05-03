'use client'

import { useActionState, useEffect, useState } from 'react'
import { Calendar, MapPin, Users, FileText } from 'lucide-react'
import { getApplications } from '@/app/applications/actions'
import { Application } from '@/types/applications.types'

interface InterviewFormProps {
  applicationId?: number
  serverAction: (prevState: any, formData: FormData) => Promise<any>
}

const initialState = {
  message: '',
  error: false,
}

export function InterviewForm({ 
  applicationId, 
  serverAction 
}: InterviewFormProps) {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [state, formAction] = useActionState(serverAction, initialState)

  useEffect(() => {
    // Only fetch applications if no applicationId is provided
    if (!applicationId) {
      const fetchApplications = async () => {
        try {
          const { data: applications, error } = await getApplications()
          if (applications) {
            setApplications(applications)
          }
        } catch (error) {
          console.error('Failed to fetch applications:', error)
        } finally {
          setLoading(false)
        }
      }
      
      fetchApplications()
    } else {
      setLoading(false)
    }
  }, [applicationId])

  if (loading) {
    return <div className="p-4">Loading applications...</div>
  }

  return (
    <form action={formAction} className="space-y-6">
      {applicationId ? (
        <input type="hidden" name="application_id" value={applicationId} />
      ) : (
        <div>
          <label htmlFor="application_id" className="block text-sm font-medium mb-2">
            Application
          </label>
          <select
            id="application_id"
            name="application_id"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an application</option>
            {applications.map((app) => (
              <option key={app.id} value={app.id}>
                {app.title} at {app.company}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="scheduled_at" className="block text-sm font-medium mb-2">
          Interview Date & Time
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="datetime-local"
            id="scheduled_at"
            name="scheduled_at"
            required
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g., Office, Zoom, Google Meet"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="interviewers" className="block text-sm font-medium mb-2">
          Interviewers
        </label>
        <div className="relative">
          <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="interviewers"
            name="interviewers"
            placeholder="Comma-separated names (e.g., John Doe, Jane Smith)"
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Enter multiple interviewers separated by commas
        </p>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium mb-2">
          Notes
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Add any preparation notes or details..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {state.message && (
        <div
          className={`p-4 rounded-md ${
            state.error
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-green-50 text-green-700 border border-green-200'
          }`}
        >
          {state.message}
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Schedule Interview
      </button>
    </form>
  )
}