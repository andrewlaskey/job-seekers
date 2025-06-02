import Link from "next/link";
import { getApplications } from "../../actions/applicationActions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LinkButton from "@/components/ui/link-button";
import { FileText, Plus } from "lucide-react";
import ApplicationCard from "@/components/applications/appllication-card";

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  const { data: applications, error } = await getApplications();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col mb-4 gap-4 md:flex-row md:items-center md:justify-between ">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-old_rose mr-2" />
          <h1 className="text-2xl font-bold">Applications</h1>
        </div>

        <LinkButton href="/applications/new">
          <Plus className="h-4 w-4 mr-2" />
          New Application
        </LinkButton>
      </div>

        {applications && applications.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="space-y-4 p-4">
              {applications.map((application) => (
                <ApplicationCard application={application} key={application.id} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">
            It's tough out there, but you got this!
          </p>
        </div>
        )}
      </div>
  );
}
