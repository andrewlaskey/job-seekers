"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getInterviews() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to view applications" };
  }

  // Get all applications for the current user
  const { data, error } = await supabase
    .from("interviews")
    .select(
      `
        *,
        applications!inner(
          title,
          company
        )
      `
    )
    .eq("user_id", user.id)
    .order("scheduled_at", { ascending: true });

  if (error) {
    console.error("Error fetching applications:", error);
    return { error: "Failed to fetch applications" };
  }

  return { data };
}

export async function cancelInterview(id: number): Promise<boolean> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return false;
  }

  const { error } = await supabase
    .from("interviews")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching applications:", error);
    return false;
  }

  revalidatePath("/interviews");
  
  return true;
}

export async function rescheduleInterview(id: number, dateString: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to update interviews" };
  }

  const updateData = {
    scheduled_at: dateString,
  };

  const { data, error } = await supabase
    .from("interviews")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating interview:", error);
    return { error: "Failed to update interview" };
  }

  revalidatePath("/interviews");

  return { data };
}

export async function updateInterviewNotes(id: number, notes: string | null) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to update an interview" };
  }

  try {
    const { error } = await supabase
      .from("interviews")
      .update({
        notes: notes,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/interviews");

    return { success: true };
  } catch (error) {
    console.error("Error updating interview:", error);
    return { error: "Failed to update interview" };
  }
}