"use client";

import { InterviewJoinApplications } from "@/types/applications.types";
import { formatDateTime } from "@/utils/utils";
import ArrowLink from "../ui/arrow-link";
import { Check, X } from "lucide-react";
import { useState } from "react";
import { rescheduleInterview, cancelInterview } from "@/actions/interviewActions";
import DateUpdateButton from "../ui/date-update-button";
import InterviewNotes from "./interview-notes";

export interface InterviewCardProps {
  interview: InterviewJoinApplications;
  isAltVersion?: boolean;
}

export default function InterviewCard({
  interview,
  isAltVersion = false,
}: InterviewCardProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const dateChange = async (date: string) => {
    const result = await rescheduleInterview(
      interview.id,
      date
    );
    
    return result;
  };

  const handleCancelInterview = async () => {
    setIsCancelling(true);
    try {
      const success = await cancelInterview(interview.id);

      if (!success) {
        console.error("Failed to cancel interview");
      }
    } catch (error) {
      console.error("Error cancelling interview:", error);
    } finally {
      setIsCancelling(false);
      setShowCancelConfirm(false);
    }
  };

  return (
    <div
      key={interview.id}
      className="border border-gray-200 rounded-lg p-4 hover:border-secondary transition-colors"
    >
      <div className="flex justify-between items-stretch">
        <div>
          {!isAltVersion && (
            <h3 className="font-semibold text-gray-900">
              {interview.applications.title} at {interview.applications.company}
            </h3>
          )}
          <div className="flex items-center gap-2">
            {isAltVersion && (
              <p className="text-lg font-semibold text-gray-600">
                {formatDateTime(interview.scheduled_at)}
              </p>
            )}
            {!isAltVersion && (
              <p className="text-sm text-gray-600">
                {formatDateTime(interview.scheduled_at)}
              </p>
            )}
            <DateUpdateButton currentDate={interview.scheduled_at} asyncUpdateFn={(date) => dateChange(date)} />
          </div>
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

        <div className="h-full">
          {!isAltVersion && (
            <ArrowLink
              href={`/applications/${interview.application_id}`}
              text="View Application"
            />
          )}

          <div
            className={`mt-4 flex ${isAltVersion ? "justify-start" : "justify-end"}`}
          >
            {!showCancelConfirm ? (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                disabled={isCancelling}
              >
                Cancel
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Are you sure?</span>
                <button
                  onClick={handleCancelInterview}
                  className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full transition-colors"
                  disabled={isCancelling}
                  aria-label="Confirm cancel"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                  disabled={isCancelling}
                  aria-label="Cancel cancellation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {isAltVersion && (
        <InterviewNotes interview={interview} />
      )}
    </div>
  );
}
