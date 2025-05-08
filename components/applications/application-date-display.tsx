"use client";

import { Application } from "@/types/applications.types";
import DateUpdateButton from "../ui/date-update-button";
import { formatDate } from "@/utils/utils";
import { updateDate } from "@/actions/applicationActions";

interface ApplicationDateDisplayProps {
  text: string;
  application: Application;
  dateKey: "applied_at" | "found_at" | "rejected_at";
}

export default function ApplicationDateDisplay({
  text,
  application,
  dateKey,
}: ApplicationDateDisplayProps) {
  const handleDateChange = async (date: string) => {
    const result = await updateDate(application.id, date, dateKey);

    return result;
  };

  return (
    <div className="flex items-center">
      <DateUpdateButton
        currentDate={application[dateKey]}
        asyncUpdateFn={handleDateChange}
      />
      <div>
        <p className="text-sm text-gray-500">{text}</p>
        <p className="font-medium text-gray-900">
          {formatDate(application[dateKey])}
        </p>
      </div>
    </div>
  );
}
