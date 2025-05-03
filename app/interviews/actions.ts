'use server';

import { createClient } from '@/utils/supabase/server';

export async function getInterviews() {
  const supabase = await createClient();

  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError || !user) {
    return { error: 'You must be logged in to view applications' };
  }

  // Get all applications for the current user
  const { data, error } = await supabase
    .from('interviews')
    .select(`
        *,
        applications!inner(
          title,
          company
        )
      `)
    .eq('user_id', user.id)
    .order('scheduled_at', { ascending: true });

  if (error) {
    console.error('Error fetching applications:', error);
    return { error: 'Failed to fetch applications' };
  }

  return { data };
}