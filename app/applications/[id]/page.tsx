import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Globe, FileText, Plus, Calendar1 } from "lucide-react";
import ArrowLink from "@/components/ui/arrow-link";
import LinkButton from "@/components/ui/link-button";
import H2 from "@/components/typography/h2";
import InterviewCard from "@/components/interviews/interview-card";
import ReturnLink from "@/components/ui/return-link";
import UpdateStatusButton from "@/components/applications/update-status-button";
import { ApplicationStatus } from "@/types/applications.types";
import DeleteApplicationButton from "@/components/applications/application-delete-button";
import ApplicationDateDisplay from "@/components/applications/application-date-display";
import ApplicationNotes from "@/components/applications/application-notes";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApplicationDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "You must be logged in to view applications" };
  }

  // Fetch the application
  const { data: application, error: appError } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (appError || !application) {
    notFound();
  }

  // Fetch associated interviews
  const { data: interviews, error: interviewsError } = await supabase
    .from("interviews")
    .select("*")
    .eq("application_id", application.id)
    .eq("user_id", user.id)
    .order("scheduled_at", { ascending: true });

  if (interviewsError) {
    console.error("Error fetching interviews:", interviewsError);
  }

  // Status color mapping
  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-blue-100 text-blue-800";
      case "interviewing":
        return "bg-yellow-100 text-yellow-800";
      case "offered":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ReturnLink href="/applications" text="Back to Applications" />

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {application.title || "Untitled Position"}
              </h1>
              <p className="text-lg text-gray-600">
                {application.company || "Unknown Company"}
              </p>
            </div>
            <UpdateStatusButton
              applicationId={application.id}
              currentStatus={application.status}
            />
          </div>
        </div>

        {/* Application Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Application Details
              </h2>
              <div className="space-y-3">
                <ApplicationDateDisplay
                  application={application}
                  text="Found on"
                  dateKey="found_at"
                />
                <ApplicationDateDisplay
                  application={application}
                  text="Applied on"
                  dateKey="applied_at"
                />
                {application.rejected_at && (
                  <ApplicationDateDisplay
                    application={application}
                    text="Rejected on"
                    dateKey="rejected_at"
                  />
                )}
                {application.url && (
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Job Posting</p>
                      <Link
                        href={application.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Posting
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <ApplicationNotes application={application} />
          </div>

          {/* Interviews Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <Calendar1 className="h-6 w-6 text-old_rose mr-2" />
                <H2>Interviews</H2>
              </div>
              <LinkButton
                href={`/applications/${application.id}/interviews/new`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Interview
              </LinkButton>
            </div>

            {interviews && interviews.length > 0 ? (
              <div className="space-y-4">
                {interviews.map((interview) => (
                  <InterviewCard
                    interview={{ ...interview, applications: application }}
                    key={interview.id}
                    isAltVersion={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No interviews scheduled yet.</p>
                {application.status === ApplicationStatus.FOUND && (
                  <div>
                    <p className="text-gray-500">
                      Let's fix that by submitting an application. You got this!
                      🫡
                    </p>
                    <ArrowLink
                      href={application.url}
                      text="Apply Now"
                      target="_blank"
                    />
                  </div>
                )}
                {application.status !== ApplicationStatus.FOUND && (
                  <p className="text-gray-500">
                    Hoping they reach out to you 🤞
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex gap-4">
        <Link
          href={`/applications/${application.id}/edit`}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Edit Application
        </Link>
        <DeleteApplicationButton applicationId={application.id} />
      </div>
    </div>
  );
}
