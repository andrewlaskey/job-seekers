// app/dashboard/page.tsx
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CalendarDays, FileText, Plus, Briefcase } from "lucide-react";
import { ApplicationStatus } from "@/types/applications.types";
import ApplicationDetail from "@/components/applications/appllication-detail";
import { Button } from "@/components/ui/button";
import LinkButton from "@/components/ui/link-button";
import ArrowLink from "@/components/ui/arrow-link";
import InterviewDetails from "@/components/interviews/interview-details";
import H2 from "@/components/typography/h2";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  // Fetch upcoming interviews (within next 30 days)
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const { data: interviews, error: interviewsError } = await supabase
    .from("interviews")
    .select(
      `
      *,
      applications!inner(
        company,
        title
      )
    `
    )
    .eq("user_id", user.id)
    .gte("scheduled_at", new Date().toISOString())
    .lte("scheduled_at", thirtyDaysFromNow.toISOString())
    .order("scheduled_at");

  // Fetch active applications
  const { data: activeApplications, error: applicationsError } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .in("status", [ApplicationStatus.APPLIED, ApplicationStatus.INTERVIEWING])
    .order("applied_at", { ascending: false })
    .limit(5);

  // Fetch found job listings
  const { data: foundListings, error: foundListingsError } = await supabase
    .from("applications")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", ApplicationStatus.FOUND)
    .order("found_at", { ascending: false })
    .limit(5);

  if (interviewsError || applicationsError || foundListingsError) {
    console.error(
      "Error fetching data:",
      interviewsError || applicationsError || foundListingsError
    );
  }

  const upcomingInterviews = interviews || [];
  const activeApps = activeApplications || [];
  const foundApps = foundListings || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Upcoming Interviews Section */}
      <section className="mb-12">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CalendarDays className="h-6 w-6 text-old_rose mr-2" />
              <H2>Upcoming Interviews</H2>
            </div>
            <LinkButton href="/interviews/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Interview
            </LinkButton>
          </div>

          {upcomingInterviews.length > 0 ? (
            <>
              <p className="text-lg text-gray-600 mb-4">
                You have {upcomingInterviews.length} interview
                {upcomingInterviews.length === 1 ? "" : "s"} coming up. Good
                luck! 🎉
              </p>
              <div className="space-y-4">
                {upcomingInterviews.map((interview) => (
                  <InterviewDetails interview={interview} key={interview.id} />
                ))}
              </div>
              <div className="flex justify-center mt-6">
                <ArrowLink href="/interviews" text="View All Interviews" />
              </div>
            </>
          ) : (
            <p className="text-gray-600">No upcoming interviews scheduled.</p>
          )}
        </div>
      </section>

      {/* Found Job Listings Section */}
      <section className="mb-12">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Briefcase className="h-6 w-6 text-old_rose mr-2" />
              <H2>Found Job Listings</H2>
            </div>
            <LinkButton href="/applications/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Job Listing
            </LinkButton>
          </div>

          {foundApps.length > 0 ? (
            <>
              <p className="text-lg text-gray-600 mb-4">
                You've found {foundApps.length} potential job
                {foundApps.length === 1 ? "" : "s"}. Keep up the great work! 🚀
              </p>
              <div className="space-y-4">
                {foundApps.map((application) => (
                  <ApplicationDetail
                    application={application}
                    key={application.id}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <p className="text-lg text-gray-600 mb-4">
                You've applied to every listing you've found. Great work! 🙌
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Active Applications Section */}
      <section>
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FileText className="h-6 w-6 text-old_rose mr-2" />
              <H2>Active Applications</H2>
            </div>
            <LinkButton href="/applications/new">
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </LinkButton>
          </div>

          {activeApps.length > 0 ? (
            <div className="space-y-4">
              {activeApps.map((application) => (
                <ApplicationDetail
                  application={application}
                  key={application.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-lg text-gray-600 mb-4">
                You don't have any active applications.
              </p>
            </div>
          )}
          <div className="flex justify-center mt-6">
            <ArrowLink href="/applications" text="View All Applications" />
          </div>
        </div>
      </section>
    </div>
  );
}
