import Link from "next/link";
import { getInterviews } from "../../actions/interviewActions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LinkButton from "@/components/ui/link-button";
import InterviewCard from "@/components/interviews/interview-card";
import { Calendar1, Plus } from "lucide-react";

export default async function InterviewsPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/sign-in");
  }

  // Fetch interviews with related application data
  const { data: interviews, error } = await getInterviews();

  if (error) {
    console.error("Error fetching interviews:", error);
    return <div>Error loading interviews</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col mb-4 gap-4 md:flex-row md:items-center md:justify-between ">
        <div className="flex items-center">
          <Calendar1 className="h-6 w-6 text-old_rose mr-2" />
          <h1 className="text-2xl font-bold">Interviews</h1>
        </div>

        <LinkButton href="/interviews/new">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Interview
        </LinkButton>
      </div>

      {interviews && interviews.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="space-y-4 p-4">
            {interviews.map((interview) => (
              <InterviewCard interview={interview} key={interview.id} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 mb-4">
            Nothing scheduled at the moment.
          </p>
        </div>
      )}
    </div>
  );
}
