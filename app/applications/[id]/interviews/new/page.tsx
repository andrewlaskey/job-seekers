import { InterviewForm } from '@/components/interview-form'
import { createApplicationInterview } from './actions'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function NewApplicationInterviewPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Verify the application exists
  const { data: application, error } = await supabase
    .from('applications')
    .select('id, title, company')
    .eq('id', id)
    .single()

  if (error || !application) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href={`/applications/${id}`}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Application
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule Interview</h1>
        <p className="text-gray-600 mb-6">
          for {application.title} at {application.company}
        </p>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <InterviewForm 
            applicationId={Number(id)} 
            serverAction={createApplicationInterview}
          />
        </div>
      </div>
    </div>
  )
}