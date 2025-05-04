import Link from "next/link";
import { getInterviews } from "./actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Interviews</h1>
        <Link
          href="/interviews/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Schedule Interview
        </Link>
      </div>

      {interviews && interviews.length > 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {interviews.map((interview) => (
              <li key={interview.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">
                        {interview.applications?.title} at{" "}
                        {interview.applications?.company}
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        {new Date(interview.scheduled_at!).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {interview.location && (
                        <p>Location: {interview.location}</p>
                      )}
                      {interview.interviewers &&
                        interview.interviewers.length > 0 && (
                          <p>
                            Interviewers: {interview.interviewers.join(", ")}
                          </p>
                        )}
                    </div>
                  </div>
                  {interview.notes && (
                    <p className="mt-2 text-sm text-gray-600">
                      {interview.notes}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No interviews scheduled yet.</p>
          <Link
            href="/interviews/new"
            className="mt-4 inline-block text-blue-600 hover:text-blue-800"
          >
            Schedule your first interview
          </Link>
        </div>
      )}
    </div>
  );
}
