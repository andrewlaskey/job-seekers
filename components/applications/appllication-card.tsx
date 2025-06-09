import { Application, ApplicationStatus } from "@/types/applications.types";
import { Blend, Building2, Heart } from "lucide-react";
import ArrowLink from "../ui/arrow-link";
import UpdateStatusButton from "./update-status-button";
import DateDisplay from "../ui/date-display";

export interface ApplicationDetailProps {
  application: Application;
}

export default function ApplicationCard({
  application,
}: ApplicationDetailProps) {
  return (
    <div
      key={application.id}
      className="border border-gray-200 rounded-lg p-4 hover:border-secondary transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">{application.title}</h3>
          <div className="flex items-center text-gray-600 mt-1">
            <Building2 className="h-4 w-4 mr-1" />
            {application.company}
          </div>
          <div className="flex items-center mt-2">
            <UpdateStatusButton
              applicationId={application.id}
              currentStatus={application.status}
            />
            {application.status === ApplicationStatus.FOUND ? (
              <span className="ml-2 text-sm text-gray-500">
                Found:{" "}
                <DateDisplay
                  dateString={application.found_at}
                  formatString="PPP"
                />
              </span>
            ) : (
              <span className="ml-2 text-sm text-gray-500">
                Applied:{" "}
                <DateDisplay
                  dateString={application.applied_at}
                  formatString="PPP"
                />
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between items-end h-full min-h-[80px]">
          <div className="flex flex-col items-end space-y-2">
          {application.status === ApplicationStatus.FOUND &&
            application.url && (
              <ArrowLink
                href={application.url}
                text="Apply Now"
                target="_blank"
              />
            )}
          <ArrowLink
            href={`/applications/${application.id}`}
            text="View Details"
          />
          </div>
          <dl className="flex items-center gap-6 text-sm mt-auto">
            <div className="flex flex-end items-center">
              <Heart
                className="w-4 h-4 text-gray-400 mr-2"
                aria-hidden="true"
              />
              <dt className="sr-only">Interest level</dt>
              <dd className="font-medium">{application.interest}</dd>
            </div>
            <div className="flex items-center">
              <Blend
                className="w-4 h-4 text-gray-400 mr-2"
                aria-hidden="true"
              />
              <dt className="sr-only">Alignment score</dt>
              <dd className="font-medium">{application.alignment}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
