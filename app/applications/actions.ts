'use server';

import { createClient } from '@/utils/supabase/server';

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