'use server';

import { createClient } from '@/utils/supabase/server';
import { ApplicationStatus } from '@/types/applications.types';
import { ApplicationUpdate } from '@/types/applications.types';
import { revalidatePath } from 'next/cache';

export async function getApplications() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to view applications' };
  }

  // Get all applications for the current user
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return { error: 'Failed to fetch applications' };
  }

  return { data };
}

export async function updateApplicationStatus(applicationId: number, status: ApplicationStatus) {
    const supabase = await createClient();
  
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: 'You must be logged in to update applications' };
    }
  
    // Update the application status and relevant timestamp
    const updateData: ApplicationUpdate = { status };
    
    // Set the appropriate timestamp based on status
    if (status === 'APPLIED') {
      updateData.applied_at = new Date().toISOString();
    } else if (status === 'REJECTED') {
      updateData.rejected_at = new Date().toISOString();
    }
  
    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', applicationId)
      .eq('user_id', user.id) // Ensure user owns this application
      .select()
      .single();
  
    if (error) {
      console.error('Error updating application:', error);
      return { error: 'Failed to update application' };
    }
  
    // Revalidate the applications list page
    revalidatePath('/applications');
    
    return { data };
  }