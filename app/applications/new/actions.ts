'use server';

import { ApplicationStatus } from '@/types/applications.types';
import { ApplicationInsertFormData, ApplicationUpdate } from '@/types/applications.types';
import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createApplication(formData: ApplicationInsertFormData) {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to create an application' };
  }

  // Validate required fields
  if (!formData.title || !formData.company) {
    return { error: 'Title and company are required' };
  }

  // Create the application record
  const { data, error } = await supabase
    .from('applications')
    .insert({
      title: formData.title,
      company: formData.company,
      url: formData.url || null,
      notes: formData.notes || null,
      status: ApplicationStatus.FOUND,
      user_id: user.id,
      // created_at and found_at will use their default values (now())
      // Other timestamp fields will be null by default
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating application:', error);
    return { error: 'Failed to create application' };
  }

  // Revalidate the applications list page
  revalidatePath('/applications');
  
  return { data };
}

