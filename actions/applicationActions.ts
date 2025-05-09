"use server";

import { createClient } from "@/utils/supabase/server";
import {
  Application,
  ApplicationInsertFormData,
  ApplicationStatus,
  ApplicationWithInterviews,
} from "@/types/applications.types";
import { ApplicationUpdate } from "@/types/applications.types";
import { revalidatePath } from "next/cache";

export async function getApplications() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to view applications" };
  }

  // Get all applications for the current user
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching applications:", error);
    return { error: "Failed to fetch applications" };
  }

  return { data };
}

export async function getApplicationsWithInterviews(
  userId: string
): Promise<{ data?: ApplicationWithInterviews[]; error?: string }> {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to view applications" };
  }

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      *,
      interviews (*)
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching applications with interviews:", error);
    throw error;
  }

  return { data };
}

export async function updateApplicationStatus(
  applicationId: number,
  status: ApplicationStatus
) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to update applications" };
  }

  const { data: application, error: findError } = await supabase
    .from("applications")
    .select()
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single();

  if (findError || !application) {
    console.error("Error updating application:", findError);
    return { error: "Failed to update application" };
  }

  // Update the application status and relevant timestamp
  const updateData: ApplicationUpdate = { status };

  // Set the appropriate timestamp based on status
  if (status === ApplicationStatus.APPLIED) {
    updateData.applied_at = new Date().toISOString();
  } else if (status === ApplicationStatus.REJECTED) {
    updateData.rejected_at = new Date().toISOString();
  }

  if (
    !application.applied_at &&
    (status === ApplicationStatus.INTERVIEWING ||
      status === ApplicationStatus.REJECTED)
  ) {
    updateData.applied_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("applications")
    .update(updateData)
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating application:", error);
    return { error: "Failed to update application" };
  }

  // Revalidate the applications list page
  revalidatePath("/applications");

  return { data };
}

export async function updateApplication(
  id: number,
  formData: ApplicationInsertFormData
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to update an application" };
  }

  try {
    const { error } = await supabase
      .from("applications")
      .update({
        title: formData.title,
        company: formData.company,
        url: formData.url,
        notes: formData.notes,
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error updating application:", error);
    return { error: "Failed to update application" };
  }
}

export async function getApplication(id: number): Promise<Application | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching application:", error);
    throw new Error("Failed to fetch application");
  }

  return data;
}

export async function deleteApplication(
  id: number
): Promise<{ success?: boolean; error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to update an application" };
  }

  try {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting application: ", error);
      return { error: "Failed to delete application" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting application: ", error);
    return { error: "Failed to delete application" };
  }
}

export async function updateDate(
  id: number,
  dateString: string,
  key: "applied_at" | "found_at" | "rejected_at"
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to update interviews" };
  }

  const updateData = {
    [key]: dateString,
  };

  const { data, error } = await supabase
    .from("applications")
    .update(updateData)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating interview:", error);
    return { error: "Failed to update interview" };
  }

  revalidatePath("/applications");

  return { data };
}
