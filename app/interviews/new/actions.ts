'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { updateApplicationStatus } from '@/actions/applicationActions';
import { ApplicationStatus } from '@/types/applications.types';

export async function createInterview(prevState: any, formData: FormData) {
  const supabase = await createClient();
  
  try {
    // Get form values
    const application_id = parseInt(formData.get('application_id') as string);
    const scheduled_at = formData.get('scheduled_at') as string;
    const location = formData.get('location') as string;
    const interviewersInput = formData.get('interviewers') as string;
    const notes = formData.get('notes') as string;

    // Process interviewers array
    const interviewers = interviewersInput
      ? interviewersInput.split(',').map(name => name.trim()).filter(Boolean)
      : null;

    // Validate required fields
    if (!application_id || !scheduled_at) {
      return {
        message: 'Application and scheduled date are required',
        error: true,
      };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
  
    if (authError || !user) {
      return { 
        message: 'You must be logged in to create an interview',
        error: true 
      };
    }

    // Create the interview record
    const { data, error } = await supabase
      .from('interviews')
      .insert({
        application_id,
        scheduled_at,
        location: location || null,
        interviewers,
        notes: notes || null,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return {
        message: 'Failed to create interview: ' + error.message,
        error: true,
      };
    }

    await updateApplicationStatus(application_id, ApplicationStatus.INTERVIEWING);

    // Revalidate the interviews list page
    revalidatePath('/interviews');
    
  } catch (error) {
    console.error('Server action error:', error);
    return {
      message: 'An unexpected error occurred',
      error: true,
    };
  }
  
  redirect('/interviews');
}