"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { createClient as supbaseCreateClient } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Database } from "@/types/database.types";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return encodedRedirect(
      "error",
      "/sign-up",
      "Email and password are required"
    );
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return encodedRedirect("error", "/sign-up", error.message);
  } else {
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link."
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password"
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password."
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required"
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match"
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed"
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const googleSignInAction = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      scopes: 'email profile',
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error("Google OAuth error:", error);
    return encodedRedirect("error", "/sign-in", "Failed to sign in with Google");
  }

  if (data?.url) {
    // Redirect to Google OAuth URL
    return redirect(data.url);
  }

  return encodedRedirect("error", "/sign-in", "Failed to initiate Google sign in");
};

export const deleteUserAction = async () => {
  try {
    // Get the current user's session using server client
    const supabase = await createClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return encodedRedirect("error", "/profile", "Unauthorized: Please sign in");
    }

    const userId = user.id;

    // Sign out the user first
    await supabase.auth.signOut();

    // Create admin client for deletion operations
    const adminClient = supbaseCreateClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Step 1: Delete user's interviews
    const { error: interviewsError } = await adminClient
      .from("interviews")
      .delete()
      .eq("user_id", userId);

    if (interviewsError) {
      console.error("Error deleting interviews:", interviewsError);
      return encodedRedirect(
        "error", 
        "/", 
        "Failed to delete user data. Please try again."
      );
    }

    // Step 2: Delete user's applications
    const { error: applicationsError } = await adminClient
      .from("applications")
      .delete()
      .eq("user_id", userId);

    if (applicationsError) {
      console.error("Error deleting applications:", applicationsError);
      return encodedRedirect(
        "error", 
        "/", 
        "Failed to delete user data. Please try again."
      );
    }

    // Step 3: Delete the user from auth.users
    const { error: userDeleteError } = await adminClient.auth.admin.deleteUser(userId);

    if (userDeleteError) {
      console.error("Error deleting user account:", userDeleteError);
      return encodedRedirect(
        "error", 
        "/", 
        "Failed to delete user account. Please contact support."
      );
    }

    // Redirect to home page with success message
    return encodedRedirect(
      "success",
      "/",
      "Your account and all associated data have been deleted successfully."
    );

  } catch (error) {
    console.error("Unexpected error during user deletion:", error);
    return encodedRedirect(
      "error",
      "/",
      "An unexpected error occurred. Please try again."
    );
  }
};