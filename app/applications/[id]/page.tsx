import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, Calendar, MapPin, Users, Briefcase, Globe, FileText } from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to view applications' };
  }

  // Fetch the application
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (appError || !application) {
    notFound()
  }

  // Fetch associated interviews
  const { data: interviews, error: interviewsError } = await supabase
    .from('interviews')
    .select('*')
    .eq('application_id', application.id)
    .eq('user_id', user.id)
    .order('scheduled_at', { ascending: true })

  if (interviewsError) {
    console.error('Error fetching interviews:', interviewsError)
  }

  // Status color mapping
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case 'applied':
        return 'bg-blue-100 text-blue-800'
      case 'interviewing':
        return 'bg-yellow-100 text-yellow-800'
      case 'offered':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set'
    return format(new Date(dateString), 'PPP')
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Not scheduled'
    return format(new Date(dateString), 'PPP p')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/applications" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Applications
      </Link>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {application.title || 'Untitled Position'}
              </h1>
              <p className="text-lg text-gray-600">
                {application.company || 'Unknown Company'}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
              {application.status || 'Pending'}
            </span>
          </div>
        </div>

        {/* Application Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Application Details</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Found on</p>
                    <p className="font-medium text-gray-900">{formatDate(application.found_at)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Applied on</p>
                    <p className="font-medium text-gray-900">{formatDate(application.applied_at)}</p>
                  </div>
                </div>
                {application.url && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Job Posting</p>
                      <a 
                        href={application.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-blue-600 hover:text-blue-800"
                      >
                        View Posting
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Status Timeline</h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Briefcase className="w-5 h-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Current Status</p>
                    <p className="font-medium text-gray-900">{application.status || 'Pending'}</p>
                  </div>
                </div>
                {application.rejected_at && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Rejected on</p>
                      <p className="font-medium">{formatDate(application.rejected_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {application.notes && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 text-gray-400 mr-2" />
                Notes
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{application.notes}</p>
              </div>
            </div>
          )}

          {/* Interviews Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Interviews</h2>
              <Link
                href={`/applications/${application.id}/interviews/new`}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Schedule Interview
              </Link>
            </div>

            {interviews && interviews.length > 0 ? (
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <div 
                    key={interview.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {formatDateTime(interview.scheduled_at)}
                        </p>
                        {interview.location && (
                          <div className="flex items-center mt-2 text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {interview.location}
                          </div>
                        )}
                        {interview.interviewers && interview.interviewers.length > 0 && (
                          <div className="flex items-center mt-2 text-gray-600">
                            <Users className="w-4 h-4 mr-2" />
                            {interview.interviewers.join(', ')}
                          </div>
                        )}
                      </div>
                      <Link
                        href={`/applications/${application.id}/interviews/${interview.id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                    {interview.notes && (
                      <p className="mt-3 text-gray-600 text-sm">{interview.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No interviews scheduled yet</p>
                <Link
                  href={`/applications/${application.id}/interviews/new`}
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                >
                  Schedule your first interview
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <Link
          href={`/applications/${application.id}/edit`}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Edit Application
        </Link>
        {/* <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={() => {
            // Add delete functionality here
            console.log('Delete application:', application.id)
          }}
        >
          Delete Application
        </button> */}
      </div>
    </div>
  )
}