"use client";

import { InterviewJoinApplications } from "@/types/applications.types";
import { formatDateTime } from "@/utils/utils";
import ArrowLink from "../ui/arrow-link";
import { Calendar, Check, X } from "lucide-react";
import { useState } from "react";
import { rescheduleInterview, cancelInterview } from "@/actions/interviewActions";
import { format } from "date-fns";

export interface InterviewCardProps {
  interview: InterviewJoinApplications;
  isAltVersion?: boolean;
}

export default function InterviewCard({
  interview,
  isAltVersion = false,
}: InterviewCardProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    interview.scheduled_at ? new Date(interview.scheduled_at) : null
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleDateChange = async (date: Date | null) => {
    if (!date) return;

    setIsUpdating(true);
    try {
      const result = await rescheduleInterview(
        interview.id,
        date.toISOString()
      );

      if ("error" in result) {
        console.error("Failed to update interview date:", result.error);
      } else {
        setSelectedDate(date);
        setIsDatePickerOpen(false);
      }
    } catch (error) {
      console.error("Error updating interview date:", error);
    } finally {
      setIsUpdating(false);
    }
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
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Reschedule interview"
              disabled={isCancelling}
            >
              <Calendar className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          {interview.location && (
            <p className="text-sm text-gray-600 mt-1">
              Location: {interview.location}
            </p>
          )}
          {interview.interviewers && interview.interviewers.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Interviewer
              {interview.interviewers.length > 1 ? "s:" : ":"}:{" "}
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

      {isAltVersion && interview.notes && (
        <div>
          <p className="text-sm text-gray-600 mt-1">Notes:</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap">
              {interview.notes}
            </p>
          </div>
        </div>
      )}

      {/* Date Picker Modal/Popover */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Select New Date</h3>
            <input
              type="datetime-local"
              defaultValue={
                selectedDate ? format(selectedDate, "yyyy-MM-dd'T'HH:mm") : ""
              }
              onChange={(e) => {
                const date = e.target.value ? new Date(e.target.value) : null;
                handleDateChange(date);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isUpdating}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                disabled={isUpdating}
              >
                Cancel
              </button>
              {isUpdating && (
                <span className="px-4 py-2 text-sm font-medium text-gray-500">
                  Updating...
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
