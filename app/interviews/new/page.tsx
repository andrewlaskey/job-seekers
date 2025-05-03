'use client'

import { InterviewForm } from '@/components/interview-form'
import { createInterview } from './actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewInterviewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/interviews" 
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Interviews
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Schedule Interview</h1>
        
        <div className="bg-white shadow-lg rounded-lg p-6">
          <InterviewForm serverAction={createInterview} />
        </div>
      </div>
    </div>
  )
}