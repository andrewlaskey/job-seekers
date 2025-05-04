import { InterviewJoinApplications } from "@/types/applications.types";
import { formatDateTime } from "@/utils/utils";
import ArrowLink from "../ui/arrow-link";

export interface InterviewDetailsProps {
  interview: InterviewJoinApplications;
}

export default function InterviewDetails({ interview }: InterviewDetailsProps) {
  return (
    <div
      key={interview.id}
      className="border border-gray-200 rounded-lg p-4 hover:border-secondary transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">
            {interview.applications.title} at {interview.applications.company}
          </h3>
          <p className="text-sm text-gray-600">
            {formatDateTime(interview.scheduled_at)}
          </p>
          {interview.location && (
            <p className="text-sm text-gray-600 mt-1">
              Location: {interview.location}
            </p>
          )}
          {interview.interviewers && interview.interviewers.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Interviewer
              {interview.interviewers.length > 1 ? "s" : ""}:{" "}
              {interview.interviewers.join(", ")}
            </p>
          )}
        </div>
        <ArrowLink
          href={`/applications/${interview.application_id}`}
          text="View Application"
        />
      </div>
    </div>
  );
}
