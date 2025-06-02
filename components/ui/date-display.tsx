import { format } from "date-fns";

interface DateDisplayProps {
  dateString: string | null;
  formatString?: string;
  showTimezone?: boolean;
  fallback?: string;
}

export default function DateDisplay({ 
  dateString, 
  formatString = "PPpp", // Default: "Jan 1, 2025 at 2:30 PM"
  showTimezone = false,
  fallback = "Not set"
}: DateDisplayProps) {
  if (!dateString) {
    return <span className="text-gray-500">{fallback}</span>;
  }

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return <span className="text-red-500">Invalid date</span>;
    }

    const formattedDate = format(date, formatString);
    
    if (showTimezone) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return (
        <span>
          {formattedDate} 
          <span className="text-xs text-gray-500 ml-1">({timezone})</span>
        </span>
      );
    }
    
    return <span>{formattedDate}</span>;
  } catch (error) {
    console.error("Error formatting date:", error);
    return <span className="text-red-500">Invalid date</span>;
  }
}