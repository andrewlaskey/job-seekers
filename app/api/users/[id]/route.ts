import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/types/database.types";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, verify the requesting user has permission to delete this account
    // by using the cookie-based client
    const supabase = await createServerClient();

    // Get the current user's session
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await supabase.auth.signOut();

    // For admin operations, create a new client with the service role key
    const adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Step 1: Delete user's interviews
    const { error: interviewsError } = await adminClient
      .from("interviews")
      .delete()
      .eq("user_id", user.id);

    if (interviewsError) {
      console.error("Error deleting interviews:", interviewsError);
      return NextResponse.json(
        { error: "Failed to delete user interviews" },
        { status: 500 }
      );
    }

    // Step 2: Delete user's applications
    const { error: applicationsError } = await adminClient
      .from("applications")
      .delete()
      .eq("user_id", user.id);

    if (applicationsError) {
      console.error("Error deleting applications:", applicationsError);
      return NextResponse.json(
        { error: "Failed to delete user applications" },
        { status: 500 }
      );
    }

    // Step 3: Delete the user from auth.users
    const { error: userDeleteError } =
      await adminClient.auth.admin.deleteUser(user.id);

    if (userDeleteError) {
      console.error("Error deleting user account:", userDeleteError);
      return NextResponse.json(
        { error: "Failed to delete user account" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "User and all associated data deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error during user deletion:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
