import { addDays, format, subDays } from "date-fns";
import { ApplicationWithInterviews } from "@/types/applications.types";
import { formatDateShort } from "@/utils/utils";

interface ActivityGraphProps {
  applications: ApplicationWithInterviews[] | undefined;
}

interface ActivityCounter {
  interviews: number;
  applications: number;
}

function generateLast90DaysMap(): Map<string, ActivityCounter> {
  const result = new Map<string, ActivityCounter>();
  const today = new Date();
  const startDay = subDays(today, 90);

  for (let i = 1; i <= 90; i++) {
    const date = addDays(startDay, i);
    const dateString = format(date, "MM/dd/yyyy");
    result.set(dateString, { interviews: 0, applications: 0 });
  }

  return result;
}

function backgroundColorClass(activity: ActivityCounter) {
  if (activity.interviews > 0) {
    return "bg-xanthous";
  }

  if (activity.applications === 1) {
    return "bg-persian_green-800";
  } else if (activity.applications === 2) {
    return "bg-persian_green-700";
  } else if (activity.applications === 3) {
    return "bg-persian_green-600";
  } else if (activity.applications === 4) {
    return "bg-persian_green-500";
  } else if (activity.applications >= 5) {
    return "bg-persian_green-400";
  }

  return "bg-gray-100";
}

function ActivityGraph({ applications }: ActivityGraphProps) {
  const activityByDate = applications?.reduce((dates, application) => {
    if (application.applied_at) {
      const key = formatDateShort(application.applied_at);

      if (dates.has(key)) {
        const item = dates.get(key);

        if (item) {
          item.applications++;
        }
      } else {
        dates.set(key, { interviews: 0, applications: 1 });
      }
    }

    if (application.interviews && application.interviews.length > 0) {
      application.interviews.forEach((interview) => {
        if (interview.scheduled_at) {
          const key = formatDateShort(interview.scheduled_at);

          if (dates.has(key)) {
            const item = dates.get(key);

            if (item) {
              item.interviews++;
            }
          } else {
            dates.set(key, { interviews: 1, applications: 0 });
          }
        }
      });
    }

    return dates;
  }, new Map<string, { applications: number; interviews: number }>());

  const past90Days = generateLast90DaysMap();

  past90Days.keys().forEach((day) => {
    const activity = activityByDate?.get(day);

    if (activity) {
      past90Days.set(day, activity);
    }
  });

  return (
    <div className="flex flex-wrap gap-1 py-8">
      {Array.from(past90Days).map(([day, activity]) => {
        return (
          <div key={day} className={`group relative size-5 shrink ${backgroundColorClass(activity)}`}>
            <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm text-white bg-gray-900 whitespace-nowrap">
              <p>{day}</p>
              <p>Applications: {activity.applications}</p>
              <p>Interviews: {activity.interviews}</p>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ActivityGraph;
