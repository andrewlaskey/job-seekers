// app/dashboard/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CalendarDays, Building2, FileText, Plus, Briefcase } from 'lucide-react'
import { ApplicationStatus } from '@/types/applications.types'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    redirect('/login')
  }

  // Fetch upcoming interviews (within next 30 days)
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  
  const { data: interviews, error: interviewsError } = await supabase
    .from('interviews')
    .select(`
      *,
      applications!inner(
        company,
        title
      )
    `)
    .eq('user_id', user.id)
    .gte('scheduled_at', new Date().toISOString())
    .lte('scheduled_at', thirtyDaysFromNow.toISOString())
    .order('scheduled_at')

  // Fetch active applications
  const { data: activeApplications, error: applicationsError } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .in('status', [ApplicationStatus.APPLIED, ApplicationStatus.INTERVIEWING])
    .order('applied_at', { ascending: false })
    .limit(5)

  // Fetch found job listings
  const { data: foundListings, error: foundListingsError } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', ApplicationStatus.FOUND)
    .order('found_at', { ascending: false })
    .limit(5)

  if (interviewsError || applicationsError || foundListingsError) {
    console.error('Error fetching data:', interviewsError || applicationsError || foundListingsError)
  }

  const upcomingInterviews = interviews || []
  const activeApps = activeApplications || []
  const foundApps = foundListings || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
      
      {/* Upcoming Interviews Section */}
      <section className="mb-12">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CalendarDays className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-900">Upcoming Interviews</h2>
          </div>
          
          {upcomingInterviews.length > 0 ? (
            <>
              <p className="text-lg text-gray-600 mb-4">
                You have {upcomingInterviews.length} interview{upcomingInterviews.length === 1 ? '' : 's'} coming up. Good luck! 🎉
              </p>
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {interview.applications.title} at {interview.applications.company}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {new Date(interview.scheduled_at).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                          })}
                        </p>
                        {interview.location && (
                          <p className="text-sm text-gray-600 mt-1">
                            Location: {interview.location}
                          </p>
                        )}
                        {interview.interviewers && interview.interviewers.length > 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            Interviewer{interview.interviewers.length > 1 ? 's' : ''}: {interview.interviewers.join(', ')}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/applications/${interview.application_id}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Application →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-600">No upcoming interviews scheduled.</p>
          )}
        </div>
      </section>

      {/* Found Job Listings Section */}
      <section className="mb-12">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Found Job Listings</h2>
            </div>
            <Link
              href="/applications/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Job Listing
            </Link>
          </div>
          
          {foundApps.length > 0 ? (
            <>
              <p className="text-lg text-gray-600 mb-4">
                You've found {foundApps.length} potential job{foundApps.length === 1 ? '' : 's'}. Keep up the great work! 🚀
              </p>
              <div className="space-y-4">
                {foundApps.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {application.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mt-1">
                          <Building2 className="h-4 w-4 mr-1" />
                          {application.company}
                        </div>
                        <div className="flex items-center mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Found
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            Found: {new Date(application.found_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/applications/${application.id}/apply`}
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                        >
                          Apply Now →
                        </Link>
                        <Link
                          href={`/applications/${application.id}`}
                          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center mt-6">
                <Link
                  href="/applications?status=found"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View All Found Jobs →
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">You've applied to every listing you've found. Great work! 🙌</p>
              <Link
                href="/applications/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Find Your First Job
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Active Applications Section */}
      <section>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-indigo-600 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-900">Active Applications</h2>
            </div>
            <Link
              href="/applications/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Link>
          </div>
          
          {activeApps.length > 0 ? (
            <div className="space-y-4">
              {activeApps.map((application) => (
                <div
                  key={application.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {application.title}
                      </h3>
                      <div className="flex items-center text-gray-600 mt-1">
                        <Building2 className="h-4 w-4 mr-1" />
                        {application.company}
                      </div>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          application.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                          application.status === 'interviewing' ? 'bg-green-100 text-green-800' :
                          application.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {application.status?.charAt(0).toUpperCase() + application.status?.slice(1)}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          Applied: {new Date(application.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/applications/${application.id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center mt-6">
                <Link
                  href="/applications"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View All Applications →
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">You haven't added any applications yet.</p>
              <Link
                href="/applications/new"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Application
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}