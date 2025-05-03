'use client';

import { useActionState, useEffect, useState } from 'react';
import { createInterview } from './actions';
import { getApplications } from '@/app/applications/actions';
import { Application } from '@/types/applications.types';

const initialState = {
  message: '',
  error: false,
};

export default function AddInterviewPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, formAction] = useActionState(createInterview, initialState);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data: applications, error } = await getApplications();

        if (applications) {
            setApplications(applications);
        }
      } catch (error) {
        console.error('Failed to fetch applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  if (loading) {
    return <div className="p-4">Loading applications...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Schedule Interview</h1>
      
      <form action={formAction} className="space-y-6">
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

        <div>
          <label htmlFor="scheduled_at" className="block text-sm font-medium mb-2">
            Interview Date & Time
          </label>
          <input
            type="datetime-local"
            id="scheduled_at"
            name="scheduled_at"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="e.g., Office, Zoom, Google Meet"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="interviewers" className="block text-sm font-medium mb-2">
            Interviewers
          </label>
          <input
            type="text"
            id="interviewers"
            name="interviewers"
            placeholder="Comma-separated names (e.g., John Doe, Jane Smith)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter multiple interviewers separated by commas
          </p>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-2">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            placeholder="Add any preparation notes or details..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
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
    </div>
  );
}