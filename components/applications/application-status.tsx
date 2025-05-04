import { ApplicationStatus } from "@/types/applications.types"

export interface ApplicationStatusBadgeProps {
    status: ApplicationStatus;
}

export default function ApplicationStatusBadge({ status }: ApplicationStatusBadgeProps) {
    let colorClassNames = 'bg-gray-100 text-gray-800';

    switch(status) {
        case ApplicationStatus.APPLIED: {
            colorClassNames = 'bg-pacific_cyan-100 text-pacific_cyan-800';
            break;
        }
        case ApplicationStatus.INTERVIEWING: {
            colorClassNames = 'bg-light_green-100 text-light_green-800';
            break;
        }
        case ApplicationStatus.REJECTED: {
            colorClassNames = 'bg-old_rose-100 text-old_rose-800';
            break;
        }
    }

    return <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClassNames}`}
  >
    {status}
  </span>
}