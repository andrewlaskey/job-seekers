import Link from "next/link";
import { getApplications } from "./actions";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Applications</h1>
          <Link
            href="/applications/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            New Application
          </Link>
        </div>

        {applications && applications.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {applications.map((application) => (
                <li key={application.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          <Link href={`/applications/${application.id}`}>
                            {application.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {application.company}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            application.status === "FOUND"
                              ? "bg-gray-100 text-gray-800"
                              : application.status === "APPLIED"
                                ? "bg-blue-100 text-blue-800"
                                : application.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                          }`}
                        >
                          {application.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        {application.url && (
                          <p className="flex items-center text-sm text-gray-500">
                            <a
                              href={application.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-500"
                            >
                              View Job Posting
                            </a>
                          </p>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Added on{" "}
                          {new Date(
                            application.created_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No applications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new application.
            </p>
            <div className="mt-6">
              <Link
                href="/applications/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                New Application
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
