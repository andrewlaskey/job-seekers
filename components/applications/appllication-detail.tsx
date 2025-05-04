import { Application, ApplicationStatus } from "@/types/applications.types";
import { Building2 } from "lucide-react";
import ApplicationStatusBadge from "./application-status";
import Link from "next/link";
import { Button } from "../ui/button";
import ArrowLink from "../ui/arrow-link";
import { formatDate } from "@/utils/utils";
import UpdateStatusButton from "./update-status-button";

export interface ApplicationDetailProps {
  application: Application;
}

export default function ApplicationDetail({
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
            <UpdateStatusButton applicationId={application.id} currentStatus={application.status} />
            <span className="ml-2 text-sm text-gray-500">
              Applied: {formatDate(application.applied_at)}
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {application.status === ApplicationStatus.FOUND &&
            application.url && (
              <ArrowLink href={application.url} text="Apply Now" />
            )}
          <ArrowLink
            href={`/applications/${application.id}`}
            text="View Details"
          />
        </div>
      </div>
    </div>
  );
}
