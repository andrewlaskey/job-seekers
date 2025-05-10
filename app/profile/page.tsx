import ProfileDeleteButton from "@/components/profile/profile-delete-button";
import H2 from "@/components/typography/h2";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        <H2>Hello, {user.email} 👋</H2>
      </div>
      <section className="mb-12">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-lg text-gray-600 mb-4">
            Delete your account and all of your user data.<br />Careful. This is irreversible. ⚠️
          </p>
          <ProfileDeleteButton userId={user.id} />
        </div>
      </section>
    </div>
  );
}
